// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const updateAdminMember = require('../../../../lib/domain/usecases/update-admin-member');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-admin-member', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update the given admin member', async function () {
    // given
    const adminMemberRepository = { update: sinon.stub() };

    const updatedAdminMember = Symbol('pix admin role saved');
    const attributesToUpdate = { role: ROLES.METIER };
    adminMemberRepository.update.withArgs({ id: 7, attributesToUpdate }).resolves(updatedAdminMember);

    // when
    const adminMember = await updateAdminMember({
      id: 7,
      role: ROLES.METIER,
      adminMemberRepository,
    });

    // then
    expect(adminMember).to.deep.equal(updatedAdminMember);
  });
});
