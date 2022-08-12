// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationOfficer = require('../../../../lib/domain/models/CertificationOfficer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationOfficer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getFullName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return certification officer full name', function () {
      // when
      const certificationOfficer = new CertificationOfficer({ id: 1234, firstName: 'Chuck', lastName: 'Norris' });

      // then
      expect(certificationOfficer.getFullName()).to.equal('Chuck Norris');
    });
  });
});
