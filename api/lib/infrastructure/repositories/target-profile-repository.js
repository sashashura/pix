const _ = require('lodash');
const bluebird = require('bluebird');
const BookshelfTargetProfile = require('../orm-models/TargetProfile');
const skillDatasource = require('../datasources/learning-content/skill-datasource');
const skillRepository = require('./skill-repository');
const targetProfileAdapter = require('../adapters/target-profile-adapter');
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
const { knex } = require('../../../db/knex-database-connection');
const { NotFoundError, ObjectValidationError, InvalidSkillSetError } = require('../../domain/errors');
const DomainTransaction = require('../../infrastructure/DomainTransaction');
const TargetProfile = require('../../domain/models/TargetProfile');
const Stage = require('../../domain/models/Stage');

const TARGET_PROFILE_TABLE = 'target-profiles';

module.exports = {
  async createWithTubes({ targetProfileForCreation, domainTransaction }) {
    const knexConn = domainTransaction.knexTransaction;
    const targetProfileRawData = _.pick(targetProfileForCreation, [
      'name',
      'category',
      'description',
      'comment',
      'isPublic',
      'imageUrl',
      'ownerOrganizationId',
    ]);
    const [{ id: targetProfileId }] = await knexConn(TARGET_PROFILE_TABLE).insert(targetProfileRawData).returning('id');

    const tubesData = targetProfileForCreation.tubes.map((tube) => ({
      targetProfileId,
      tubeId: tube.id,
      level: tube.level,
    }));
    await knexConn.batchInsert('target-profile_tubes', tubesData);

    return targetProfileId;
  },

  async updateTargetProfileWithSkills({ targetProfileId, skills, domainTransaction }) {
    const knexConn = domainTransaction.knexTransaction;
    const skillsToAdd = skills.map((skill) => {
      return { targetProfileId, skillId: skill.id };
    });
    await knexConn.batchInsert('target-profiles_skills', skillsToAdd);
  },

  async get(id, domainTransaction = DomainTransaction.emptyTransaction()) {
    const targetProfileBookshelf = await BookshelfTargetProfile.where({ id }).fetch({
      require: false,
      withRelated: ['skillIds'],
      transacting: domainTransaction.knexTransaction,
    });

    if (!targetProfileBookshelf) {
      throw new NotFoundError(`Le profil cible avec l'id ${id} n'existe pas`);
    }

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async getByCampaignId(campaignId) {
    const targetProfileBookshelf = await BookshelfTargetProfile.query((qb) => {
      qb.innerJoin('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
      qb.innerJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id');
    })
      .where({ 'campaigns.id': campaignId })
      .fetch({
        withRelated: [
          'skillIds',
          {
            stages: function (query) {
              query.orderBy('threshold', 'ASC');
            },
          },
          'badges',
        ],
      });

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async getTargetProfileSkillIdsByCampaignId(campaignId) {
    return knex('target-profiles_skills')
      .join('campaigns', 'campaigns.targetProfileId', 'target-profiles_skills.targetProfileId')
      .where('campaigns.id', campaignId)
      .pluck('skillId');
  },

  async getByCampaignParticipationId({ campaignParticipationId, domainTransaction }) {
    const knexConn = domainTransaction?.knexConnection || knex;

    const targetProfileDTO = await knexConn(TARGET_PROFILE_TABLE)
      .select('target-profiles.*')
      .innerJoin('campaigns', 'campaigns.targetProfileId', 'target-profiles.id')
      .innerJoin('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id')
      .innerJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id')
      .where({ 'campaign-participations.id': campaignParticipationId })
      .first();

    const skillIds = await knexConn('target-profiles_skills').distinct('skillId').pluck('skillId').where({
      targetProfileId: targetProfileDTO.id,
    });

    const targetProfileStages = await knexConn('stages')
      .where({
        targetProfileId: targetProfileDTO.id,
      })
      .orderBy('threshold', 'ASC');

    const skills = await skillRepository.findOperativeByIds(skillIds);

    return _toDomain({ targetProfileDTO, targetProfileStages, skills });
  },

  async findAllTargetProfilesOrganizationCanUse(ownerOrganizationId) {
    const targetProfilesBookshelf = await BookshelfTargetProfile.query((qb) => {
      qb.where({ ownerOrganizationId, outdated: false });
      qb.orWhere({ isPublic: true, outdated: false });
    }).fetchAll({ withRelated: ['skillIds'] });

    return bluebird.mapSeries(targetProfilesBookshelf, _getWithLearningContentSkills);
  },

  async findByIds(targetProfileIds) {
    const targetProfilesBookshelf = await BookshelfTargetProfile.query((qb) => {
      qb.whereIn('id', targetProfileIds);
    }).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfTargetProfile, targetProfilesBookshelf);
  },

  async update(targetProfile) {
    let results;
    const editedAttributes = _.pick(targetProfile, [
      'name',
      'outdated',
      'description',
      'comment',
      'isSimplifiedAccess',
    ]);

    try {
      results = await knex(TARGET_PROFILE_TABLE)
        .where({ id: targetProfile.id })
        .update(editedAttributes)
        .returning(['id', 'isSimplifiedAccess']);
    } catch (error) {
      throw new ObjectValidationError();
    }

    if (!results.length) {
      throw new NotFoundError(`Le profil cible avec l'id ${targetProfile.id} n'existe pas`);
    }

    return new TargetProfile(results[0]);
  },

  async findOrganizationIds(targetProfileId) {
    const targetProfile = await knex(TARGET_PROFILE_TABLE).select('id').where({ id: targetProfileId }).first();
    if (!targetProfile) {
      throw new NotFoundError(`No target profile for ID ${targetProfileId}`);
    }

    const targetProfileShares = await knex('target-profile-shares')
      .select('organizationId')
      .where({ 'target-profile-shares.targetProfileId': targetProfileId });
    return targetProfileShares.map((targetProfileShare) => targetProfileShare.organizationId);
  },

  async hasSkills({ targetProfileId, skillIds }, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const result = await (knexTransaction ?? knex)('target-profiles_skills')
      .select('skillId')
      .whereIn('skillId', skillIds)
      .andWhere('targetProfileId', targetProfileId);

    const unknownSkillIds = _.difference(skillIds, _.map(result, 'skillId'));
    if (unknownSkillIds.length) {
      throw new InvalidSkillSetError(`Les acquis suivants ne font pas partie du profil cible : ${unknownSkillIds}`);
    }

    return true;
  },
};

async function _getWithLearningContentSkills(targetProfile) {
  const associatedSkillDatasourceObjects = await _getLearningContentDataObjectsSkills(targetProfile);

  return targetProfileAdapter.fromDatasourceObjects({
    bookshelfTargetProfile: targetProfile,
    associatedSkillDatasourceObjects,
  });
}

function _getLearningContentDataObjectsSkills(bookshelfTargetProfile) {
  const skillRecordIds = bookshelfTargetProfile
    .related('skillIds')
    .map((BookshelfSkillId) => BookshelfSkillId.get('skillId'));
  return skillDatasource.findOperativeByRecordIds(skillRecordIds);
}

function _toDomain({ targetProfileDTO, targetProfileStages, skills }) {
  return new TargetProfile({
    ...targetProfileDTO,
    skills,
    stages: targetProfileStages
      .filter(({ targetProfileId }) => targetProfileId === targetProfileDTO.id)
      .map((s) => new Stage(s)),
  });
}
