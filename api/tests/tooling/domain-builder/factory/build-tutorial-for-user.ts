// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTutor... Remove this comment to see the full error message
const buildTutorial = require('./build-tutorial');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildUserSavedTutorial = require('./build-user-saved-tutorial');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialFo... Remove this comment to see the full error message
const TutorialForUser = require('../../../../lib/domain/read-models/TutorialForUser');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTutorialForUser({
  tutorial = buildTutorial(),
  userTutorial = buildUserSavedTutorial(),
  tutorialEvaluation,
  skillId
}: $TSFixMe = {}) {
  return new TutorialForUser({ ...tutorial, tutorialEvaluation, userTutorial, skillId });
};
