// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const publishSessionsInBatch = require('../../../../lib/domain/usecases/publish-sessions-in-batch');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | publish-sessions-in-batch', function () {
  let sessionPublicationService: $TSFixMe;
  let certificationRepository: $TSFixMe;
  let finalizedSessionRepository: $TSFixMe;
  let sessionRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationRepository = Symbol('certificationRepository');
    finalizedSessionRepository = Symbol('finalizedSessionRepository');
    sessionRepository = Symbol('sessionRepository');

    sessionPublicationService = {
      publishSession: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('delegates to the publish session service', async function () {
    // given
    const sessionId1 = Symbol('first session id');
    const sessionId2 = Symbol('second session id');
    const publishedAt = Symbol('a publication date');

    // when
    await publishSessionsInBatch({
      sessionIds: [sessionId1, sessionId2],
      certificationRepository,
      finalizedSessionRepository,
      sessionPublicationService,
      sessionRepository,
      publishedAt,
      batchId: 'batch id',
    });

    // then
    expect(sessionPublicationService.publishSession).to.have.been.calledWithExactly({
      sessionId: sessionId1,
      certificationRepository,
      finalizedSessionRepository,
      sessionRepository,
      publishedAt,
    });
    expect(sessionPublicationService.publishSession).to.have.been.calledWithExactly({
      sessionId: sessionId2,
      certificationRepository,
      finalizedSessionRepository,
      sessionRepository,
      publishedAt,
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when one or many session publication fail', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should continue', async function () {
      // given
      const sessionId1 = Symbol('first session id');
      const sessionId2 = Symbol('second session id');
      const publishedAt = Symbol('a publication date');

      sessionPublicationService.publishSession
        .withArgs({
          sessionId: sessionId1,
          certificationRepository,
          finalizedSessionRepository,
          sessionPublicationService,
          sessionRepository,
          publishedAt,
        })
        .rejects(new Error('an error'));

      // when
      await publishSessionsInBatch({
        sessionIds: [sessionId1, sessionId2],
        certificationRepository,
        finalizedSessionRepository,
        sessionPublicationService,
        sessionRepository,
        publishedAt,
        batchId: 'batch id',
      });

      expect(sessionPublicationService.publishSession).to.have.been.calledWithExactly({
        sessionId: sessionId2,
        certificationRepository,
        finalizedSessionRepository,
        sessionRepository,
        publishedAt,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the errors with a batch id', async function () {
      // given
      const sessionId1 = Symbol('first session id');
      const sessionId2 = Symbol('second session id');
      const publishedAt = Symbol('a publication date');

      const sessionPublicationService = {
        publishSession: sinon.stub(),
      };
      const error1 = new Error('an error');
      const error2 = new Error('another error');
      sessionPublicationService.publishSession
        .withArgs({
          sessionId: sessionId1,
          finalizedSessionRepository,
          sessionPublicationService,
          sessionRepository,
          publishedAt,
        })
        .rejects(error1);
      sessionPublicationService.publishSession
        .withArgs({
          sessionId: sessionId2,
          finalizedSessionRepository,
          sessionPublicationService,
          sessionRepository,
          publishedAt,
        })
        .rejects(error2);

      // when
      const result = await publishSessionsInBatch({
        sessionIds: [sessionId1, sessionId2],
        certificationRepository,
        finalizedSessionRepository,
        sessionPublicationService,
        sessionRepository,
        publishedAt,
        batchId: 'batch id',
      });

      // then
      expect(result.batchId).to.equal('batch id');
      expect(result.publicationErrors).to.deep.equal({
        [sessionId1]: error1,
        [sessionId2]: error2,
      });
    });
  });
});
