// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findFinalizedSessionsToPublish = require('../../../../lib/domain/usecases/find-finalized-sessions-to-publish');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | findFinalizedSessionsToPublish', function () {
  let finalizedSessionRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    finalizedSessionRepository = {
      findFinalizedSessionsToPublish: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are finalized publishable sessions', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get a list of publishable sessions', async function () {
      // given
      const publishableSessions = [
        domainBuilder.buildFinalizedSession({ isPublishable: true }),
        domainBuilder.buildFinalizedSession({ isPublishable: true }),
        domainBuilder.buildFinalizedSession({ isPublishable: true }),
      ];

      finalizedSessionRepository.findFinalizedSessionsToPublish.resolves(publishableSessions);
      // when
      const result = await findFinalizedSessionsToPublish({ finalizedSessionRepository });

      // then
      expect(result).to.deep.equal(publishableSessions);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are no finalized publishable sessions', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get an empty array', async function () {
      // given
      finalizedSessionRepository.findFinalizedSessionsToPublish.resolves([]);
      // when
      const result = await findFinalizedSessionsToPublish({ finalizedSessionRepository });

      // then
      expect(result).to.deep.equal([]);
    });
  });
});
