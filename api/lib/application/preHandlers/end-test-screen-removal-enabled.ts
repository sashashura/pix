const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Supervisor... Remove this comment to see the full error message
  SupervisorAccessNotAuthorizedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
  InvalidSessionSupervisingLoginError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalService = require('../../domain/services/end-test-screen-removal-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../infrastructure/repositories/sessions/session-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async verifyBySessionId(request: $TSFixMe) {
    let sessionId = request.params?.id;
    if (!sessionId) {
      sessionId = request.payload.data.attributes['session-id'];
    }

    try {
      await sessionRepository.get(sessionId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new InvalidSessionSupervisingLoginError();
      }
      throw error;
    }

    const isEndTestScreenRemovalEnabled = await endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId(
      sessionId
    );
    if (!isEndTestScreenRemovalEnabled) {
      throw new SupervisorAccessNotAuthorizedError();
    }

    return true;
  },

  async verifyByCertificationCandidateId(request: $TSFixMe, h: $TSFixMe) {
    const candidateId = request.params.id;

    const isEndTestScreenRemovalEnabled = await endTestScreenRemovalService.isEndTestScreenRemovalEnabledByCandidateId(
      candidateId
    );
    if (!isEndTestScreenRemovalEnabled) {
      return h.response().code(404).takeover();
    }

    return true;
  },
};
