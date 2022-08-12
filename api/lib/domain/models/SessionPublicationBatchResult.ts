// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionPub... Remove this comment to see the full error message
class SessionPublicationBatchResult {
  batchId: $TSFixMe;
  publicationErrors: $TSFixMe;
  constructor(batchId: $TSFixMe) {
    this.batchId = batchId;
    this.publicationErrors = {};
  }

  hasPublicationErrors() {
    return Boolean(Object.keys(this.publicationErrors).length);
  }

  addPublicationError(sessionId: $TSFixMe, error: $TSFixMe) {
    this.publicationErrors[sessionId] = error;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  SessionPublicationBatchResult,
};
