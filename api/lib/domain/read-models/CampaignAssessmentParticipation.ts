// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipation {
  badges: $TSFixMe;
  campaignId: $TSFixMe;
  campaignParticipationId: $TSFixMe;
  createdAt: $TSFixMe;
  firstName: $TSFixMe;
  isShared: $TSFixMe;
  lastName: $TSFixMe;
  masteryRate: $TSFixMe;
  participantExternalId: $TSFixMe;
  progression: $TSFixMe;
  sharedAt: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    userId,
    firstName,
    lastName,
    campaignParticipationId,
    campaignId,
    participantExternalId,
    assessmentState,
    masteryRate,
    sharedAt,
    status,
    createdAt,
    targetedSkillsCount,
    testedSkillsCount,
    badges = []
  }: $TSFixMe) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.campaignParticipationId = campaignParticipationId;
    this.campaignId = campaignId;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.isShared = status === SHARED;
    this.createdAt = createdAt;
    this.progression = this._computeProgression(assessmentState, testedSkillsCount, targetedSkillsCount);
    this.badges = badges;
    this.masteryRate = !_.isNil(masteryRate) ? Number(masteryRate) : null;
  }

  _computeProgression(assessmentState: $TSFixMe, testedSkillsCount: $TSFixMe, targetedSkillsCount: $TSFixMe) {
    if (assessmentState === Assessment.states.COMPLETED) return 1;
    return Number((testedSkillsCount / targetedSkillsCount).toFixed(2));
  }

  setBadges(badges: $TSFixMe) {
    this.badges = badges;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipation;
