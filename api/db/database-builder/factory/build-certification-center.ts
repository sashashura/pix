// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCenter({
  id = databaseBuffer.getNextId(),
  name = 'some name',
  type = 'SUP',
  externalId = 'EX123',
  createdAt = new Date('2020-01-01'),
  updatedAt,
  isSupervisorAccessEnabled = false
}: $TSFixMe = {}) {
  const values = {
    id,
    name,
    type,
    externalId,
    createdAt,
    updatedAt,
    isSupervisorAccessEnabled,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'certification-centers',
    values,
  });
};
