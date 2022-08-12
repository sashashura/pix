// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedP... Remove this comment to see the full error message
const { CertifiedProfile } = require('../../../../lib/domain/read-models/CertifiedProfile');

const buildCertifiedProfile = function buildCertifiedProfile({
  id = 123,
  userId = 456,
  certifiedSkills = [],
  certifiedTubes = [],
  certifiedCompetences = [],
  certifiedAreas = [],
} = {}) {
  return new CertifiedProfile({
    id,
    userId,
    certifiedSkills,
    certifiedTubes,
    certifiedCompetences,
    certifiedAreas,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCertifiedProfile;
