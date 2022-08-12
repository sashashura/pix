// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberController = require('../../../../lib/application/admin-members/admin-member-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/admin-member-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | admin-member-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAll', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized admin members', async function () {
      // given
      const member = domainBuilder.buildAdminMember();
      const otherMember = domainBuilder.buildAdminMember();
      sinon.stub(usecases, 'getAdminMembers').resolves([member, otherMember]);
      const serializedMembers = Symbol('serializedMembers');
      sinon.stub(adminMemberSerializer, 'serialize').withArgs([member, otherMember]).returns(serializedMembers);

      // when
      const result = await adminMemberController.findAll();

      // then
      expect(usecases.getAdminMembers).to.have.been.calledOnce;
      expect(result).to.equal(serializedMembers);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCurrentAdminMember', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should get the current admin member', async function () {
      // given
      const request = { auth: { credentials: { userId: 1 } } };
      const adminMemberDetails = Symbol('adminMemberDetails');
      sinon.stub(usecases, 'getAdminMemberDetails').withArgs({ userId: 1 }).resolves(adminMemberDetails);
      const serializedUpdatedMember = Symbol('serializedUpdatedMember');
      sinon.stub(adminMemberSerializer, 'serialize').withArgs(adminMemberDetails).returns(serializedUpdatedMember);

      // when
      const response = await adminMemberController.getCurrentAdminMember(request);

      // then
      expect(response).to.be.equal(serializedUpdatedMember);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateAdminMember', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized admin member with updated values', async function () {
      // given
      const id = 7;
      const role = ROLES.SUPPORT;

      const updatedMember = Symbol('updatedMember');
      sinon.stub(usecases, 'updateAdminMember').withArgs({ id, role }).resolves(updatedMember);

      const serializedUpdatedMember = Symbol('serializedUpdatedMember');
      sinon.stub(adminMemberSerializer, 'deserialize').returns({ role });
      sinon.stub(adminMemberSerializer, 'serialize').withArgs(updatedMember).returns(serializedUpdatedMember);

      // when
      const result = await adminMemberController.updateAdminMember({
        params: { id },
        payload: { data: { attributes: { role: ROLES.SUPPORT } } },
      });

      // then
      expect(result).to.equal(serializedUpdatedMember);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deactivateAdminMember', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty reponse', async function () {
      // given
      const id = 7;

      const deactivatedMember = Symbol('deactivatedMember');
      sinon.stub(usecases, 'deactivateAdminMember').withArgs({ id }).resolves(deactivatedMember);

      const serializedDeactivatedMember = Symbol('serializedDeactivatedMember');
      sinon.stub(adminMemberSerializer, 'serialize').withArgs(deactivatedMember).returns(serializedDeactivatedMember);

      // when
      const { statusCode } = await adminMemberController.deactivateAdminMember(
        {
          params: { id },
        },
        hFake
      );

      // then
      expect(statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveAdminMember', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized admin member saved', async function () {
      // given
      const attributes = { email: 'green.bot@example.net', role: ROLES.SUPER_ADMIN };
      const savedAdminMember = Symbol('saved admin member');
      sinon.stub(usecases, 'saveAdminMember').withArgs(attributes).resolves(savedAdminMember);

      const serializedAdminMember = Symbol('serialized admin member');
      sinon.stub(adminMemberSerializer, 'deserialize').returns(attributes);
      sinon.stub(adminMemberSerializer, 'serialize').withArgs(savedAdminMember).returns(serializedAdminMember);

      // when
      const { statusCode, source } = await adminMemberController.saveAdminMember(
        { payload: { data: { attributes } } },
        hFake
      );

      // then
      expect(source).to.deep.equal(serializedAdminMember);
      expect(statusCode).to.equal(201);
    });
  });
});
