// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorial = require('../../../../lib/domain/models/UserSavedTutorial');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildUserSavedTutorial({
  id = 111,
  userId = '4044',
  tutorialId = '111',
  skillId = '1212',
  createdAt = '2022-05-02',
} = {}) {
  return new UserSavedTutorial({
    id,
    skillId,
    userId,
    tutorialId,
    createdAt,
  });
};
