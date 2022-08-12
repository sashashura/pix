// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('./Badge.js');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationBadge extends Badge {
  isAcquired: $TSFixMe;
  skillSetResults: $TSFixMe;
  constructor({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    title,
    isAcquired,
    isCertifiable = false,
    badgeCriteria = [],
    skillSets = [],
    skillSetResults = [],
    targetProfileId
  }: $TSFixMe = {}) {
    super({
      id,
      key,
      altMessage,
      imageUrl,
      message,
      title,
      isCertifiable,
      badgeCriteria,
      skillSets,
      targetProfileId,
    });
    this.skillSetResults = skillSetResults;
    this.isAcquired = isAcquired;
  }

  static buildFrom({
    badge,
    skillSetResults,
    isAcquired
  }: $TSFixMe) {
    return new CampaignParticipationBadge({
      ...badge,
      skillSetResults,
      isAcquired,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationBadge;
