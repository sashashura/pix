// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipantActivity {
  campaignParticipationId: $TSFixMe;
  firstName: $TSFixMe;
  lastName: $TSFixMe;
  participantExternalId: $TSFixMe;
  sharedAt: $TSFixMe;
  status: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    campaignParticipationId,
    userId,
    firstName,
    lastName,
    participantExternalId,
    sharedAt,
    status
  }: $TSFixMe = {}) {
    this.campaignParticipationId = campaignParticipationId;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.status = status;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipantActivity;
