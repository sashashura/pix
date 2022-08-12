// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
  buildCertificationCenterMemberships,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/create-certification-center-memberships-from-organization-admins');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | create-certification-center-memberships-from-organization-admins.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildCertificationCenterMemberships', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should build the list of certification center memberships', function () {
      // given
      const membershipUserIds = [1, 5];
      const certificationCenterId = 100;

      const expectedCertificationCenterMemberships = [
        { certificationCenterId, userId: 1 },
        { certificationCenterId, userId: 5 },
      ];

      // when
      const result = buildCertificationCenterMemberships({ certificationCenterId, membershipUserIds });

      // then
      expect(result).to.deep.equal(expectedCertificationCenterMemberships);
    });
  });
});
