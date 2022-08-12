// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildBadgeAcquisition({
  id = databaseBuffer.getNextId(),
  badgeId,
  userId,
  campaignParticipationId,
  createdAt = new Date('2000-01-01')
}: $TSFixMe = {}) {
  return databaseBuffer.pushInsertable({
    tableName: 'badge-acquisitions',
    values: {
      id,
      badgeId,
      userId,
      campaignParticipationId,
      createdAt,
    },
  });
};
