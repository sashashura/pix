// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedC... Remove this comment to see the full error message
const { CertifiedCompetence } = require('../../../../lib/domain/read-models/CertifiedProfile');

const buildCertifiedCompetence = function buildCertifiedCompetence({
  id = 'someCompetenceId',
  name = 'someName',
  areaId = 'someAreaId',
} = {}) {
  return new CertifiedCompetence({
    id,
    name,
    areaId,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertifiedCompetence;
