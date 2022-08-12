// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
class CampaignProfilesCollectionParticipationSummary {
  certifiable: $TSFixMe;
  certifiableCompetencesCount: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  participantExternalId: $TSFixMe;
  pixScore: $TSFixMe;
  sharedAt: $TSFixMe;
  constructor({
    campaignParticipationId,
    firstName,
    lastName,
    participantExternalId,
    sharedAt,
    pixScore,
    certifiable,
    certifiableCompetencesCount
  }: $TSFixMe) {
    this.id = campaignParticipationId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.pixScore = pixScore;
    this.certifiable = certifiable;
    this.certifiableCompetencesCount = certifiableCompetencesCount;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfilesCollectionParticipationSummary;
