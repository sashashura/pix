// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
const { CertifiedSkill } = require('../../../../lib/domain/read-models/CertifiedProfile');

const buildCertifiedSkill = function buildCertifiedSkill({
  id = 'someSkillId',
  name = 'someName',
  hasBeenAskedInCertif = false,
  tubeId = 'someTubeId',
} = {}) {
  return new CertifiedSkill({
    id,
    name,
    hasBeenAskedInCertif,
    tubeId,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertifiedSkill;
