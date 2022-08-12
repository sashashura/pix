// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTutorialEvaluation({
  id = databaseBuffer.getNextId(),
  tutorialId,
  userId,
  status = 'LIKED',
  updatedAt = new Date()
}: $TSFixMe = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'tutorial-evaluations',
    values: {
      id,
      userId,
      tutorialId,
      status,
      updatedAt,
    },
  });
};
