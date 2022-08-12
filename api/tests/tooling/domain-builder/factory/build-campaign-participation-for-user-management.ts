// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationForUserManagement = require('../../../../lib/domain/read-models/CampaignParticipationForUserManagement');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCampaignParticipationForUserManagement({
  id = 1,
  participantExternalId = 'un identifiant externe',
  status = CampaignParticipationStatuses.TO_SHARE,
  campaignId = 2,
  campaignCode = 'SOMECODE0',
  createdAt = new Date(),
  sharedAt = null,
  deletedAt = null,
  deletedBy = null,
  deletedByFirstName = null,
  deletedByLastName = null,
  organizationLearnerFirstName = null,
  organizationLearnerLastName = null,
} = {}) {
  return new CampaignParticipationForUserManagement({
    id,
    campaignId,
    campaignCode,
    participantExternalId,
    status,
    createdAt,
    sharedAt,
    deletedAt,
    deletedBy,
    deletedByFirstName,
    deletedByLastName,
    organizationLearnerFirstName,
    organizationLearnerLastName,
  });
};
