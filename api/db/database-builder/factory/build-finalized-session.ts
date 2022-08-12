// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildFinalizedSession({
  sessionId = databaseBuffer.getNextId(),
  certificationCenterName = 'Centre de certif PIX',
  finalizedAt = new Date('2020-01-01'),
  isPublishable = true,
  time = '10:00:00',
  date = '2019-12-25',
  publishedAt = null,
  assignedCertificationOfficerName = null,
} = {}) {
  const values = {
    sessionId,
    certificationCenterName,
    finalizedAt,
    isPublishable,
    time,
    date,
    publishedAt,
    assignedCertificationOfficerName,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'finalized-sessions',
    values,
  });
};
