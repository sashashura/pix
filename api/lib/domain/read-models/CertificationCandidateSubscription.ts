// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class CertificationCandidateSubscription {
  eligibleSubscriptions: $TSFixMe;
  id: $TSFixMe;
  nonEligibleSubscriptions: $TSFixMe;
  sessionId: $TSFixMe;
  constructor({
    id,
    sessionId,
    eligibleSubscriptions,
    nonEligibleSubscriptions
  }: $TSFixMe) {
    this.id = id;
    this.sessionId = sessionId;
    this.eligibleSubscriptions = eligibleSubscriptions;
    this.nonEligibleSubscriptions = nonEligibleSubscriptions;
  }
};
