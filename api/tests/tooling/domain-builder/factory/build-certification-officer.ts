// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationOfficer = require('../../../../lib/domain/models/CertificationOfficer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationOfficer({ id = 123, firstName = 'Dean', lastName = 'Winchester' } = {}) {
  return new CertificationOfficer({
    id,
    firstName,
    lastName,
  });
};
