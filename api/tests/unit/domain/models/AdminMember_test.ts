// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../../lib/domain/constants').PIX_ADMIN;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
const { ObjectValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AdminMembe... Remove this comment to see the full error message
const AdminMember = require('../../../../lib/domain/models/AdminMember');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | AdminMember', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the given role is correct', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should successfully instantiate object for SUPER_ADMIN role', function () {
        // when
        expect(
          () =>
            new AdminMember({
              id: 1,
              role: ROLES.SUPER_ADMIN,
            })
        ).not.to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should successfully instantiate object for SUPPORT role', function () {
        // when
        expect(
          () =>
            new AdminMember({
              id: 1,
              role: ROLES.SUPPORT,
            })
        ).not.to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should successfully instantiate object for METIER role', function () {
        // when
        expect(
          () =>
            new AdminMember({
              id: 1,
              role: ROLES.METIER,
            })
        ).not.to.throw(ObjectValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should successfully instantiate object for CERTIF role', function () {
        // when
        expect(
          () =>
            new AdminMember({
              id: 1,
              role: ROLES.CERTIF,
            })
        ).not.to.throw(ObjectValidationError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the given role is undefined or null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError', function () {
        // when
        expect(
          () =>
            new AdminMember({
              id: 1,
              role: undefined,
            })
        ).to.throw(ObjectValidationError);

        expect(
          () =>
            new AdminMember({
              id: 1,
              role: null,
            })
        ).to.throw(ObjectValidationError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the given role is not a valid role', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an ObjectValidationError', function () {
        // when
        expect(
          () =>
            new AdminMember({
              id: 1,
              role: 'SUPER ROLE DE LA MORT QUI TUE',
            })
        ).to.throw(ObjectValidationError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasAccessToAdminScope', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if user has a non-disabled allowed role', function () {
      // given
      const adminMemberRawDetails = {
        id: 1,
        userId: 2,
        firstName: 'Son',
        lastName: 'Goku',
        email: 'email@example.net',
        role: ROLES.CERTIF,
      };
      const adminMember = new AdminMember(adminMemberRawDetails);

      // when
      const hasAccess = adminMember.hasAccessToAdminScope;

      // then
      expect(hasAccess).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user has a disabled allowed role', function () {
      // given
      const adminMemberRawDetails = {
        id: 1,
        userId: 2,
        firstName: 'Son',
        lastName: 'Goku',
        email: 'email@example.net',
        role: ROLES.CERTIF,
        disabledAt: new Date(2022, 4, 11),
      };
      const adminMember = new AdminMember(adminMemberRawDetails);

      // when
      const hasAccess = adminMember.hasAccessToAdminScope;

      // then
      expect(hasAccess).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isSuperAdmin', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if user has Super Admin role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.SUPER_ADMIN });

      // when / then
      expect(adminMember.isSuperAdmin).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user has Super Admin role but is disabled', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.SUPER_ADMIN, disabledAt: new Date() });

      // when / then
      expect(adminMember.isSuperAdmin).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user does not have Super Admin role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.CERTIF });

      // when / then
      expect(adminMember.isSuperAdmin).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isCertif', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if user has Certif role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.CERTIF });

      // when / then
      expect(adminMember.isCertif).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user has certif role but is disabled', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.CERTIF, disabledAt: new Date() });

      // when / then
      expect(adminMember.isCertif).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user does not have Certif role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.METIER });

      // when / then
      expect(adminMember.isCertif).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isMetier', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if user has Metier role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.METIER });

      // when / then
      expect(adminMember.isMetier).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user has metier role but is disabled', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.METIER, disabledAt: new Date() });

      // when / then
      expect(adminMember.isMetier).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user does not have Metier role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.SUPER_ADMIN });

      // when / then
      expect(adminMember.isMetier).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isSupport', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if user has Support role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.SUPPORT });

      // when / then
      expect(adminMember.isSupport).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user has support role but is disabled', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.SUPPORT, disabledAt: new Date() });

      // when / then
      expect(adminMember.isSupport).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if user does not have Support role', function () {
      // given
      const adminMember = new AdminMember({ id: 7, role: ROLES.METIER });

      // when / then
      expect(adminMember.isSupport).to.be.false;
    });
  });
});
