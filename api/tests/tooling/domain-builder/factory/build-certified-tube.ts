// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedT... Remove this comment to see the full error message
const { CertifiedTube } = require('../../../../lib/domain/read-models/CertifiedProfile');

const buildCertifiedTube = function buildCertifiedTube({
  id = 'someTubeId',
  name = 'someName',
  competenceId = 'someCompetenceId',
} = {}) {
  return new CertifiedTube({
    id,
    name,
    competenceId,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertifiedTube;
