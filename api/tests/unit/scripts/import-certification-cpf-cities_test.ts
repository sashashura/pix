// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCitie... Remove this comment to see the full error message
const { buildCities } = require('../../../scripts/certification/import-certification-cpf-cities');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'noop'.
const { noop } = require('lodash/noop');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | import-certification-cpf-cities.js', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    sinon.stub(console, 'error').callsFake(noop);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildCities', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#when there are n alternate names', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return n+1 lines for the city', function () {
        const csvData = [
          {
            code_commune_insee: '30288',
            nom_de_la_commune: 'ST NAZAIRE',
            code_postal: '30200',
            ligne_5: null,
          },
          {
            code_commune_insee: '44184',
            nom_de_la_commune: 'ST NAZAIRE',
            code_postal: '44600',
            ligne_5: 'ST MARC SUR MER',
          },
          {
            code_commune_insee: '66186',
            nom_de_la_commune: 'ST NAZAIRE',
            code_postal: '66570',
            ligne_5: null,
          },
          {
            code_commune_insee: '44184',
            nom_de_la_commune: 'ST NAZAIRE',
            code_postal: '44600',
            ligne_5: null,
          },
        ];

        // when
        const cities = buildCities({ csvData });

        // then
        expect(cities).to.deep.equal([
          {
            INSEECode: '30288',
            isActualName: true,
            name: 'ST NAZAIRE',
            postalCode: '30200',
          },
          {
            INSEECode: '44184',
            isActualName: true,
            name: 'ST NAZAIRE',
            postalCode: '44600',
          },
          {
            INSEECode: '44184',
            isActualName: false,
            name: 'ST MARC SUR MER',
            postalCode: '44600',
          },
          {
            INSEECode: '66186',
            isActualName: true,
            name: 'ST NAZAIRE',
            postalCode: '66570',
          },
        ]);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#when there are no alternate names', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 1 line', function () {
        // given
        const csvData = [
          {
            code_commune_insee: '00001',
            nom_de_la_commune: 'GOTHAM CITY',
            code_postal: '09966',
          },
        ];

        // when
        const cities = buildCities({ csvData });

        // then
        expect(cities).to.deep.equal([
          {
            INSEECode: '00001',
            name: 'GOTHAM CITY',
            postalCode: '09966',
            isActualName: true,
          },
        ]);
      });
    });
  });
});
