// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedTh... Remove this comment to see the full error message
const TargetedThematic = require('../../../../lib/domain/models/TargetedThematic');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedTube = require('./build-targeted-tube');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildTargetedThematic({
  id = 'someThematicId',
  name = 'someName',
  index = 'someIndex',
  tubes = [buildTargetedTube()],
} = {}) {
  return new TargetedThematic({
    id,
    name,
    index,
    tubes,
  });
};
