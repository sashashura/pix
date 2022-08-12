// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('../../../../lib/domain/models/OrganizationInvitation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | OrganizationInvitation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build an OrganizationInvitation from raw JSON', function () {
      // given
      const today = new Date();

      const rawData = {
        id: 1,
        organizationId: 10,
        organizationName: 'The Organization',
        email: 'member@team.org',
        status: 'pending',
        code: 'ABCDEFGH01',
        role: null,
        createdAt: today,
        updatedAt: today,
      };

      // when
      const invitation = new OrganizationInvitation(rawData);

      // then
      expect(invitation).to.deep.equal(rawData);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not build an OrganizationInvitation if JSON is not valid', async function () {
      // given
      const today = new Date();

      const rawData = {
        id: 1,
        organizationId: 10,
        organizationName: 'The Organization',
        email: 'member@team.org',
        status: 'pending',
        code: 'ABCDEFGH01',
        role: 'SUPER-ADMIN',
        createdAt: today,
        updatedAt: today,
      };

      // when / then
      expect(() => {
        new OrganizationInvitation(rawData);
      }).not.to.throw(EntityValidationError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isPending', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if status is pending', function () {
      // given
      const invitation = new OrganizationInvitation({ status: 'pending' });

      // when
      const result = invitation.isPending;

      // /then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if status is different than pending', function () {
      // given
      const invitation = new OrganizationInvitation({ status: 'accepted' });

      // when
      const result = invitation.isPending;

      // /then
      expect(result).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isAccepted', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if status is isAccepted', function () {
      // given
      const invitation = new OrganizationInvitation({ status: 'accepted' });

      // when
      const result = invitation.isAccepted;

      // /then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if status is different than accepted', function () {
      // given
      const invitation = new OrganizationInvitation({ status: 'pending' });

      // when
      const result = invitation.isAccepted;

      // /then
      expect(result).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isCancelled', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if status is cancelled', function () {
      // given
      const invitation = new OrganizationInvitation({ status: 'cancelled' });

      // when
      const result = invitation.isCancelled;

      // /then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if status is different than cancelled', function () {
      // given
      const invitation = new OrganizationInvitation({ status: 'pending' });

      // when
      const result = invitation.isCancelled;

      // /then
      expect(result).to.be.false;
    });
  });
});
