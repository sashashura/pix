// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../../../lib/domain/models/CertificationCenter');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-paginated-filtered-certification-centers', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should result certification-centers with filtering and pagination', async function () {
    // given
    const filter = { name: 'Dragon' };
    const page = { number: 1, size: 2 };

    const resolvedPagination = { page: 1, pageSize: 2, itemsCount: 3, pagesCount: 2 };
    const matchingCertificationCenters = [
      new CertificationCenter({ id: 1 }),
      new CertificationCenter({ id: 2 }),
      new CertificationCenter({ id: 3 }),
    ];
    const certificationCenterRepository = {
      findPaginatedFiltered: sinon.stub(),
    };
    certificationCenterRepository.findPaginatedFiltered
      .withArgs({ filter, page })
      .resolves({ models: matchingCertificationCenters, pagination: resolvedPagination });

    // when
    const response = await usecases.findPaginatedFilteredCertificationCenters({
      filter,
      page,
      certificationCenterRepository,
    });

    // then
    expect(response.models).to.equal(matchingCertificationCenters);
    expect(response.pagination.page).to.equal(resolvedPagination.page);
    expect(response.pagination.pageSize).to.equal(resolvedPagination.pageSize);
    expect(response.pagination.itemsCount).to.equal(resolvedPagination.itemsCount);
    expect(response.pagination.pagesCount).to.equal(resolvedPagination.pagesCount);
  });
});
