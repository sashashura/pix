// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareDat... Remove this comment to see the full error message
const { prepareDataForInsert } = require('../../../scripts/create-sco-certification-centers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | create-sco-certification-centers.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#prepareDataForInsert', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should trim name and add SCO type', function () {
      // given
      const certificationCenters = [
        { name: '  Collège Victor Hugo   ', uai: '1234567a' },
        { name: '  Lycée Marie Curie     ', uai: '0123456b' },
      ];
      const expectedResult = [
        { name: 'Collège Victor Hugo', externalId: '1234567a', type: 'SCO' },
        { name: 'Lycée Marie Curie', externalId: '0123456b', type: 'SCO' },
      ];

      // when
      const result = prepareDataForInsert(certificationCenters);

      // then
      expect(result).to.deep.equal(expectedResult);
    });
  });
});
