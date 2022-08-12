// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-certification-center-memberships-by-certification-center', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should result certification-center-memberships by certification center id', async function () {
    // given
    const certificationCenterId = 1;
    const certificationCenterMemberships = [domainBuilder.buildCertificationCenterMembership()];
    const certificationCenterMembershipRepository = { findActiveByCertificationCenterIdSortedById: sinon.stub() };
    certificationCenterMembershipRepository.findActiveByCertificationCenterIdSortedById.resolves(
      certificationCenterMemberships
    );

    // when
    const foundCertificationCenterMemberships = await usecases.findCertificationCenterMembershipsByCertificationCenter({
      certificationCenterId,
      certificationCenterMembershipRepository,
    });

    // then
    expect(certificationCenterMembershipRepository.findActiveByCertificationCenterIdSortedById).to.have.been.calledWith(
      { certificationCenterId }
    );
    expect(foundCertificationCenterMemberships).to.deep.equal(certificationCenterMemberships);
  });
});
