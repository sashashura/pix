// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationInfo = require('../../../../lib/domain/read-models/CampaignParticipationInfo');

function buildCampaignParticipationInfo({
  participantFirstName = 'participantFirstName',
  participantLastName = 'participantLastName',
  participantExternalId = 'participantExternalId',
  studentNumber = '123ABC',
  userId = 123,
  campaignParticipationId = 999,
  isCompleted = true,
  createdAt = new Date('2020-01-01'),
  sharedAt = new Date('2020-02-02'),
  division,
  masteryRate = 1
}: $TSFixMe = {}) {
  return new CampaignParticipationInfo({
    participantFirstName,
    participantLastName,
    participantExternalId,
    studentNumber,
    userId,
    campaignParticipationId,
    isCompleted,
    createdAt,
    sharedAt,
    division,
    masteryRate,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCampaignParticipationInfo;
