// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCpfCity = require('../../../../lib/domain/models/CertificationCpfCity');

function buildCertificationCpfCity({
  id = 123,
  name = 'PARIS 19',
  postalCode = '75019',
  INSEECode = '75119',
  isActualName = true,
} = {}) {
  return new CertificationCpfCity({
    id,
    name,
    postalCode,
    INSEECode,
    isActualName,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertificationCpfCity;
