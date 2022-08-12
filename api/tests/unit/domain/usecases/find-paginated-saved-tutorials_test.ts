// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedSavedTutorials = require('../../../../lib/domain/usecases/find-paginated-saved-tutorials');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-paginated-saved-tutorials', function () {
  let tutorialRepository: $TSFixMe;
  const userId = 'userId';

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is no tutorial saved by current user', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      tutorialRepository = {
        findPaginatedForCurrentUser: sinon.spy(async () => ({
          models: [],
          meta: {
            page: 1,
            pageSize: 10,
            rowCount: 0,
            pageCount: 0,
          },
        })),
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the tutorialRepository', async function () {
      // given
      const page = {
        number: 1,
        size: 2,
      };

      // When
      await findPaginatedSavedTutorials({ tutorialRepository, userId, page });

      // Then
      expect(tutorialRepository.findPaginatedForCurrentUser).to.have.been.calledWith({ userId, page });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array', async function () {
      // given
      const page = {
        number: 1,
        size: 2,
      };

      const expectedPagination = {
        page: 1,
        pageSize: 10,
        rowCount: 0,
        pageCount: 0,
      };

      // When
      const paginatedSavedTutorials = await findPaginatedSavedTutorials({
        tutorialRepository,
        userId,
        page,
      });

      // Then
      expect(paginatedSavedTutorials).to.deep.equal({ results: [], meta: expectedPagination });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is one tutorial saved by current user', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return paginated tutorial with user-tutorials', async function () {
      // Given
      const tutorialWithUserSavedTutorial = domainBuilder.buildTutorialForUser();
      tutorialRepository = {
        findPaginatedForCurrentUser: sinon.spy(async () => ({
          models: [tutorialWithUserSavedTutorial],
          meta: {
            page: 1,
            pageSize: 2,
            rowCount: 1,
            pageCount: 1,
          },
        })),
      };

      const page = {
        number: 1,
        size: 2,
      };

      const expectedPagination = {
        page: 1,
        pageSize: 2,
        rowCount: 1,
        pageCount: 1,
      };

      // When
      const paginatedSavedTutorials = await findPaginatedSavedTutorials({
        tutorialRepository,
        userId,
        page,
      });

      // Then
      expect(paginatedSavedTutorials).to.deep.equal({
        results: [tutorialWithUserSavedTutorial],
        meta: expectedPagination,
      });
    });
  });
});
