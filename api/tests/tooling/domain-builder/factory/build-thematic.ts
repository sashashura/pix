// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Thematic'.
const Thematic = require('../../../../lib/domain/models/Thematic');

const buildThematic = function buildThematic({ id = 'recThem1', name = 'My Thematic', index = 0, tubeIds = [] } = {}) {
  return new Thematic({
    id,
    name,
    index,
    tubeIds,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildThematic;
