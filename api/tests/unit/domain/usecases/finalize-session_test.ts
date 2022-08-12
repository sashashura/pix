// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, catchErr, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const finalizeSession = require('../../../../lib/domain/usecases/finalize-session');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionAlr... Remove this comment to see the full error message
  SessionAlreadyFinalizedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
  InvalidCertificationReportForFinalization,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionFin... Remove this comment to see the full error message
const SessionFinalized = require('../../../../lib/domain/events/SessionFinalized');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | finalize-session', function () {
  let sessionId: $TSFixMe;
  let updatedSession: $TSFixMe;
  let examinerGlobalComment: $TSFixMe;
  let sessionRepository: $TSFixMe;
  let certificationReportRepository: $TSFixMe;
  let hasIncident: $TSFixMe;
  let hasJoiningIssue: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sessionId = 'dummy session id';
    updatedSession = domainBuilder.buildSession({
      id: sessionId,
      examinerGlobalComment,
      hasIncident,
      hasJoiningIssue,
      finalizedAt: new Date(),
    });
    examinerGlobalComment = 'It was a fine session my dear.';
    sessionRepository = {
      finalize: sinon.stub(),
      isFinalized: sinon.stub(),
    };
    certificationReportRepository = {
      finalizeAll: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the session status is already finalized', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sessionRepository.isFinalized.withArgs(sessionId).resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a SessionAlreadyFinalizedError error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(finalizeSession)({
        sessionId,
        examinerGlobalComment,
        sessionRepository,
        certificationReports: [],
        certificationReportRepository,
      });

      // then
      expect(err).to.be.instanceOf(SessionAlreadyFinalizedError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the session status is not finalized yet ', function () {
    let certificationReports: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the certificationReports are not valid', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const courseWithoutHasSeenLastScreen = domainBuilder.buildCertificationReport();
        delete courseWithoutHasSeenLastScreen.hasSeenEndTestScreen;
        certificationReports = [courseWithoutHasSeenLastScreen];
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an InvalidCertificationReportForFinalization error', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const err = await catchErr(finalizeSession)({
          sessionId,
          examinerGlobalComment,
          sessionRepository,
          certificationReports,
          certificationReportRepository,
        });

        // then
        expect(err).to.be.instanceOf(InvalidCertificationReportForFinalization);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the certificationReports are valid', function () {
      const now = new Date('2019-01-01T05:06:07Z');
      let clock: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const validReportForFinalization = domainBuilder.buildCertificationReport({
          examinerComment: 'signalement sur le candidat',
          hasSeenEndTestScreen: false,
        });
        certificationReports = [validReportForFinalization];
        sessionRepository.isFinalized.withArgs(sessionId).resolves(false);
        certificationReportRepository.finalizeAll.withArgs(certificationReports).resolves();
        sessionRepository.finalize
          .withArgs({
            id: sessionId,
            examinerGlobalComment,
            finalizedAt: now,
          })
          .resolves(updatedSession);
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        clock.restore();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should finalize session with expected arguments', async function () {
        // given
        clock = sinon.useFakeTimers(now);
        const validReportForFinalization = domainBuilder.buildCertificationReport({
          examinerComment: 'signalement sur le candidat',
          hasSeenEndTestScreen: false,
          isCompleted: true,
        });
        certificationReports = [validReportForFinalization];
        sessionRepository.isFinalized.withArgs(sessionId).resolves(false);
        certificationReportRepository.finalizeAll.withArgs(certificationReports).resolves();
        sessionRepository.finalize
          .withArgs({
            id: sessionId,
            examinerGlobalComment,
            hasIncident,
            hasJoiningIssue,
            finalizedAt: now,
          })
          .resolves(updatedSession);

        // when
        await finalizeSession({
          sessionId,
          examinerGlobalComment,
          hasIncident,
          hasJoiningIssue,
          sessionRepository,
          certificationReports,
          certificationReportRepository,
        });

        // then
        expect(
          sessionRepository.finalize.calledWithExactly({
            id: sessionId,
            examinerGlobalComment,
            hasIncident,
            hasJoiningIssue,
            finalizedAt: now,
          })
        ).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('raises a session finalized event', async function () {
        // given
        const updatedSession = domainBuilder.buildSession({
          finalizedAt: new Date('2020-01-01T14:00:00Z'),
          examinerGlobalComment: 'an examiner comment',
          certificationCenter: 'a certification center name',
          date: '2019-12-12',
          time: '16:00:00',
        });
        clock = sinon.useFakeTimers(now);
        const validReportForFinalization = domainBuilder.buildCertificationReport({
          examinerComment: 'signalement sur le candidat',
          hasSeenEndTestScreen: false,
          isCompleted: true,
        });
        certificationReports = [validReportForFinalization];
        sessionRepository.isFinalized.withArgs(sessionId).resolves(false);
        certificationReportRepository.finalizeAll.withArgs(certificationReports).resolves();
        sessionRepository.finalize
          .withArgs({
            id: sessionId,
            examinerGlobalComment,
            hasIncident,
            hasJoiningIssue,
            finalizedAt: now,
          })
          .resolves(updatedSession);

        // when
        const event = await finalizeSession({
          sessionId,
          examinerGlobalComment,
          hasIncident,
          hasJoiningIssue,
          sessionRepository,
          certificationReports,
          certificationReportRepository,
        });

        // then
        expect(event).to.be.an.instanceof(SessionFinalized);
        expect(event).to.deep.equal(
          new SessionFinalized({
            sessionId,
            finalizedAt: new Date('2020-01-01T14:00:00Z'),
            hasExaminerGlobalComment: true,
            certificationCenterName: 'a certification center name',
            sessionDate: '2019-12-12',
            sessionTime: '16:00:00',
          })
        );
      });
    });
  });
});
