// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCase'.
const useCase = require('../../../../lib/application/usecases/checkUserBelongsToSupOrganizationAndManagesStudents');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Use Case | checkUserBelongsToSupOrganizationAndManagesStudents', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    membershipRepository.findByUserIdAndOrganizationId = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is in a SUP organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true', async function () {
      // given
      const userId = 1234;

      const organization = domainBuilder.buildOrganization({ type: 'SUP', isManagingStudents: true });
      const membership = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when there are several memberships', async function () {
      // given
      const userId = 1234;

      const organization = domainBuilder.buildOrganization({ type: 'SUP', isManagingStudents: true });
      const membership1 = domainBuilder.buildMembership({ organization });
      const membership2 = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership1, membership2]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(true);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is not in a SUP organization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false', async function () {
      // given
      const userId = 1234;
      const organization = domainBuilder.buildOrganization({ type: 'PRO', isManagingStudents: true });
      const membership = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(false);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is in a SUP organization but does not manage students', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false', async function () {
      // given
      const userId = 1234;
      const organization = domainBuilder.buildOrganization({ type: 'SUP', isManagingStudents: false });
      const membership = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(false);
    });
  });
});
