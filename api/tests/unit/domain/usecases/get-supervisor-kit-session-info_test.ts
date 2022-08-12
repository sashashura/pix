// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getSupervisorKitSessionInfo = require('../../../../lib/domain/usecases/get-supervisor-kit-session-info');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFor... Remove this comment to see the full error message
const SessionForSupervisorKit = require('../../../../lib/domain/read-models/SessionForSupervisorKit');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-supervisor-kit-main-info', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getSupervisorKitSessionInfo', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has access to the session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the session main info', async function () {
        // given
        const userId = 'dummyUserId';
        const sessionId = 'dummySessionId';
        const sessionForSupervisorKitRepository = { get: sinon.stub() };
        const sessionForSupervisorKit = domainBuilder.buildSessionForSupervisorKit({
          id: 1000,
          examiner: 'Toto',
          address: '3 rue ketanou',
          room: '54',
          date: '2021-01-01',
          time: '10:53',
          supervisorPassword: '12AB5',
          accessCode: '1B3DE6',
        });
        sessionForSupervisorKitRepository.get.withArgs(sessionId).resolves(sessionForSupervisorKit);
        const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
        sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(true);

        // when
        const result = await getSupervisorKitSessionInfo({
          userId,
          sessionId,
          sessionRepository,
          sessionForSupervisorKitRepository,
        });

        // then
        expect(result).to.deepEqualInstance(
          new SessionForSupervisorKit({
            id: 1000,
            examiner: 'Toto',
            address: '3 rue ketanou',
            room: '54',
            date: '2021-01-01',
            time: '10:53',
            supervisorPassword: '12AB5',
            accessCode: '1B3DE6',
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user does not have access to the session', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error', async function () {
        // given
        const userId = 'dummyUserId';
        const sessionId = 'dummySessionId';
        const sessionRepository = { doesUserHaveCertificationCenterMembershipForSession: sinon.stub() };
        sessionRepository.doesUserHaveCertificationCenterMembershipForSession.resolves(false);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(getSupervisorKitSessionInfo)({ userId, sessionId, sessionRepository });

        // then
        expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
      });
    });
  });
});
