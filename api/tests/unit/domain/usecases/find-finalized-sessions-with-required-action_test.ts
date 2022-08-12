// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findFinalizedSessionsWithRequiredAction = require('../../../../lib/domain/usecases/find-finalized-sessions-with-required-action');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | findFinalizedSessionsWithRequiredAction', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are finalized sessions with required actions', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get a list of publishable sessions', async function () {
      // given
      const finalizedSessionRepository = {
        findFinalizedSessionsWithRequiredAction: sinon.stub(),
      };

      const sessionsWithRequiredActions = [
        domainBuilder.buildFinalizedSession({ isPublishable: false, publishedAt: null }),
      ];

      finalizedSessionRepository.findFinalizedSessionsWithRequiredAction.resolves(sessionsWithRequiredActions);
      // when
      const result = await findFinalizedSessionsWithRequiredAction({ finalizedSessionRepository });

      // then
      expect(result).to.deep.equal(sessionsWithRequiredActions);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are no finalized sessions with required action', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get an empty array', async function () {
      // given
      const finalizedSessionRepository = {
        findFinalizedSessionsWithRequiredAction: sinon.stub(),
      };
      finalizedSessionRepository.findFinalizedSessionsWithRequiredAction.resolves([]);
      // when
      const result = await findFinalizedSessionsWithRequiredAction({ finalizedSessionRepository });

      // then
      expect(result).to.deep.equal([]);
    });
  });
});
