// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCase'.
const useCase = require('../../../../lib/application/usecases/checkUserIsAdminInOrganization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Use Case | CheckUserIsAdminInOrganization', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    membershipRepository.findByUserIdAndOrganizationId = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is admin in organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true', async function () {
      // given
      const userId = 1234;
      const organizationId = 789;

      const membership = domainBuilder.buildMembership({ organizationRole: Membership.roles.ADMIN });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

      // when
      const response = await useCase.execute(userId, organizationId);

      // then
      expect(response).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true with several memberships', async function () {
      // given
      const userId = 1234;
      const organizationId = 789;

      const membershipAdmin = domainBuilder.buildMembership({ organizationRole: Membership.roles.ADMIN });
      const membershipMember = domainBuilder.buildMembership({ organizationRole: Membership.roles.MEMBER });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membershipAdmin, membershipMember]);

      // when
      const response = await useCase.execute(userId, organizationId);

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
      const organizationId = 789;
      membershipRepository.findByUserIdAndOrganizationId.resolves([]);

      // when
      const response = await useCase.execute(userId, organizationId);

      // then
      expect(response).to.equal(false);
    });
  });
});
