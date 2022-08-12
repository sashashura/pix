// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('../../../../lib/domain/events/CertificationScoringCompleted');

const buildCertificationScoringCompletedEvent = function ({
  certificationCourseId = 123,
  userId = 456,
  reproducibilityRate = 55,
} = {}) {
  return new CertificationScoringCompleted({
    certificationCourseId,
    userId,
    reproducibilityRate,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertificationScoringCompletedEvent;
