// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const superviseSession = require('../../../../lib/domain/usecases/supervise-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
const { InvalidSessionSupervisingLoginError, SessionNotAccessible } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | supervise-session', function () {
  let sessionRepository: $TSFixMe;
  let supervisorAccessRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sessionRepository = {
      get: sinon.stub(),
    };
    supervisorAccessRepository = {
      create: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a InvalidSessionSupervisingLoginError when the supervised password is wrong', async function () {
    // given
    const sessionId = 123;
    const supervisorPassword = 'NOT_MATCHING_SUPERVISOR_PASSWORD';
    const userId = 434;
    const session = domainBuilder.buildSession({ id: sessionId });
    sessionRepository.get.resolves(session);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(superviseSession)({
      sessionId,
      supervisorPassword,
      userId,
      sessionRepository,
      supervisorAccessRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(InvalidSessionSupervisingLoginError);
    expect((error as $TSFixMe).message).to.equal('Le numéro de session et/ou le mot de passe saisis sont incorrects.');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a SessionNotAccessible when the session is not accessible', async function () {
    // given
    const sessionId = 123;
    const userId = 434;
    const session = domainBuilder.buildSession.processed({ id: sessionId });
    session.generateSupervisorPassword();
    sessionRepository.get.resolves(session);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(superviseSession)({
      sessionId,
      supervisorPassword: session.supervisorPassword,
      userId,
      sessionRepository,
      supervisorAccessRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(SessionNotAccessible);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create a supervisor access', async function () {
    // given
    const sessionId = 123;
    const userId = 434;
    const session = domainBuilder.buildSession.created({ id: sessionId });
    session.generateSupervisorPassword();
    sessionRepository.get.resolves(session);

    // when
    await superviseSession({
      sessionId,
      supervisorPassword: session.supervisorPassword,
      userId,
      sessionRepository,
      supervisorAccessRepository,
    });

    // then
    expect(supervisorAccessRepository.create).to.have.been.calledWith({ sessionId, userId });
  });
});
