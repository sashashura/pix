// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationChallengeWithType = require('../../../../lib/domain/models/CertificationChallengeWithType');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Challenge'... Remove this comment to see the full error message
const Challenge = require('../../../../lib/domain/models/Challenge');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationChallengeWithType({
  id = 123,
  challengeId = 'recCHAL',
  competenceId = 'recCOMP',
  type = Challenge.Type.QCU,
  associatedSkillName = 'cueillir des fleurs',
  isNeutralized = false,
  hasBeenSkippedAutomatically = false,
  certifiableBadgeKey = null,
} = {}) {
  return new CertificationChallengeWithType({
    id,
    challengeId,
    competenceId,
    associatedSkillName,
    type,
    isNeutralized,
    hasBeenSkippedAutomatically,
    certifiableBadgeKey,
  });
};
