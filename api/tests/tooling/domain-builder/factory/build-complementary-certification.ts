// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertification = require('../../../../lib/domain/models/ComplementaryCertification');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildComplementaryCertification({
  id = 1,
  label = 'Complementary certification name',
  key = 'COMPLEMENTARY_CERTIFICATION_KEY',
} = {}) {
  return new ComplementaryCertification({
    id,
    label,
    key,
  });
};
