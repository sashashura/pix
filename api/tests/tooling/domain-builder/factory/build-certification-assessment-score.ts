// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessmentScore = require('../../../../lib/domain/models/CertificationAssessmentScore');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationAssessmentScore({
  competenceMarks = [],
  percentageCorrectAnswers = 0,
  hasEnoughNonNeutralizedChallengesToBeTrusted = true,
} = {}) {
  return new CertificationAssessmentScore({
    competenceMarks,
    percentageCorrectAnswers,
    hasEnoughNonNeutralizedChallengesToBeTrusted,
  });
};
