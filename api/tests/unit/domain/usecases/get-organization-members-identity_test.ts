// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getOrganizationMemberIdentities = require('../../../../lib/domain/usecases/get-organization-members-identity');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationMemberIdentity = require('../../../../lib/domain/models/OrganizationMemberIdentity');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-organization-members', function () {
  let organizationMemberIdentityRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    organizationMemberIdentityRepository = {
      findAllByOrganizationId: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return organization members', async function () {
    // given
    const organizationId = 123;
    const member1 = new OrganizationMemberIdentity({ id: 444, firstName: 'Gérard', lastName: 'Menfaim' });
    const member2 = new OrganizationMemberIdentity({ id: 777, firstName: 'Guy', lastName: 'Tar' });
    const organizationMembers = [member1, member2];
    organizationMemberIdentityRepository.findAllByOrganizationId
      .withArgs({ organizationId })
      .resolves(organizationMembers);

    // when
    const result = await getOrganizationMemberIdentities({
      organizationId,
      organizationMemberIdentityRepository,
    });

    // then
    expect(result).to.be.deep.equal(organizationMembers);
  });
});
