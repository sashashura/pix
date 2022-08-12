// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, hFake, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalEnabled = require('../../../../lib/application/preHandlers/end-test-screen-removal-enabled');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalService = require('../../../../lib/domain/services/end-test-screen-removal-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../../../lib/infrastructure/repositories/sessions/session-repository');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Supervisor... Remove this comment to see the full error message
  SupervisorAccessNotAuthorizedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
  InvalidSessionSupervisingLoginError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Pre-handler | end test screen removal', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verifyBySessionId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(endTestScreenRemovalService, 'isEndTestScreenRemovalEnabledBySessionId');
      sinon.stub(sessionRepository, 'get');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When POST', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when session does not exist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a InvalidSessionSupervisingLoginError', async function () {
          // given
          const request = {
            payload: {
              data: { attributes: { 'session-id': 8 } },
            },
          };
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          sessionRepository.get.withArgs(8).throws(new NotFoundError());

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(endTestScreenRemovalEnabled.verifyBySessionId)(request, hFake);

          // then
          expect(error).to.be.an.instanceOf(InvalidSessionSupervisingLoginError);
          expect((error as $TSFixMe).message).to.equal('Le numéro de session et/ou le mot de passe saisis sont incorrects.');
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When session certification center is in the whitelist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return true', async function () {
          // given
          const request = {
            payload: {
              data: { attributes: { 'session-id': 8 } },
            },
          };
          sessionRepository.get.withArgs(8).resolves(domainBuilder.buildSession({ id: 8 }));
          endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.withArgs(8).resolves(true);

          // when
          const response = await endTestScreenRemovalEnabled.verifyBySessionId(request, hFake);

          // then
          expect(response).to.be.true;
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When session certification center is not in the whitelist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw', async function () {
          // given
          const request = {
            payload: {
              data: { attributes: { 'session-id': 8 } },
            },
          };
          sessionRepository.get.withArgs(8).resolves(domainBuilder.buildSession({ id: 8 }));
          endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.withArgs(8).resolves(false);

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(endTestScreenRemovalEnabled.verifyBySessionId)(request, hFake);

          // then
          expect(error).to.be.instanceOf(SupervisorAccessNotAuthorizedError);
        });
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When GET', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the session does not exist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a InvalidSessionSupervisingLoginError', async function () {
          // given
          const request = {
            params: {
              id: 8,
            },
          };
          // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
          sessionRepository.get.withArgs(8).throws(new NotFoundError());

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(endTestScreenRemovalEnabled.verifyBySessionId)(request, hFake);

          // then
          expect(error).to.be.an.instanceOf(InvalidSessionSupervisingLoginError);
          expect((error as $TSFixMe).message).to.equal('Le numéro de session et/ou le mot de passe saisis sont incorrects.');
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When session certification center is in the whitelist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return true', async function () {
          // given
          const request = {
            params: {
              id: 8,
            },
          };
          sessionRepository.get.withArgs(8).resolves(domainBuilder.buildSession({ id: 8 }));
          endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.withArgs(8).resolves(true);

          // when
          const response = await endTestScreenRemovalEnabled.verifyBySessionId(request, hFake);

          // then
          expect(response).to.be.true;
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('When session certification center is not in the whitelist', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw', async function () {
          // given
          const request = {
            params: {
              id: 8,
            },
          };
          sessionRepository.get.withArgs(8).resolves(domainBuilder.buildSession({ id: 8 }));
          endTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId.withArgs(8).resolves(false);

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(endTestScreenRemovalEnabled.verifyBySessionId)(request, hFake);

          // then
          expect(error).to.be.instanceOf(SupervisorAccessNotAuthorizedError);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verifyByCertificationCandidateId', function () {
    const request = {
      params: {
        id: 5,
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(endTestScreenRemovalService, 'isEndTestScreenRemovalEnabledByCandidateId');
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("When candidate's certification center is in the whitelist", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        endTestScreenRemovalService.isEndTestScreenRemovalEnabledByCandidateId.withArgs(5).resolves(true);

        // when
        const response = await endTestScreenRemovalEnabled.verifyByCertificationCandidateId(request, hFake);

        // then
        expect(response).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("When candidate's certification center is not in the whitelist", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 404 status code', async function () {
        // given
        endTestScreenRemovalService.isEndTestScreenRemovalEnabledByCandidateId.withArgs(5).resolves(false);

        // when
        const response = await endTestScreenRemovalEnabled.verifyByCertificationCandidateId(request, hFake);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });
});
