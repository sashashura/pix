// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tutorial'.
const Tutorial = require('../models/Tutorial');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialFo... Remove this comment to see the full error message
class TutorialForUser extends Tutorial {
  skillId: $TSFixMe;
  tutorialEvaluation: $TSFixMe;
  userTutorial: $TSFixMe;
  constructor({
    userTutorial,
    tutorialEvaluation,
    skillId,
    ...tutorial
  }: $TSFixMe) {
    super(tutorial);
    this.userTutorial = userTutorial;
    this.tutorialEvaluation = tutorialEvaluation;
    this.skillId = skillId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TutorialForUser;
