// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeWithL... Remove this comment to see the full error message
class BadgeWithLearningContent {
  badge: $TSFixMe;
  skills: $TSFixMe;
  tubes: $TSFixMe;
  constructor({
    badge,
    skills,
    tubes
  }: $TSFixMe = {}) {
    this.badge = badge;
    this.skills = skills;
    this.tubes = tubes;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = BadgeWithLearningContent;
