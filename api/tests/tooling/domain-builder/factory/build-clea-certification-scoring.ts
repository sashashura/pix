// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationScoring = require('./../../../../lib/domain/models/CleaCertificationScoring');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCleaCertificationScoring({
  complementaryCertificationCourseId = 99,
  certificationCourseId = 42,
  hasAcquiredBadge = true,
  isBadgeAcquisitionStillValid = true,
  reproducibilityRate = 50,
  cleaBadgeKey = 'some-clea_key',
  pixScore,
  minimumEarnedPix,
  minimumReproducibilityRate
}: $TSFixMe = {}) {
  return new CleaCertificationScoring({
    complementaryCertificationCourseId,
    certificationCourseId,
    hasAcquiredBadge,
    isBadgeAcquisitionStillValid,
    reproducibilityRate,
    cleaBadgeKey,
    pixScore,
    minimumEarnedPix,
    minimumReproducibilityRate,
  });
};
