// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getJurySession = require('../../../../lib/domain/usecases/get-jury-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-jury-session', function () {
  let jurySessionRepository: $TSFixMe;
  let supervisorAccessRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    jurySessionRepository = {
      get: sinon.stub(),
    };
    supervisorAccessRepository = {
      sessionHasSupervisorAccess: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the session exists', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the session', async function () {
      // given
      const sessionId = 123;
      const sessionToFind = domainBuilder.buildJurySession({ id: sessionId });
      jurySessionRepository.get.withArgs(sessionId).resolves(sessionToFind);

      // when
      const { jurySession: actualSession } = await getJurySession({
        sessionId,
        jurySessionRepository,
        supervisorAccessRepository,
      });

      // then
      expect(actualSession).to.deepEqualInstance(sessionToFind);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the session has supervisor access', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return hasSupervisorAccess to true', async function () {
      // given
      const sessionId = 123;
      const sessionToFind = domainBuilder.buildJurySession({ id: sessionId });
      jurySessionRepository.get.withArgs(sessionId).resolves({ session: sessionToFind });
      supervisorAccessRepository.sessionHasSupervisorAccess.withArgs({ sessionId }).resolves(true);

      // when
      const { hasSupervisorAccess } = await getJurySession({
        sessionId,
        jurySessionRepository,
        supervisorAccessRepository,
      });

      // then
      expect(hasSupervisorAccess).to.be.true;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the session does not have supervisor access', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return hasSupervisorAccess to false', async function () {
      // given
      const sessionId = 123;
      const sessionToFind = domainBuilder.buildJurySession({ id: sessionId });
      jurySessionRepository.get.withArgs(sessionId).resolves({ session: sessionToFind });
      supervisorAccessRepository.sessionHasSupervisorAccess.withArgs({ sessionId }).resolves(false);

      // when
      const { hasSupervisorAccess } = await getJurySession({
        sessionId,
        jurySessionRepository,
        supervisorAccessRepository,
      });

      // then
      expect(hasSupervisorAccess).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the session does not exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error the session', async function () {
      // given
      const sessionId = 123;
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      jurySessionRepository.get.withArgs(sessionId).rejects(new NotFoundError());

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(getJurySession)({ sessionId, jurySessionRepository, supervisorAccessRepository });

      // then
      expect(err).to.be.an.instanceof(NotFoundError);
    });
  });
});
