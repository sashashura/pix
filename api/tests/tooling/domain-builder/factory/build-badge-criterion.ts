// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../../lib/domain/models/BadgeCriterion');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildBadgeCriterion({
  id = 1,
  scope = BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
  threshold = 40,
  skillSetIds = [],
} = {}) {
  return new BadgeCriterion({
    id,
    scope,
    threshold,
    skillSetIds,
  });
};
