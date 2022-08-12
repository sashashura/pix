// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../lib/domain/models/BadgeCriterion');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildBadgeCriterion({
  id = databaseBuffer.getNextId(),
  scope = BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
  threshold = 50,
  badgeId,
  skillSetIds = []
}: $TSFixMe = {}) {
  const values = {
    id,
    scope,
    threshold,
    badgeId,
    skillSetIds,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'badge-criteria',
    values,
  });
};
