// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecase'.
const usecase = require('../../../../lib/application/usecases/checkUserBelongsToOrganizationManagingStudents');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Use Case | checkUserBelongsToOrganizationManagingStudents', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    membershipRepository.findByUserIdAndOrganizationId = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return true when user belongs to organization managing students', async function () {
    // given
    const userId = 1234;

    const organization = domainBuilder.buildOrganization({ isManagingStudents: true });
    const membership = domainBuilder.buildMembership({ organization });
    membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

    // when
    const response = await usecase.execute(userId, organization.id);

    // then
    expect(response).to.equal(true);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return false when organization does not manage students', async function () {
    // given
    const userId = 1234;

    const organization = domainBuilder.buildOrganization({ isManagingStudents: false });
    const membership = domainBuilder.buildMembership({ organization });
    membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

    // when
    const response = await usecase.execute(userId, organization.id);

    // then
    expect(response).to.equal(false);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return false when user is not a member of organization', async function () {
    // given
    const userId = 1234;

    const organization = domainBuilder.buildOrganization({ isManagingStudents: true });
    membershipRepository.findByUserIdAndOrganizationId.resolves([]);

    // when
    const response = await usecase.execute(userId, organization.id);

    // then
    expect(response).to.equal(false);
  });
});
