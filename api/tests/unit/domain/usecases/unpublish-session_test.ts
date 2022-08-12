// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, sinon, expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'unpublishS... Remove this comment to see the full error message
const unpublishSession = require('../../../../lib/domain/usecases/unpublish-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FinalizedS... Remove this comment to see the full error message
const FinalizedSession = require('../../../../lib/domain/models/FinalizedSession');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | unpublish-session', function () {
  let certificationRepository: $TSFixMe;
  let sessionRepository: $TSFixMe;
  let finalizedSessionRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationRepository = {
      unpublishCertificationCoursesBySessionId: sinon.stub(),
    };
    sessionRepository = {
      updatePublishedAt: sinon.stub(),
      getWithCertificationCandidates: sinon.stub(),
    };
    finalizedSessionRepository = {
      get: sinon.stub(),
      save: sinon.stub(),
    };
    sessionRepository.flagResultsAsSentToPrescriber = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the session', async function () {
    // given
    const sessionId = 123;
    const expectedSession = domainBuilder.buildSession({
      id: sessionId,
      publishedAt: new Date('2020-01-01'),
    });
    sessionRepository.getWithCertificationCandidates.withArgs(sessionId).resolves(expectedSession);
    const finalizedSession = new FinalizedSession({ sessionId, publishSession: new Date('2020-01-01') });
    finalizedSessionRepository.get.withArgs({ sessionId }).resolves(finalizedSession);

    // when
    const actualSession = await unpublishSession({
      sessionId,
      certificationRepository,
      sessionRepository,
      finalizedSessionRepository,
    });

    // then
    expect(certificationRepository.unpublishCertificationCoursesBySessionId).to.have.been.calledWithExactly(sessionId);
    expect(sessionRepository.updatePublishedAt).to.have.been.calledWithExactly({ id: sessionId, publishedAt: null });
    expect(finalizedSession.publishedAt).to.be.null;
    expect(finalizedSessionRepository.save).to.be.calledWith(finalizedSession);
    expect(actualSession).to.deep.equal({
      ...expectedSession,
      publishedAt: null,
    });
  });
});
