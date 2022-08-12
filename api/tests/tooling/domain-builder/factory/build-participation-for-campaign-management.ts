// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationForCampaignManagement = require('../../../../lib/domain/models/ParticipationForCampaignManagement');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildParticipationForCampaignManagement({
  id = 1,
  lastName = 'Un nom',
  firstName = 'Un prénom',
  userId = 2,
  userLastName = 'nom du user',
  userFirstName = 'prénom du user',
  participantExternalId = 'un identifiant externe',
  status = CampaignParticipationStatuses.TO_SHARE,
  createdAt = new Date(),
  sharedAt = null,
  deletedAt = null,
  deletedBy = null,
  deletedByFirstName = null,
  deletedByLastName = null,
} = {}) {
  return new ParticipationForCampaignManagement({
    id,
    lastName,
    firstName,
    userId,
    userLastName,
    userFirstName,
    participantExternalId,
    status,
    createdAt,
    sharedAt,
    deletedAt,
    deletedBy,
    deletedByFirstName,
    deletedByLastName,
  });
};
