// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateForSupervising = require('../../../../lib/domain/models/CertificationCandidateForSupervising');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCandidateForSupervising({
  id = 123,
  firstName = 'Monkey',
  lastName = 'D Luffy',
  birthdate = '1997-07-22',
  extraTimePercentage = 0.3,
  authorizedToStart = false,
  assessmentStatus = null,
} = {}) {
  return new CertificationCandidateForSupervising({
    id,
    firstName,
    lastName,
    birthdate,
    extraTimePercentage,
    authorizedToStart,
    assessmentStatus,
  });
};
