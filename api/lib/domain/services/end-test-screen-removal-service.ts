// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalRepository = require('../../infrastructure/repositories/end-test-screen-removal-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isEndTestScreenRemovalEnabledBySessionId: async function (sessionId: $TSFixMe) {
    const isEndTestScreenRemovalEnabled = await endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledBySessionId(
      sessionId
    );
    return isEndTestScreenRemovalEnabled;
  },
  isEndTestScreenRemovalEnabledByCandidateId: async function (candidateId: $TSFixMe) {
    const isEndTestScreenRemovalEnabled =
      await endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledByCandidateId(candidateId);
    return isEndTestScreenRemovalEnabled;
  },

  isEndTestScreenRemovalEnabledByCertificationCenterId: function (certificationCenterId: $TSFixMe) {
    return endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledByCertificationCenterId(certificationCenterId);
  },

  isEndTestScreenRemovalEnabledForSomeCertificationCenter: function () {
    return endTestScreenRemovalRepository.isEndTestScreenRemovalEnabledForSomeCertificationCenter();
  },
};
