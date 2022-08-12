// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
class UserSavedTutorial {
  createdAt: $TSFixMe;
  id: $TSFixMe;
  skillId: $TSFixMe;
  tutorialId: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    id,
    userId,
    tutorialId,
    skillId,
    createdAt
  }: $TSFixMe = {}) {
    this.id = id;
    this.userId = userId;
    this.tutorialId = tutorialId;
    this.skillId = skillId;
    this.createdAt = createdAt;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserSavedTutorial;
