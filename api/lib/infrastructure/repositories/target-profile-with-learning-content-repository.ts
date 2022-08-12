// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fp'.
const fp = require('lodash/fp');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileWithLearningContent = require('../../domain/models/TargetProfileWithLearningContent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedSk... Remove this comment to see the full error message
const TargetedSkill = require('../../domain/models/TargetedSkill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedTu... Remove this comment to see the full error message
const TargetedTube = require('../../domain/models/TargetedTube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedTh... Remove this comment to see the full error message
const TargetedThematic = require('../../domain/models/TargetedThematic');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedCo... Remove this comment to see the full error message
const TargetedCompetence = require('../../domain/models/TargetedCompetence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedAr... Remove this comment to see the full error message
const TargetedArea = require('../../domain/models/TargetedArea');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../domain/models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../domain/models/BadgeCriterion');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../domain/models/SkillSet');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../domain/models/Stage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeReposi... Remove this comment to see the full error message
const tubeRepository = require('./tube-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'thematicRe... Remove this comment to see the full error message
const thematicRepository = require('./thematic-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeR... Remove this comment to see the full error message
const challengeRepository = require('./challenge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tubeDataso... Remove this comment to see the full error message
const tubeDatasource = require('../datasources/learning-content/tube-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceDatasource = require('../datasources/learning-content/competence-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../datasources/learning-content/area-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, TargetProfileInvalidError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getTransla... Remove this comment to see the full error message
const { getTranslatedText } = require('../../domain/services/get-translated-text');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileTube = require('../../domain/models/TargetProfileTube');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    id,
    locale = FRENCH_FRANCE
  }: $TSFixMe) {
    const whereClauseFnc = (queryBuilder: $TSFixMe) => {
      return queryBuilder.where('target-profiles.id', id);
    };

    return _get(whereClauseFnc, locale);
  },

  async getByCampaignId({
    campaignId,
    locale = FRENCH_FRANCE
  }: $TSFixMe) {
    const whereClauseFnc = (queryBuilder: $TSFixMe) => {
      return queryBuilder
        .join('campaigns', 'campaigns.targetProfileId', 'target-profiles.id')
        .where('campaigns.id', campaignId);
    };

    return _get(whereClauseFnc, locale);
  },
};

async function _get(whereClauseFnc: $TSFixMe, locale: $TSFixMe) {
  const baseQueryBuilder = knex('target-profiles')
    .select(
      'target-profiles.id',
      'target-profiles.name',
      'target-profiles.outdated',
      'target-profiles.isPublic',
      'target-profiles.imageUrl',
      'target-profiles.createdAt',
      'target-profiles.description',
      'target-profiles.comment',
      'target-profiles.ownerOrganizationId',
      'target-profiles.category',
      'target-profiles.isSimplifiedAccess'
    )
    .first();
  const finalQueryBuilder = whereClauseFnc(baseQueryBuilder);
  const result = await finalQueryBuilder;

  if (result == null) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError("Le profil cible n'existe pas");
  }

  const skills = await knex('target-profiles_skills').select('skillId').where('targetProfileId', result.id);
  const tubes = await knex('target-profile_tubes').select('tubeId', 'level').where('targetProfileId', result.id);

  const badges = await _findBadges(result.id);
  const stages = await _findStages(result.id);

  return _toDomain({
    targetProfile: result,
    targetProfileTubes: tubes,
    targetProfileSkills: skills,
    badges,
    stages,
    locale,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
async function _toDomain({
  targetProfile,
  targetProfileTubes,
  targetProfileSkills,
  badges,
  stages,
  locale
}: $TSFixMe) {
  const skillIds = targetProfileSkills.map(({
    skillId
  }: $TSFixMe) => skillId);
  const { skills, tubes, competences, areas } = await _getTargetedLearningContent(skillIds, locale);

  const tubesSelection = targetProfileTubes.map(
    (tube: $TSFixMe) => new TargetProfileTube({
      id: tube.tubeId,
      level: tube.level,
    })
  );

  const tubesSelectionAreas = await _getTubesSelectionTargetedLearningContent(tubesSelection, locale);

  return new TargetProfileWithLearningContent({
    id: targetProfile.id,
    name: targetProfile.name,
    outdated: targetProfile.outdated,
    isPublic: targetProfile.isPublic,
    createdAt: targetProfile.createdAt,
    ownerOrganizationId: targetProfile.ownerOrganizationId,
    imageUrl: targetProfile.imageUrl,
    description: targetProfile.description,
    comment: targetProfile.comment,
    category: targetProfile.category,
    isSimplifiedAccess: targetProfile.isSimplifiedAccess,
    tubesSelection,
    tubesSelectionAreas,
    skills,
    tubes,
    competences,
    areas,
    badges,
    stages,
  });
}

async function _getTubesSelectionTargetedLearningContent(tubesSelection: $TSFixMe, locale: $TSFixMe) {
  const tubeIds = tubesSelection.map(({
    id
  }: $TSFixMe) => id);
  const tubes = await tubeRepository.findActiveByRecordIds(tubeIds, locale);

  const competenceIds = tubes.map(({
    competenceId
  }: $TSFixMe) => competenceId);
  const competences = await competenceRepository.findByRecordIds({ competenceIds, locale });

  const thematics = await thematicRepository.findByCompetenceIds(competenceIds, locale);

  const challenges = await challengeRepository.findValidatedPrototype();

  const tubeLevels = Object.fromEntries(tubesSelection.map(({
    id,
    level
  }: $TSFixMe) => [id, level]));

  return _competencesToTargetedAreas({ competences, thematics, tubes, challenges, tubeLevels });
}

const _competencesToTargetedAreas = ({
  competences,
  thematics,
  tubes,
  challenges,
  tubeLevels
}: $TSFixMe) =>
  fp.flow(
    fp.map('area'),
    fp.sortBy(['code', 'id']),
    fp.sortedUniqBy('id'),
    fp.map((area: $TSFixMe) => {
      const targetedArea = new TargetedArea(area);
      targetedArea.competences = _areaCompetencesToTargetedCompetences({
        area,
        competences,
        thematics,
        tubes,
        challenges,
        tubeLevels,
      });
      return targetedArea;
    })
  )(competences);

const _areaCompetencesToTargetedCompetences = ({
  area,
  competences,
  thematics,
  tubes,
  challenges,
  tubeLevels
}: $TSFixMe) =>
  fp.flow(
    fp.filter(['area.id', area.id]),
    fp.sortBy(['index']),
    fp.map((competence: $TSFixMe) => {
      const targetedCompetence = new TargetedCompetence({ ...competence, areaId: area.id });
      targetedCompetence.thematics = _competenceThematicsToTargetedThematics({
        competence,
        thematics,
        tubes,
        challenges,
        tubeLevels,
      });
      return targetedCompetence;
    })
  )(competences);

const _competenceThematicsToTargetedThematics = ({
  competence,
  thematics,
  tubes,
  challenges,
  tubeLevels
}: $TSFixMe) =>
  fp.flow(
    fp.filter((thematic: $TSFixMe) => competence.thematicIds.includes(thematic.id)),
    fp.sortBy(['index']),
    fp.map((thematic: $TSFixMe) => {
      const targetedThematic = new TargetedThematic(thematic);
      targetedThematic.tubes = _thematicTubesToTargetedTubes({ thematic, tubes, challenges, tubeLevels });
      return targetedThematic;
    })
  )(thematics);

const _thematicTubesToTargetedTubes = ({
  thematic,
  tubes,
  challenges,
  tubeLevels
}: $TSFixMe) =>
  fp.flow(
    fp.filter((tube: $TSFixMe) => thematic.tubeIds.includes(tube.id)),
    fp.map(
      (tube: $TSFixMe) => new TargetedTube({
        id: tube.id,
        practicalTitle: tube.practicalTitle,
        practicalDescription: tube.practicalDescription,
        level: tubeLevels[tube.id],
        challenges: challenges.filter((challenge: $TSFixMe) => challenge.skill.tubeId === tube.id),
      })
    )
  )(tubes);

async function _getTargetedLearningContent(skillIds: $TSFixMe, locale: $TSFixMe) {
  const skills = await _findTargetedSkills(skillIds);
  if (_.isEmpty(skills)) {
    throw new TargetProfileInvalidError();
  }
  const tubes = await _findTargetedTubes(skills, locale);
  const competences = await _findTargetedCompetences(tubes, locale);
  const areas = await _findTargetedAreas(competences, locale);

  return {
    skills,
    tubes,
    competences,
    areas,
  };
}

async function _findTargetedSkills(skillIds: $TSFixMe) {
  const learningContentSkills = await skillDatasource.findOperativeByRecordIds(skillIds);
  return learningContentSkills.map((learningContentSkill: $TSFixMe) => {
    return new TargetedSkill(learningContentSkill);
  });
}

async function _findTargetedTubes(skills: $TSFixMe, locale: $TSFixMe) {
  const skillsByTubeId = _.groupBy(skills, 'tubeId');
  const learningContentTubes = await tubeDatasource.findByRecordIds(Object.keys(skillsByTubeId));
  return learningContentTubes.map((learningContentTube: $TSFixMe) => {
    const practicalTitle = getTranslatedText(locale, {
      frenchText: learningContentTube.practicalTitleFrFr,
      englishText: learningContentTube.practicalTitleEnUs,
    });
    const description = getTranslatedText(locale, {
      frenchText: learningContentTube.practicalDescriptionFrFr,
      englishText: learningContentTube.practicalDescriptionEnUs,
    });
    return new TargetedTube({
      ...learningContentTube,
      practicalTitle,
      description,
      skills: skillsByTubeId[learningContentTube.id],
    });
  });
}

async function _findTargetedCompetences(tubes: $TSFixMe, locale: $TSFixMe) {
  const tubesByCompetenceId = _.groupBy(tubes, 'competenceId');
  const learningContentCompetences = await competenceDatasource.findByRecordIds(Object.keys(tubesByCompetenceId));
  return learningContentCompetences.map((learningContentCompetence: $TSFixMe) => {
    const name = getTranslatedText(locale, {
      frenchText: learningContentCompetence.nameFrFr,
      englishText: learningContentCompetence.nameEnUs,
    });
    return new TargetedCompetence({
      ...learningContentCompetence,
      name,
      tubes: tubesByCompetenceId[learningContentCompetence.id],
    });
  });
}

async function _findTargetedAreas(competences: $TSFixMe, locale: $TSFixMe) {
  const competencesByAreaId = _.groupBy(competences, 'areaId');
  const learningContentAreas = await areaDatasource.findByRecordIds(Object.keys(competencesByAreaId));
  return learningContentAreas.map((learningContentArea: $TSFixMe) => {
    const title = getTranslatedText(locale, {
      frenchText: learningContentArea.titleFrFr,
      englishText: learningContentArea.titleEnUs,
    });
    return new TargetedArea({
      ...learningContentArea,
      title,
      competences: competencesByAreaId[learningContentArea.id],
    });
  });
}

async function _findStages(targetProfileId: $TSFixMe) {
  const stageRows = await knex('stages')
    .select(
      'stages.id',
      'stages.threshold',
      'stages.message',
      'stages.title',
      'stages.prescriberTitle',
      'stages.prescriberDescription'
    )
    .where('stages.targetProfileId', targetProfileId);

  if (_.isEmpty(stageRows)) {
    return [];
  }

  return stageRows.map((row: $TSFixMe) => new Stage(row));
}

async function _findBadges(targetProfileId: $TSFixMe) {
  const badgeRows = await knex('badges')
    .select(
      'badges.id',
      'badges.key',
      'badges.message',
      'badges.altMessage',
      'badges.isCertifiable',
      'badges.title',
      'badges.targetProfileId'
    )
    .where('badges.targetProfileId', targetProfileId);

  if (_.isEmpty(badgeRows)) {
    return [];
  }

  const badges = badgeRows.map((row: $TSFixMe) => new Badge({ ...row, imageUrl: null }));
  await _fillBadgesWithCriteria(badges);
  await _fillBadgesWithSkillSets(badges);

  return badges;
}

async function _fillBadgesWithCriteria(badges: $TSFixMe) {
  const badgeIds = badges.map((badge: $TSFixMe) => badge.id);
  const criteriaRows = await knex('badge-criteria')
    .select(
      'badge-criteria.id',
      'badge-criteria.scope',
      'badge-criteria.threshold',
      'badge-criteria.badgeId',
      'badge-criteria.skillSetIds'
    )
    .whereIn('badge-criteria.badgeId', badgeIds);

  const criteriaRowsByBadgeId = _.groupBy(criteriaRows, 'badgeId');

  badges.forEach((badge: $TSFixMe) => {
    const criteriaRowsForBadge = criteriaRowsByBadgeId[badge.id];
    badge.badgeCriteria = _.map(criteriaRowsForBadge, (criteriaRow: $TSFixMe) => new BadgeCriterion(criteriaRow));
  });
}

async function _fillBadgesWithSkillSets(badges: $TSFixMe) {
  const badgeIds = badges.map((badge: $TSFixMe) => badge.id);
  const skillSetRows = await knex('skill-sets')
    .select('skill-sets.id', 'skill-sets.name', 'skill-sets.skillIds', 'skill-sets.badgeId')
    .whereIn('skill-sets.badgeId', badgeIds);

  const skillSetRowsByBadgeId = _.groupBy(skillSetRows, 'badgeId');

  badges.forEach((badge: $TSFixMe) => {
    const skillSetRowsForBadge = skillSetRowsByBadgeId[badge.id];
    badge.skillSets = _.map(skillSetRowsForBadge, (skillSetRow: $TSFixMe) => new SkillSet(skillSetRow));
  });
}
