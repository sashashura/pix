// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('./../../../../lib/domain/models/ComplementaryCertificationCourseResult');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertificationCourseResult({
  complementaryCertificationCourseId = 2,
  partnerKey = 'PARTNER_KEY',
  acquired = false,
  source = ComplementaryCertificationCourseResult.sources.PIX,
} = {}) {
  return new ComplementaryCertificationCourseResult({
    complementaryCertificationCourseId,
    partnerKey,
    acquired,
    source,
  });
};
