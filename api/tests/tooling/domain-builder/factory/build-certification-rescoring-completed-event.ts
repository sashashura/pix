// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('../../../../lib/domain/events/CertificationRescoringCompleted');

const buildCertificationRescoringCompletedEvent = function ({
  certificationCourseId = 123,
  userId = 456,
  reproducibilityRate = 55,
} = {}) {
  return new CertificationRescoringCompleted({
    certificationCourseId,
    userId,
    reproducibilityRate,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertificationRescoringCompletedEvent;
