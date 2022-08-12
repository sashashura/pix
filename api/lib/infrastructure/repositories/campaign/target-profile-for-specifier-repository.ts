// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillDataS... Remove this comment to see the full error message
const skillDataSource = require('../../datasources/learning-content/skill-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForSpecifier = require('../../../domain/read-models/campaign/TargetProfileForSpecifier');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

async function availableForOrganization(organizationId: $TSFixMe) {
  const targetProfileRows = await _fetchTargetProfiles(organizationId);

  return bluebird.mapSeries(targetProfileRows, _buildTargetProfileForSpecifier);
}

function _fetchTargetProfiles(organizationId: $TSFixMe) {
  const selectTargetProfileSharesIdsBelongToOrganization = knex
    .select('targetProfileId')
    .from('target-profile-shares')
    .where({ organizationId });
  return knex('target-profiles')
    .select([
      'target-profiles.id',
      'target-profiles.name',
      'target-profiles.description',
      'target-profiles.category',
      knex.raw('ARRAY_AGG("skillId") AS "skillIds"'),
      knex.raw('ARRAY_AGG("badges"."id")  AS "badgeIds"'),
      knex.raw('ARRAY_AGG("stages"."id")  AS "stageIds"'),
    ])
    .leftJoin('target-profiles_skills', 'target-profiles_skills.targetProfileId', 'target-profiles.id')
    .leftJoin('badges', 'badges.targetProfileId', 'target-profiles.id')
    .leftJoin('stages', 'stages.targetProfileId', 'target-profiles.id')
    .where({ outdated: false })
    .where((qb: $TSFixMe) => {
      qb.orWhere({ isPublic: true });
      qb.orWhere({ ownerOrganizationId: organizationId });
      qb.orWhereIn('target-profiles.id', selectTargetProfileSharesIdsBelongToOrganization);
    })
    .groupBy('target-profiles.id');
}

async function _buildTargetProfileForSpecifier(row: $TSFixMe) {
  const skills = await skillDataSource.findByRecordIds(row.skillIds);
  const thematicResultsIds = _.uniq(row.badgeIds).filter((id: $TSFixMe) => id);
  const hasStage = row.stageIds.some((stage: $TSFixMe) => stage);
  return new TargetProfileForSpecifier({
    id: row.id,
    name: row.name,
    skills,
    thematicResults: thematicResultsIds,
    hasStage,
    description: row.description,
    category: row.category,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  availableForOrganization,
};
