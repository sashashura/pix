// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedA... Remove this comment to see the full error message
const { CertifiedArea } = require('../../../../lib/domain/read-models/CertifiedProfile');

const buildCertifiedArea = function buildCertifiedArea({
  id = 'someAreaId',
  name = 'someName',
  color = 'someColor',
} = {}) {
  return new CertifiedArea({
    id,
    name,
    color,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertifiedArea;
