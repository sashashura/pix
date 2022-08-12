// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipRepository = require('../../../../lib/infrastructure/repositories/certification-center-membership-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenterMembership = require('../../../../lib/domain/models/CertificationCenterMembership');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { findCertificationCenterMembershipsByCertificationCenter } = require('../../../../lib/domain/usecases/index');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | find-certification-center-memberships-by-certification-center', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return certification center memberships', async function () {
    // given
    const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
    const user = databaseBuilder.factory.buildUser();
    const certificationCenterMembership = databaseBuilder.factory.buildCertificationCenterMembership({
      certificationCenterId: certificationCenter.id,
      userId: user.id,
    });

    await databaseBuilder.commit();

    // when
    const foundCertificationCenterMemberships = await findCertificationCenterMembershipsByCertificationCenter({
      certificationCenterId: certificationCenter.id,
      certificationCenterMembershipRepository,
    });

    // then
    const foundCertificationCenterMembership = foundCertificationCenterMemberships[0];
    expect(foundCertificationCenterMembership).to.be.instanceOf(CertificationCenterMembership);
    expect(foundCertificationCenterMembership.id).to.equal(certificationCenterMembership.id);
    expect(foundCertificationCenterMembership.certificationCenter.id).to.equal(certificationCenter.id);
    expect(foundCertificationCenterMembership.user.id).to.equal(user.id);
  });
});
