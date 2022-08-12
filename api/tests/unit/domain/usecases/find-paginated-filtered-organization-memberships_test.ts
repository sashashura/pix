// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Memberships = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-paginated-filtered-organizations-memberships', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should result organizations with filtering and pagination', async function () {
    // given
    const organizationId = 345;
    const filter = { firstName: 'André' };
    const page = { number: 1, size: 2 };

    const resolvedPagination = { page: 1, pageSize: 2, itemsCount: 3, pagesCount: 2 };
    const matchingMemberships = [new Memberships({ id: 1 }), new Memberships({ id: 2 }), new Memberships({ id: 3 })];
    const membershipRepository = {
      findPaginatedFiltered: sinon.stub(),
    };
    membershipRepository.findPaginatedFiltered
      .withArgs({ organizationId, filter, page })
      .resolves({ models: matchingMemberships, pagination: resolvedPagination });

    // when
    const response = await usecases.findPaginatedFilteredOrganizationMemberships({
      organizationId,
      filter,
      page,
      membershipRepository,
    });

    // then
    expect(response.models).to.equal(matchingMemberships);
    expect(response.pagination.page).to.equal(resolvedPagination.page);
    expect(response.pagination.pageSize).to.equal(resolvedPagination.pageSize);
    expect(response.pagination.itemsCount).to.equal(resolvedPagination.itemsCount);
    expect(response.pagination.pagesCount).to.equal(resolvedPagination.pagesCount);
  });
});
