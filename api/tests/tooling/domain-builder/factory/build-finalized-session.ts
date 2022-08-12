// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FinalizedS... Remove this comment to see the full error message
const FinalizedSession = require('../../../../lib/domain/models/FinalizedSession');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildFinalizedSession({
  sessionId = 123,
  certificationCenterName = 'Centre de certif pix',
  sessionDate = '2020-12-01',
  sessionTime = '14:30',
  finalizedAt = '2021-01-12',
  publishedAt = null,
  isPublishable = true,
  assignedCertificationOfficerName = null,
} = {}) {
  return new FinalizedSession({
    sessionId,
    certificationCenterName,
    sessionDate,
    sessionTime,
    finalizedAt,
    publishedAt,
    isPublishable,
    assignedCertificationOfficerName,
  });
};
