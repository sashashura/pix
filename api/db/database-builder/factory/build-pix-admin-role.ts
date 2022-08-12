// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildPixAdminRole({
  id = databaseBuffer.getNextId(),
  userId,
  role,
  createdAt = new Date(2022, 4, 12),
  updatedAt = new Date(2022, 4, 12),
  disabledAt = null
}: $TSFixMe) {
  return databaseBuffer.pushInsertable({
    tableName: 'pix-admin-roles',
    values: { id, userId, role, createdAt, updatedAt, disabledAt },
  });
};
