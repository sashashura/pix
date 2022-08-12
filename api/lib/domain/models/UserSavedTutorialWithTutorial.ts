// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
class UserSavedTutorialWithTutorial {
  id: $TSFixMe;
  skillId: $TSFixMe;
  tutorial: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    id,
    userId,
    tutorial,
    skillId
  }: $TSFixMe = {}) {
    this.id = id;
    this.userId = userId;
    this.tutorial = tutorial;
    this.skillId = skillId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserSavedTutorialWithTutorial;
