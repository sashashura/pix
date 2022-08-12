// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfC... Remove this comment to see the full error message
const BookshelfCertificationCenter = require('../../../lib/infrastructure/orm-models/CertificationCenter');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createScoC... Remove this comment to see the full error message
const { createScoCertificationCenters } = require('../../../scripts/create-sco-certification-centers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Scripts | create-sco-certification-centers.js', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createScoCertificationCenters', function () {
    const getNumberOfCertificationCenters = () => {
      return BookshelfCertificationCenter.count().then((number: $TSFixMe) => parseInt(number, 10));
    };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should insert 2 sco certification centers', async function () {
      // given
      const certificationCenters = [
        { name: 'Collège Victor Hugo', externalId: '1234567A', type: 'SCO' },
        { name: 'Lycée Marie Curie', externalId: '0123456B', type: 'SCO' },
      ];
      const numberbefore = await getNumberOfCertificationCenters();

      // when
      await createScoCertificationCenters(certificationCenters);
      const numberAfter = await getNumberOfCertificationCenters();

      // then
      expect(numberAfter - numberbefore).to.equal(2);
    });
  });
});
