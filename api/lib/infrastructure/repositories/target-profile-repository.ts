// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfT... Remove this comment to see the full error message
const BookshelfTargetProfile = require('../orm-models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileAdapter = require('../adapters/target-profile-adapter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
  TargetProfileCannotBeCreated,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
  ObjectValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSki... Remove this comment to see the full error message
  InvalidSkillSetError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
  OrganizationNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../domain/models/TargetProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PGSQL_FORE... Remove this comment to see the full error message
const { PGSQL_FOREIGN_KEY_VIOLATION_ERROR } = require('../../../db/pgsql-errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(targetProfileForCreation: $TSFixMe) {
    try {
      return await knex.transaction(async (trx: $TSFixMe) => {
        const targetProfileRawData = _.pick(targetProfileForCreation, [
          'name',
          'isPublic',
          'imageUrl',
          'ownerOrganizationId',
          'comment',
          'description',
          'category',
          'targetProfileTemplateId',
        ]);

        const [{ id: targetProfileId }] = await trx('target-profiles').insert(targetProfileRawData).returning('id');

        const skillsIdList = _.uniq(targetProfileForCreation.skillIds);

        const skillToAdd = skillsIdList.map((skillId: $TSFixMe) => {
          return { targetProfileId, skillId };
        });

        await trx.batchInsert('target-profiles_skills', skillToAdd);

        const tubes = targetProfileForCreation.tubes.map((tube: $TSFixMe) => ({
          targetProfileId,
          tubeId: tube.id,
          level: tube.level
        }));
        await trx.batchInsert('target-profile_tubes', tubes);

        return targetProfileId;
      });
    } catch (e) {
      if ((e as $TSFixMe).code === PGSQL_FOREIGN_KEY_VIOLATION_ERROR) {
        throw new OrganizationNotFoundError();
      }

      throw new TargetProfileCannotBeCreated();
    }
  },

  async get(id: $TSFixMe, domainTransaction = DomainTransaction.emptyTransaction()) {
    const targetProfileBookshelf = await BookshelfTargetProfile.where({ id }).fetch({
      require: false,
      withRelated: ['skillIds'],
      transacting: domainTransaction.knexTransaction,
    });

    if (!targetProfileBookshelf) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Le profil cible avec l'id ${id} n'existe pas`);
    }

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async getByCampaignId(campaignId: $TSFixMe) {
    const targetProfileBookshelf = await BookshelfTargetProfile.query((qb: $TSFixMe) => {
      qb.innerJoin('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
      qb.innerJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id');
    })
      .where({ 'campaigns.id': campaignId })
      .fetch({
        withRelated: [
          'skillIds',
          {
            stages: function (query: $TSFixMe) {
              query.orderBy('threshold', 'ASC');
            },
          },
        ],
      });

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async getByCampaignParticipationId(campaignParticipationId: $TSFixMe) {
    const targetProfileBookshelf = await BookshelfTargetProfile.query((qb: $TSFixMe) => {
      qb.innerJoin('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
      qb.innerJoin('campaign-participations', 'campaign-participations.campaignId', 'campaigns.id');
      qb.innerJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id');
    })
      .where({ 'campaign-participations.id': campaignParticipationId })
      .fetch({
        withRelated: [
          'skillIds',
          {
            stages: function (query: $TSFixMe) {
              query.orderBy('threshold', 'ASC');
            },
          },
        ],
      });

    return _getWithLearningContentSkills(targetProfileBookshelf);
  },

  async findAllTargetProfilesOrganizationCanUse(ownerOrganizationId: $TSFixMe) {
    const targetProfilesBookshelf = await BookshelfTargetProfile.query((qb: $TSFixMe) => {
      qb.where({ ownerOrganizationId, outdated: false });
      qb.orWhere({ isPublic: true, outdated: false });
    }).fetchAll({ withRelated: ['skillIds'] });

    return bluebird.mapSeries(targetProfilesBookshelf, _getWithLearningContentSkills);
  },

  async findByIds(targetProfileIds: $TSFixMe) {
    const targetProfilesBookshelf = await BookshelfTargetProfile.query((qb: $TSFixMe) => {
      qb.whereIn('id', targetProfileIds);
    }).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfTargetProfile, targetProfilesBookshelf);
  },

  findPaginatedFiltered({
    filter,
    page
  }: $TSFixMe) {
    return BookshelfTargetProfile.query((qb: $TSFixMe) => _setSearchFiltersForQueryBuilder(filter, qb))
      .fetchPage({
        page: page.number,
        pageSize: page.size,
      })
      .then(({
      models,
      pagination
    }: $TSFixMe) => {
        const targetProfiles = bookshelfToDomainConverter.buildDomainObjects(BookshelfTargetProfile, models);
        return { models: targetProfiles, pagination };
      });
  },

  async update(targetProfile: $TSFixMe) {
    let results;
    const editedAttributes = _.pick(targetProfile, [
      'name',
      'outdated',
      'description',
      'comment',
      'isSimplifiedAccess',
    ]);

    try {
      results = await knex('target-profiles')
        .where({ id: targetProfile.id })
        .update(editedAttributes)
        .returning(['id', 'isSimplifiedAccess']);
    } catch (error) {
      throw new ObjectValidationError();
    }

    if (!results.length) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Le profil cible avec l'id ${targetProfile.id} n'existe pas`);
    }

    return new TargetProfile(results[0]);
  },

  async findOrganizationIds(targetProfileId: $TSFixMe) {
    const targetProfile = await knex('target-profiles').select('id').where({ id: targetProfileId }).first();
    if (!targetProfile) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`No target profile for ID ${targetProfileId}`);
    }

    const targetProfileShares = await knex('target-profile-shares')
      .select('organizationId')
      .where({ 'target-profile-shares.targetProfileId': targetProfileId });
    return targetProfileShares.map((targetProfileShare: $TSFixMe) => targetProfileShare.organizationId);
  },

  async hasSkills({
    targetProfileId,
    skillIds
  }: $TSFixMe, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const result = await (knexTransaction ?? knex)('target-profiles_skills')
      .select('skillId')
      .whereIn('skillId', skillIds)
      .andWhere('targetProfileId', targetProfileId);

    const unknownSkillIds = _.difference(skillIds, _.map(result, 'skillId'));
    if (unknownSkillIds.length) {
      throw new InvalidSkillSetError(`Unknown skillIds : ${unknownSkillIds}`);
    }

    return true;
  },
};

async function _getWithLearningContentSkills(targetProfile: $TSFixMe) {
  const associatedSkillDatasourceObjects = await _getLearningContentDataObjectsSkills(targetProfile);

  return targetProfileAdapter.fromDatasourceObjects({
    bookshelfTargetProfile: targetProfile,
    associatedSkillDatasourceObjects,
  });
}

function _getLearningContentDataObjectsSkills(bookshelfTargetProfile: $TSFixMe) {
  const skillRecordIds = bookshelfTargetProfile
    .related('skillIds')
    .map((BookshelfSkillId: $TSFixMe) => BookshelfSkillId.get('skillId'));
  return skillDatasource.findOperativeByRecordIds(skillRecordIds);
}

function _setSearchFiltersForQueryBuilder(filter: $TSFixMe, qb: $TSFixMe) {
  const { name, id } = filter;
  if (name) {
    qb.whereRaw('LOWER("name") LIKE ?', `%${name.toLowerCase()}%`);
  }
  if (id) {
    qb.where({ id });
  }
}
