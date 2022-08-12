// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scorecardC... Remove this comment to see the full error message
const scorecardController = require('../../../../lib/application/scorecards/scorecard-controller');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scorecardS... Remove this comment to see the full error message
const scorecardSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/scorecard-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialSe... Remove this comment to see the full error message
const tutorialSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/tutorial-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | scorecard-controller', function () {
  const authenticatedUserId = '12';
  const scorecardId = 'foo';
  const locale = 'fr';

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getScorecard', function () {
    const authenticatedUserId = '12';

    const scorecard = { name: 'Competence1' };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getScorecard').withArgs({ authenticatedUserId, scorecardId, locale }).resolves(scorecard);
      sinon.stub(scorecardSerializer, 'serialize').resolvesArg(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the expected usecase', async function () {
      // given
      const scorecardId = 'foo';
      const locale = 'fr';

      const request = {
        auth: {
          credentials: {
            userId: authenticatedUserId,
          },
        },
        params: {
          id: scorecardId,
        },
        headers: { 'accept-language': locale },
      };

      // when
      const result = await scorecardController.getScorecard(request, hFake);

      // then
      expect(result).to.be.equal(scorecard);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findTutorials', function () {
    const tutorials: $TSFixMe = [];

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'findTutorials').withArgs({ authenticatedUserId, scorecardId, locale }).resolves(tutorials);
      sinon.stub(tutorialSerializer, 'serialize').withArgs(tutorials).resolves('ok');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the expected usecase', async function () {
      // given
      const request = {
        auth: {
          credentials: {
            userId: authenticatedUserId,
          },
        },
        params: {
          id: scorecardId,
        },
        headers: { 'accept-language': locale },
      };

      // when
      const result = await scorecardController.findTutorials(request, hFake);

      // then
      expect(result).to.be.equal('ok');
    });
  });
});
