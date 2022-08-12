// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
class BadgeCriterion {
  static SCOPES = {
      CAMPAIGN_PARTICIPATION: 'CampaignParticipation',
      SKILL_SET: 'SkillSet',
  };

  badgeId: $TSFixMe;
  id: $TSFixMe;
  scope: $TSFixMe;
  skillSetIds: $TSFixMe;
  threshold: $TSFixMe;

  constructor({
    id,
    scope,
    threshold,
    skillSetIds,
    badgeId
  }: $TSFixMe = {}) {
    this.id = id;
    this.scope = scope;
    this.threshold = threshold;
    this.skillSetIds = skillSetIds;
    this.badgeId = badgeId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = BadgeCriterion;
