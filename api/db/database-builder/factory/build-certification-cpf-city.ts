// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCpfCity({
  id = databaseBuffer.getNextId(),
  name = 'PARIS 19',
  postalCode = '75019',
  INSEECode = '75119',
  isActualName = true,
} = {}) {
  const values = {
    id,
    name,
    postalCode,
    INSEECode,
    isActualName,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'certification-cpf-cities',
    values,
  });
};
