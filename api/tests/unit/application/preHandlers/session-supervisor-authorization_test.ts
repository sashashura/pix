// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionSup... Remove this comment to see the full error message
const sessionSupervisorAuthorization = require('../../../../lib/application/preHandlers/session-supervisor-authorization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supervisor... Remove this comment to see the full error message
const supervisorAccessRepository = require('../../../../lib/infrastructure/repositories/supervisor-access-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../../../lib/infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Pre-handler | Supervisor Authorization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verifyByCertificationCandidateId', function () {
    const request = {
      params: {
        id: 8,
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(supervisorAccessRepository, 'isUserSupervisorForSessionCandidate');
      sinon.stub(requestResponseUtils, 'extractUserIdFromRequest');
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When user is the supervisor of the assessment session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        requestResponseUtils.extractUserIdFromRequest.returns(100);
        supervisorAccessRepository.isUserSupervisorForSessionCandidate
          .withArgs({
            certificationCandidateId: 8,
            supervisorId: 100,
          })
          .resolves(true);

        // when
        const response = await sessionSupervisorAuthorization.verifyByCertificationCandidateId(request, hFake);

        // then
        expect(response).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When user is not the supervisor of the assessment session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401', async function () {
        // given
        requestResponseUtils.extractUserIdFromRequest.returns(100);
        supervisorAccessRepository.isUserSupervisorForSessionCandidate
          .withArgs({
            certificationCandidateId: 8,
            supervisorId: 100,
          })
          .resolves(false);

        // when
        const response = await sessionSupervisorAuthorization.verifyByCertificationCandidateId(request, hFake);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#verifyBySessionId', function () {
    const request = {
      params: {
        id: 201,
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(supervisorAccessRepository, 'isUserSupervisorForSession');
      sinon.stub(requestResponseUtils, 'extractUserIdFromRequest');
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When user is the supervisor of the assessment session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        requestResponseUtils.extractUserIdFromRequest.returns(100);

        supervisorAccessRepository.isUserSupervisorForSession.resolves(true);

        // when
        const response = await sessionSupervisorAuthorization.verifyBySessionId(request, hFake);

        // then
        sinon.assert.calledWith(supervisorAccessRepository.isUserSupervisorForSession, {
          sessionId: 201,
          userId: 100,
        });
        expect(response).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('When user is not the supervisor of the session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return status code 401', async function () {
        // given
        requestResponseUtils.extractUserIdFromRequest.returns(101);
        supervisorAccessRepository.isUserSupervisorForSession.resolves(false);

        // when
        const response = await sessionSupervisorAuthorization.verifyBySessionId(request, hFake);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
