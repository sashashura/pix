// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { disableCertificationCenterMembership } = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipRepository = require('../../../../lib/infrastructure/repositories/certification-center-membership-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | disable-certification-center-membership', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should disable certification center membership', async function () {
    // given
    const certificationCenterMembershipId = 100;
    sinon.stub(certificationCenterMembershipRepository, 'disableById');

    // when
    await disableCertificationCenterMembership({
      certificationCenterMembershipId,
      certificationCenterMembershipRepository,
    });

    // then
    expect(certificationCenterMembershipRepository.disableById).to.have.been.calledWithExactly({
      certificationCenterMembershipId,
    });
  });
});
