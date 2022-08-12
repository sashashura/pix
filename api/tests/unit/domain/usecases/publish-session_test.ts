// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'publishSes... Remove this comment to see the full error message
const publishSession = require('../../../../lib/domain/usecases/publish-session');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | publish-session', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('delegates the action to the session-publication-service and return the session', async function () {
    // given
    const sessionId = Symbol('a session id');
    const session = Symbol('a session');
    const certificationRepository = Symbol('the certification repository');
    const finalizedSessionRepository = Symbol('the finalizedSessionRepository');
    const publishedAt = Symbol('a publication date');

    const sessionRepository = {
      get: sinon.stub(),
    };
    sessionRepository.get.resolves(session);

    const sessionPublicationService = {
      publishSession: sinon.stub(),
    };

    // when
    const result = await publishSession({
      sessionId,
      certificationRepository,
      finalizedSessionRepository,
      sessionRepository,
      sessionPublicationService,
      publishedAt,
    });

    // then
    expect(sessionPublicationService.publishSession).to.have.been.calledWithExactly({
      sessionId,
      certificationRepository,
      finalizedSessionRepository,
      sessionRepository,
      publishedAt,
    });
    expect(result).to.equal(session);
  });
});
