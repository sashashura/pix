// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignMa... Remove this comment to see the full error message
const CampaignManagement = require('../../domain/read-models/CampaignManagement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../domain/models/CampaignTypes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(campaignId: $TSFixMe) {
    let campaign = await knex('campaigns')
      .select({
        id: 'campaigns.id',
        code: 'campaigns.code',
        name: 'campaigns.name',
        idPixLabel: 'campaigns.idPixLabel',
        createdAt: 'campaigns.createdAt',
        archivedAt: 'campaigns.archivedAt',
        type: 'campaigns.type',
        creatorLastName: 'users.lastName',
        creatorFirstName: 'users.firstName',
        creatorId: 'users.id',
        organizationId: 'campaigns.organizationId',
        organizationName: 'organizations.name',
        targetProfileId: 'campaigns.targetProfileId',
        targetProfileName: 'target-profiles.name',
        title: 'campaigns.title',
        ownerId: 'ownerUser.id',
        ownerLastName: 'ownerUser.lastName',
        ownerFirstName: 'ownerUser.firstName',
        customLandingPageText: 'campaigns.customLandingPageText',
        customResultPageText: 'campaigns.customResultPageText',
        customResultPageButtonText: 'campaigns.customResultPageButtonText',
        customResultPageButtonUrl: 'campaigns.customResultPageButtonUrl',
        multipleSendings: 'campaigns.multipleSendings',
      })
      .join('users', 'users.id', 'campaigns.creatorId')
      .join('users AS ownerUser', 'ownerUser.id', 'campaigns.ownerId')
      .join('organizations', 'organizations.id', 'campaigns.organizationId')
      .leftJoin('target-profiles', 'target-profiles.id', 'campaigns.targetProfileId')
      .where('campaigns.id', campaignId)
      .first();

    const participationCountByStatus = await _countParticipationsByStatus(campaignId, campaign.type);
    campaign = { ...campaign, ...participationCountByStatus };
    const campaignManagement = new CampaignManagement(campaign);
    return campaignManagement;
  },

  async findPaginatedCampaignManagements({
    organizationId,
    page
  }: $TSFixMe) {
    const query = knex('campaigns')
      .select({
        id: 'campaigns.id',
        code: 'campaigns.code',
        name: 'campaigns.name',
        idPixLabel: 'campaigns.idPixLabel',
        createdAt: 'campaigns.createdAt',
        archivedAt: 'campaigns.archivedAt',
        type: 'campaigns.type',
        creatorLastName: 'creatorUser.lastName',
        creatorFirstName: 'creatorUser.firstName',
        creatorId: 'creatorUser.id',
        ownerId: 'ownerUser.id',
        ownerLastName: 'ownerUser.lastName',
        ownerFirstName: 'ownerUser.firstName',
      })
      .join('users AS creatorUser', 'creatorUser.id', 'campaigns.creatorId')
      .join('users AS ownerUser', 'ownerUser.id', 'campaigns.ownerId')
      .where('organizationId', organizationId)
      .orderBy('campaigns.createdAt', 'DESC');

    const { results, pagination } = await fetchPage(query, page);

    const campaignManagement = results.map((attributes: $TSFixMe) => new CampaignManagement(attributes));
    return { models: campaignManagement, meta: { ...pagination } };
  },

  update({
    campaignId,
    campaignAttributes
  }: $TSFixMe) {
    const editableAttributes = _.pick(campaignAttributes, [
      'name',
      'title',
      'customLandingPageText',
      'customResultPageText',
      'customResultPageButtonText',
      'customResultPageButtonUrl',
      'multipleSendings',
    ]);
    return knex('campaigns').where({ id: campaignId }).update(editableAttributes);
  },
};

async function _countParticipationsByStatus(campaignId: $TSFixMe, campaignType: $TSFixMe) {
  const row = await knex('campaign-participations')
    .select([
      knex.raw(`sum(case when status = ? then 1 else 0 end) as shared`, SHARED),
      knex.raw(`sum(case when status = ? then 1 else 0 end) as completed`, TO_SHARE),
      knex.raw(`sum(case when status = ? then 1 else 0 end) as started`, STARTED),
    ])
    .where({ campaignId, isImproved: false })
    .whereNull('campaign-participations.deletedAt')
    .groupBy('campaignId')
    .first();

  return _mapToParticipationByStatus(row, campaignType);
}

function _mapToParticipationByStatus(row = {}, campaignType: $TSFixMe) {
  const participationByStatus = {
    shared: (row as $TSFixMe).shared || 0,
    completed: (row as $TSFixMe).completed || 0,
};
  if (campaignType === CampaignTypes.ASSESSMENT) {
    (participationByStatus as $TSFixMe).started = (row as $TSFixMe).started || 0;
  }
  return participationByStatus;
}
