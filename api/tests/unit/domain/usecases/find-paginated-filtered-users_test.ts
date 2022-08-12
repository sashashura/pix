// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-paginated-filtered-users', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should search users with filtering and pagination', async function () {
    // given
    const filter = { email: 'gigi@example.net' };
    const page = { number: 1, size: 2 };

    const resolvedPagination = { page: 1, pageSize: 2, itemsCount: 3, pagesCount: 2 };
    const matchingUsers = [new User({ id: 1 }), new User({ id: 2 }), new User({ id: 3 })];
    const userRepository = {
      findPaginatedFiltered: sinon.stub(),
    };
    userRepository.findPaginatedFiltered
      .withArgs({ filter, page })
      .resolves({ models: matchingUsers, pagination: resolvedPagination });

    // when
    const response = await usecases.findPaginatedFilteredUsers({ filter, page, userRepository });

    // then
    expect(response.models).to.equal(matchingUsers);
    expect(response.pagination.page).to.equal(resolvedPagination.page);
    expect(response.pagination.pageSize).to.equal(resolvedPagination.pageSize);
    expect(response.pagination.itemsCount).to.equal(resolvedPagination.itemsCount);
    expect(response.pagination.pagesCount).to.equal(resolvedPagination.pagesCount);
  });
});
