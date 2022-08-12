// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getAdminMembers = require('../../../../lib/domain/usecases/get-admin-members');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-admin-members', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return all admin members', async function () {
    // given
    const adminMemberRepository = {
      findAll: sinon.stub(),
    };
    const adminMember = domainBuilder.buildAdminMember();
    const otherAdminMember = domainBuilder.buildAdminMember();
    adminMemberRepository.findAll.resolves([adminMember, otherAdminMember]);

    // when
    const adminMembers = await getAdminMembers({ adminMemberRepository });

    // then
    expect(adminMembers).to.deep.equal([adminMember, otherAdminMember]);
  });
});
