// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipationResultMinimal {
  badges: $TSFixMe;
  campaignParticipationId: $TSFixMe;
  firstName: $TSFixMe;
  lastName: $TSFixMe;
  masteryRate: $TSFixMe;
  participantExternalId: $TSFixMe;
  constructor({
    campaignParticipationId,
    firstName,
    lastName,
    participantExternalId,
    masteryRate,
    badges = []
  }: $TSFixMe = {}) {
    this.campaignParticipationId = campaignParticipationId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantExternalId = participantExternalId;
    this.masteryRate = !_.isNil(masteryRate) ? Number(masteryRate) : null;
    this.badges = badges;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipationResultMinimal;
