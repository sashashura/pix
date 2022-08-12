// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecase'.
const usecase = require('../../../../lib/application/usecases/checkUserIsMemberOfCertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipRepository = require('../../../../lib/infrastructure/repositories/certification-center-membership-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Use Case | CheckUserIsMemberOfCertificationCenter', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCenterMembershipRepository.isMemberOfCertificationCenter = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is member in certification center', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true', async function () {
      // given
      const user = domainBuilder.buildUser();
      const certificationCenter = domainBuilder.buildCertificationCenter();

      domainBuilder.buildCertificationCenterMembership({ user, certificationCenter });
      certificationCenterMembershipRepository.isMemberOfCertificationCenter.resolves(true);

      // when
      const response = await usecase.execute(user.id, certificationCenter.id);

      // then
      expect(response).to.equal(true);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is not admin in organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false', async function () {
      // given
      const userId = 1234;
      const certificationCenterId = 789;
      certificationCenterMembershipRepository.isMemberOfCertificationCenter.resolves(false);

      // when
      const response = await usecase.execute(userId, certificationCenterId);

      // then
      expect(response).to.equal(false);
    });
  });
});
