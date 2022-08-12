// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetedCo... Remove this comment to see the full error message
const TargetedCompetence = require('../../../../lib/domain/models/TargetedCompetence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedTube = require('./build-targeted-tube');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildTarge... Remove this comment to see the full error message
const buildTargetedCompetence = function buildTargetedCompetence({
  id = 'someCompetenceId',
  name = 'someName',
  index = 'someIndex',
  origin = 'Pix',
  areaId = 'someAreaId',
  tubes = [buildTargetedTube()],
  thematics = [],
} = {}) {
  return new TargetedCompetence({
    id,
    name,
    index,
    origin,
    areaId,
    tubes,
    thematics,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildTargetedCompetence;
