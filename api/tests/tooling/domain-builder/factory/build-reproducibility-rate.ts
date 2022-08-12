// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
const { ReproducibilityRate } = require('../../../../lib/domain/models/ReproducibilityRate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildReproducibilityRate({ value = 10 } = {}) {
  return new ReproducibilityRate(value);
};
