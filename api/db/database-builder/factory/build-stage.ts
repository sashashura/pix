// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildStage({
  id = databaseBuffer.getNextId(),
  message = 'Courage !',
  title = 'Encouragement, il en a bien besoin',
  threshold = 10,
  targetProfileId,
  prescriberTitle = null,
  prescriberDescription = null
}: $TSFixMe = {}) {
  const values = {
    id,
    message,
    title,
    threshold,
    targetProfileId,
    prescriberTitle,
    prescriberDescription,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'stages',
    values,
  });
};
