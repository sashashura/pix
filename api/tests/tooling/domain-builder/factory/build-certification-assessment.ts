// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessment = require('../../../../lib/domain/models/CertificationAssessment');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildCertificationChallengeWithType = require('./build-certification-challenge-with-type');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationAssessment({
  id = 123,
  userId = 123,
  certificationCourseId = 123,
  createdAt = new Date('2020-01-01'),
  completedAt = new Date('2020-01-01'),
  state = CertificationAssessment.states.STARTED,
  isV2Certification = true,
  certificationChallenges = [buildCertificationChallengeWithType()],
  certificationAnswersByDate = [],
} = {}) {
  return new CertificationAssessment({
    id,
    userId,
    certificationCourseId,
    createdAt,
    completedAt,
    state,
    isV2Certification,
    certificationChallenges,
    certificationAnswersByDate,
  });
};
