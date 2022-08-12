// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const flagSessionResultsAsSentToPrescriber = require('../../../../lib/domain/usecases/flag-session-results-as-sent-to-prescriber');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Session'.
const Session = require('../../../../lib/domain/models/Session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | flag-session-results-as-sent-to-prescriber', function () {
  let sessionId: $TSFixMe;
  let sessionRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sessionRepository = { get: sinon.stub(), flagResultsAsSentToPrescriber: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when session id is not a number', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFound error', async function () {
      // given
      sessionId = 'notANumber';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(flagSessionResultsAsSentToPrescriber)({ sessionId, sessionRepository });

      // then
      expect(error).to.be.an.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when session id is a number', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sessionId = 1;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when results are already flagged as sent', function () {
      const alreadyFlaggedResultsAsSentSession = new Session({ resultsSentToPrescriberAt: new Date() });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a NON updated session with a flag to indicate that results has already been sent', async function () {
        // given
        sessionRepository.get.withArgs(sessionId).resolves(alreadyFlaggedResultsAsSentSession);

        // when
        const { resultsFlaggedAsSent, session } = await flagSessionResultsAsSentToPrescriber({
          sessionId,
          sessionRepository,
        });

        // then
        expect(resultsFlaggedAsSent).to.be.false;
        expect(session).to.equal(alreadyFlaggedResultsAsSentSession);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when results are not flagged as sent yet', function () {
      let notFlaggedSession;
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line mocha/no-setup-in-describe
      const updatedSession = Symbol('updatedSession');
      const now = new Date('2019-01-01T05:06:07Z');
      let clock: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        clock = sinon.useFakeTimers(now);
        notFlaggedSession = new Session({ resultsSentToPrescriberAt: null });
        sessionRepository.get.withArgs(sessionId).resolves(notFlaggedSession);
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        clock.restore();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an updated session with a flag to indicate that the flagging has been done', async function () {
        // given
        sessionRepository.flagResultsAsSentToPrescriber
          .withArgs({ id: sessionId, resultsSentToPrescriberAt: now })
          .resolves(updatedSession);

        // when
        const { resultsFlaggedAsSent, session } = await flagSessionResultsAsSentToPrescriber({
          sessionId,
          sessionRepository,
        });

        // then
        expect(resultsFlaggedAsSent).to.be.true;
        expect(session).to.equal(updatedSession);
      });
    });
  });
});
