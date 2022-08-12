// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findRecommendedTutorials = require('../../../../lib/domain/usecases/find-paginated-recommended-tutorials');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-paginated-recommended-tutorials', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should call tutorial repository with userId, page and locale', async function () {
    // given
    const userId = 1;
    const page = {
      number: 1,
      size: 2,
    };
    const tutorialRepository = {
      findPaginatedRecommendedByUserId: sinon.stub().resolves([]),
    };
    const locale = 'fr-fr';

    // when
    await findRecommendedTutorials({
      userId,
      tutorialRepository,
      page,
      locale,
    });

    // then
    expect(tutorialRepository.findPaginatedRecommendedByUserId).to.have.been.calledWith({ userId, page, locale });
  });
});
