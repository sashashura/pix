// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'finalizedS... Remove this comment to see the full error message
const finalizedSessionController = require('../../../../lib/application/sessions/finalized-session-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toBePublis... Remove this comment to see the full error message
const toBePublishedSessionSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/to-be-published-session-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'withRequir... Remove this comment to see the full error message
const withRequiredActionSessionSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/with-required-action-session-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | finalized-session', function () {
  let request: $TSFixMe;
  const userId = 274939274;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findFinalizedSessionsToPublish', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'findFinalizedSessionsToPublish').resolves();
      sinon.stub(toBePublishedSessionSerializer, 'serialize');

      request = {
        payload: {},
        auth: {
          credentials: {
            userId,
          },
        },
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are finalized publishable sessions', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should find finalized publishable sessions', async function () {
        // given
        const foundFinalizedSessions = Symbol('foundSession');
        const serializedFinalizedSessions = Symbol('serializedSession');
        usecases.findFinalizedSessionsToPublish.resolves(foundFinalizedSessions);
        toBePublishedSessionSerializer.serialize.withArgs(foundFinalizedSessions).resolves(serializedFinalizedSessions);

        // when
        const response = await finalizedSessionController.findFinalizedSessionsToPublish(request, hFake);

        // then
        expect(response).to.deep.equal(serializedFinalizedSessions);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findFinalizedSessionsWithRequiredAction', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are finalized sessions with required action', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should find finalized sessions with required action', async function () {
        // given
        request = {
          payload: {},
          auth: {
            credentials: {
              userId,
            },
          },
        };

        const foundFinalizedSessions = Symbol('foundSession');
        sinon.stub(usecases, 'findFinalizedSessionsWithRequiredAction');
        usecases.findFinalizedSessionsWithRequiredAction.resolves(foundFinalizedSessions);

        sinon.stub(withRequiredActionSessionSerializer, 'serialize');
        const serializedFinalizedSessions = Symbol('serializedSession');
        withRequiredActionSessionSerializer.serialize
          .withArgs(foundFinalizedSessions)
          .resolves(serializedFinalizedSessions);

        // when
        const response = await finalizedSessionController.findFinalizedSessionsWithRequiredAction(request, hFake);

        // then
        expect(response).to.deep.equal(serializedFinalizedSessions);
      });
    });
  });
});
