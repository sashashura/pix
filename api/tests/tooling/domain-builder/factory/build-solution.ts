// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Solution'.
const Solution = require('../../../../lib/domain/models/Solution');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildSolution({
  id = 'recCHAL123',
  type = 'QCM',
  value = '1',
  isT1Enabled = false,
  isT2Enabled = false,
  isT3Enabled = false,
  scoring = '',
} = {}) {
  return new Solution({
    id,
    type,
    value,
    isT1Enabled,
    isT2Enabled,
    isT3Enabled,
    scoring,
  });
};
