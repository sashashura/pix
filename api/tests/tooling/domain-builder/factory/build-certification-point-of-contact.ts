// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationPointOfContact = require('../../../../lib/domain/read-models/CertificationPointOfContact');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildAllowedCertificationCenterAccess = require('./build-allowed-certification-center-access');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationPointOfContact({
  id = 123,
  firstName = 'Chèvre',
  lastName = 'Brebis',
  email = 'chevre.brebis@example.net',
  pixCertifTermsOfServiceAccepted = true,
  allowedCertificationCenterAccesses = [buildAllowedCertificationCenterAccess()],
} = {}) {
  return new CertificationPointOfContact({
    id,
    firstName,
    lastName,
    email,
    pixCertifTermsOfServiceAccepted,
    allowedCertificationCenterAccesses,
  });
};
