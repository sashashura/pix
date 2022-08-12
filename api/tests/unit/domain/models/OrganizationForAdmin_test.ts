// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationForAdmin = require('../../../../lib/domain/models/OrganizationForAdmin');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | OrganizationForAdmin', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#archivistFullName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the full name of user who archived the organization', function () {
      // given
      const organization = new OrganizationForAdmin({ archivistFirstName: 'Sarah', archivistLastName: 'Visseuse' });

      // when / then
      expect(organization.archivistFullName).equal('Sarah Visseuse');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if organization is not archived', function () {
      // given
      const organization = new OrganizationForAdmin({ archivistFirstName: null, archivistLastName: null });

      // when / then
      expect(organization.archivistFullName).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#creatorFullName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the full name of user who create the organization', function () {
      // given
      const organization = new OrganizationForAdmin({ creatorFirstName: 'Sarah', creatorLastName: 'Croche' });

      // when / then
      expect(organization.creatorFullName).equal('Sarah Croche');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if organization has no creator', function () {
      // given
      const organization = new OrganizationForAdmin({ creatorFirstName: null, creatorLastName: null });

      // when / then
      expect(organization.creatorFullName).to.be.null;
    });
  });
});
