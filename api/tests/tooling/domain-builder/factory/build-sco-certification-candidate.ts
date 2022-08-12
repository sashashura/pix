// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCOCertifi... Remove this comment to see the full error message
const SCOCertificationCandidate = require('../../../../lib/domain/models/SCOCertificationCandidate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildSCOCertificationCandidate({
  id = 123,
  firstName = 'Myriam',
  lastName = 'Meilleure',
  birthdate = '2006-06-06',
  sex = 'F',
  birthINSEECode = '66001',
  sessionId = 456,
  organizationLearnerId = 789,
} = {}) {
  return new SCOCertificationCandidate({
    id,
    firstName,
    lastName,
    birthdate,
    sex,
    birthINSEECode,
    sessionId,
    organizationLearnerId,
  });
};
