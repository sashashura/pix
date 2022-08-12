// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialsController = require('../../../../lib/application/user-tutorials/user-tutorials-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/user-tutorial-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialRepository = require('../../../../lib/infrastructure/repositories/user-tutorial-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../../../lib/infrastructure/utils/query-params-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | User-tutorials', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#add', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the expected usecase', async function () {
      // given
      const tutorialId = 'tutorialId';
      const userId = 'userId';
      sinon.stub(usecases, 'addTutorialToUser').returns({ id: 'userTutorialId' });
      sinon.stub(userTutorialSerializer, 'deserialize').returns({});

      const request = {
        auth: { credentials: { userId } },
        params: { tutorialId },
      };

      // when
      await userTutorialsController.add(request, hFake);

      // then
      const addTutorialToUserArgs = usecases.addTutorialToUser.firstCall.args[0];
      expect(addTutorialToUserArgs).to.have.property('userId', userId);
      expect(addTutorialToUserArgs).to.have.property('tutorialId', tutorialId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when skill id is given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the expected usecase', async function () {
        // given
        const skillId = 'skillId';
        const tutorialId = 'tutorialId';
        const userId = 'userId';
        sinon.stub(usecases, 'addTutorialToUser').returns({ id: 'userTutorialId' });
        sinon.stub(userTutorialSerializer, 'deserialize').returns({ skillId });

        const request = {
          auth: { credentials: { userId } },
          params: { tutorialId },
          payload: { data: { attributes: { 'skill-id': 'skillId' } } },
        };

        // when
        await userTutorialsController.add(request, hFake);

        // then
        const addTutorialToUserArgs = usecases.addTutorialToUser.firstCall.args[0];
        expect(addTutorialToUserArgs).to.have.property('userId', userId);
        expect(addTutorialToUserArgs).to.have.property('tutorialId', tutorialId);
        expect(addTutorialToUserArgs).to.have.property('skillId', skillId);
        expect(userTutorialSerializer.deserialize).to.have.been.calledWith(request.payload);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findRecommended', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the expected usecase', async function () {
      // given
      const userId = 'userId';
      const extractedParams = {
        page: {
          number: '1',
          size: '200',
        },
      };
      const headers = {
        'accept-language': 'fr',
      };
      sinon.stub(usecases, 'findPaginatedRecommendedTutorials').returns([]);
      sinon.stub(queryParamsUtils, 'extractParameters').returns(extractedParams);
      const request = {
        auth: { credentials: { userId } },
        'page[number]': '1',
        'page[size]': '200',
        headers,
      };

      // when
      await userTutorialsController.findRecommended(request, hFake);

      // then
      const findPaginatedRecommendedTutorialsArgs = usecases.findPaginatedRecommendedTutorials.firstCall.args[0];
      expect(findPaginatedRecommendedTutorialsArgs).to.have.property('userId', userId);
      expect(findPaginatedRecommendedTutorialsArgs.page).to.deep.equal({
        number: '1',
        size: '200',
      });
      expect(findPaginatedRecommendedTutorialsArgs.locale).to.equal('fr');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findSaved', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the expected usecase', async function () {
      // given
      const userId = 'userId';
      const extractedParams = {
        page: {
          number: '1',
          size: '200',
        },
      };
      sinon.stub(usecases, 'findPaginatedSavedTutorials').returns([]);
      sinon.stub(queryParamsUtils, 'extractParameters').returns(extractedParams);

      const request = {
        auth: { credentials: { userId } },
        'page[number]': '1',
        'page[size]': '200',
      };

      // when
      await userTutorialsController.findSaved(request, hFake);

      // then
      const findPaginatedSavedTutorialsArgs = usecases.findPaginatedSavedTutorials.firstCall.args[0];
      expect(findPaginatedSavedTutorialsArgs).to.have.property('userId', userId);
      expect(findPaginatedSavedTutorialsArgs.page).to.deep.equal({
        number: '1',
        size: '200',
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#removeFromUser', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the repository', async function () {
      // given
      const userId = 'userId';
      const tutorialId = 'tutorialId';
      sinon.stub(userTutorialRepository, 'removeFromUser');

      const request = {
        auth: { credentials: { userId } },
        params: { tutorialId },
      };

      // when
      await userTutorialsController.removeFromUser(request, hFake);

      // then
      const removeFromUserArgs = userTutorialRepository.removeFromUser.firstCall.args[0];
      expect(removeFromUserArgs).to.have.property('userId', userId);
      expect(removeFromUserArgs).to.have.property('tutorialId', tutorialId);
    });
  });
});
