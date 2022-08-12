// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const archiveOrganization = require('../../../../lib/domain/usecases/archive-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | archive-organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should archive the organization', async function () {
    // given
    const organizationForAdminRepository = {
      archive: sinon.stub(),
      get: sinon.stub(),
    };
    const now = new Date('2022-02-22');
    const clock = sinon.useFakeTimers(now);
    const organizationId = 1;
    const superAdminUser = domainBuilder.buildUser({
      id: 123,
      firstName: 'Clémen',
      lastName: 'Tine',
    });
    const expectedArchivedOrganization = domainBuilder.buildOrganizationForAdmin({
      archivedAt: now,
      archivistFirstName: superAdminUser.firstName,
      archivistLastName: superAdminUser.lastName,
    });

    organizationForAdminRepository.archive.resolves();
    organizationForAdminRepository.get.resolves(expectedArchivedOrganization);

    // when
    const archivedOrganizationForAdmin = await archiveOrganization({
      organizationId,
      userId: superAdminUser.id,
      organizationForAdminRepository,
    });

    // then
    expect(organizationForAdminRepository.archive).to.have.been.calledWith({
      id: organizationId,
      archivedBy: superAdminUser.id,
    });
    expect(organizationForAdminRepository.get).to.have.been.calledWith(organizationId);
    expect(archivedOrganizationForAdmin).to.deep.equal(expectedArchivedOrganization);
    clock.restore();
  });
});
