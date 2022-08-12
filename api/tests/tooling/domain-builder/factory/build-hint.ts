// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Hint'.
const Hint = require('../../../../lib/domain/models/Hint');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildHint({ skillName = '@web2', value = 'Pense à regarder les indices' } = {}) {
  return new Hint({
    skillName,
    value,
  });
};
