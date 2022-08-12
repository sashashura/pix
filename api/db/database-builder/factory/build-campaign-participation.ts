// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCampa... Remove this comment to see the full error message
const buildCampaign = require('./build-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganizationLearner = require('./build-organization-learner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignParticipation({
  id = databaseBuffer.getNextId(),
  campaignId,
  createdAt = new Date('2020-01-01'),
  sharedAt = new Date('2020-01-02'),
  userId,
  organizationLearnerId,
  participantExternalId = 'participantExternalId',
  validatedSkillsCount,
  masteryRate,
  pixScore,
  status = SHARED,
  isImproved = false,
  deletedAt = null,
  deletedBy = null
}: $TSFixMe = {}) {
  userId = _.isUndefined(userId) ? buildUser().id : userId;
  organizationLearnerId = _.isUndefined(organizationLearnerId) ? buildOrganizationLearner().id : organizationLearnerId;
  campaignId = _.isUndefined(campaignId) ? buildCampaign().id : campaignId;
  const isShared = status === SHARED;
  sharedAt = isShared ? sharedAt : null;

  const values = {
    id,
    campaignId,
    userId,
    organizationLearnerId,
    createdAt,
    sharedAt,
    participantExternalId,
    validatedSkillsCount,
    masteryRate,
    pixScore,
    status,
    isImproved,
    deletedAt,
    deletedBy,
  };
  databaseBuffer.pushInsertable({
    tableName: 'campaign-participations',
    values,
  });

  return {
    id,
    campaignId,
    userId,
    organizationLearnerId,
    createdAt,
    sharedAt,
    participantExternalId,
    validatedSkillsCount,
    masteryRate,
    pixScore,
    status,
    isImproved,
    deletedAt,
    deletedBy,
  };
};
