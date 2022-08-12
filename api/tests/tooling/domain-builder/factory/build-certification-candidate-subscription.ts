// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateSubscription = require('../../../../lib/domain/read-models/CertificationCandidateSubscription');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertificationCandidateSubscription({
  id = 1234,
  sessionId = 1234,
  eligibleSubscriptions = [],
  nonEligibleSubscriptions = [],
} = {}) {
  return new CertificationCandidateSubscription({
    id,
    sessionId,
    eligibleSubscriptions,
    nonEligibleSubscriptions,
  });
};
