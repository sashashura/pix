// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const Competence = require('../../../../lib/domain/models/Competence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildArea'... Remove this comment to see the full error message
const buildArea = require('./build-area');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCompetence({
  id = 'recCOMP1',
  name = 'Manger des fruits',
  index = '1.1',
  description = 'Teste les qualités de mangeage de fruits',
  area = buildArea(),
  skillIds = [],
  thematicIds = [],
  origin = 'Pix',
} = {}) {
  return new Competence({
    id,
    name,
    index,
    description,
    origin,
    area,
    skillIds,
    thematicIds,
  });
};
