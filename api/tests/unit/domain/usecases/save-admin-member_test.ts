// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'saveAdminM... Remove this comment to see the full error message
const saveAdminMember = require('../../../../lib/domain/usecases/save-admin-member');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingAdminMemberError, UserNotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AdminMembe... Remove this comment to see the full error message
const AdminMember = require('../../../../lib/domain/models/AdminMember');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | save-admin-member', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when admin member email is not found', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotFound error', async function () {
      // given
      const attributes = { email: 'ice.bot@example.net', role: ROLES.SUPER_ADMIN };
      const adminMemberRepository = {};
      const userRepository = { getByEmail: sinon.stub().rejects(new UserNotFoundError()) };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(saveAdminMember)({ ...attributes, adminMemberRepository, userRepository });

      // then
      expect(error).to.be.an.instanceOf(UserNotFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when admin member does not exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create an admin member', async function () {
      // given
      const attributes = { email: 'ice.bot@example.net', role: ROLES.SUPER_ADMIN };
      const user = domainBuilder.buildUser({ email: attributes.email });
      const savedAdminMember = domainBuilder.buildAdminMember({
        userId: user.id,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        role: ROLES.SUPER_ADMIN,
        createdAt: new Date(),
      });
      const userRepository = { getByEmail: sinon.stub() };
      userRepository.getByEmail.withArgs(attributes.email).resolves(user);
      const adminMemberRepository = {
        get: sinon.stub().resolves(undefined),
        save: sinon.stub(),
      };
      adminMemberRepository.save.withArgs({ userId: user.id, role: ROLES.SUPER_ADMIN }).resolves(savedAdminMember);

      // when
      const result = await saveAdminMember({ ...attributes, adminMemberRepository, userRepository });

      // then
      expect(result).to.be.an.instanceOf(AdminMember);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when admin member exists and is active', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an AlreadyExistingAdminMember error', async function () {
      // given
      const attributes = { email: 'ice.bot@example.net', role: ROLES.SUPER_ADMIN };
      const user = domainBuilder.buildUser({ email: attributes.email });
      const adminMember = domainBuilder.buildAdminMember({
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: ROLES.SUPER_ADMIN,
      });
      const userRepository = { getByEmail: sinon.stub() };
      userRepository.getByEmail.withArgs(attributes.email).resolves(user);
      const adminMemberRepository = { get: sinon.stub() };
      adminMemberRepository.get.withArgs({ userId: user.id }).resolves(adminMember);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(saveAdminMember)({ ...attributes, adminMemberRepository, userRepository });

      // then
      expect(error).to.be.an.instanceOf(AlreadyExistingAdminMemberError);
    });
  });
});
