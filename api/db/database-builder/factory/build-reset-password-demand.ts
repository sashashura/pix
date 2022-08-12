// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildResetPasswordDemand({
  id = databaseBuffer.getNextId(),
  email = 'example@example.net',
  temporaryKey = 'ABCD12345',
  used = false,
} = {}) {
  const values = {
    id,
    email,
    temporaryKey,
    used,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'reset-password-demands',
    values,
  });
};
