// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
const { normalizeAndSortChars } = require('../../../lib/infrastructure/utils/string-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCpfCountry({
  id = databaseBuffer.getNextId(),
  code = '99123',
  commonName = 'FILÉKISTANIE',
  // @ts-expect-error TS(7022): 'originalName' implicitly has type 'any' because i... Remove this comment to see the full error message
  originalName = 'RÉPUBLIQUE DE FILÉKISTAN',
  matcher = normalizeAndSortChars(originalName),
  createdAt = new Date(),
} = {}) {
  const values = {
    id,
    code,
    commonName,
    originalName,
    matcher,
    createdAt,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'certification-cpf-countries',
    values,
  });
};
