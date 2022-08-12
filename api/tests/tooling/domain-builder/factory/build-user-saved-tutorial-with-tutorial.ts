// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorialWithTutorial = require('../../../../lib/domain/models/UserSavedTutorialWithTutorial');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildSkill = require('./build-skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTutor... Remove this comment to see the full error message
const buildTutorial = require('./build-tutorial');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildUser = require('./build-user');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildUserSavedTutorialWithTutorial({
  id = 123,
  userId = buildUser().id,
  skillId = buildSkill().id,
  tutorial = buildTutorial(),
} = {}) {
  return new UserSavedTutorialWithTutorial({
    id,
    userId,
    skillId,
    tutorial,
  });
};
