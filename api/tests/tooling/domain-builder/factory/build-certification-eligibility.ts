// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationEligibility = require('../../../../lib/domain/read-models/CertificationEligibility');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationEligibility({
  id = 123,
  pixCertificationEligible = false,
  eligibleComplementaryCertifications = [],
} = {}) {
  return new CertificationEligibility({
    id,
    pixCertificationEligible,
    eligibleComplementaryCertifications,
  });
};
