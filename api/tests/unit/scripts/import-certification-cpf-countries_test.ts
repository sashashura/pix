// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, sinon } = require('../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCount... Remove this comment to see the full error message
  buildCountries,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkTrans... Remove this comment to see the full error message
  checkTransformUnicity,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/certification/import-certification-cpf-countries');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'noop'.
const { noop } = require('lodash/noop');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | import-certification-cpf-countries.js', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    sinon.stub(console, 'error').callsFake(noop);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#buildCountries', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Allowed countries type', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return countries with type 1', function () {
        // given
        const csvData = [{ ACTUAL: '1', LIBCOG: 'PORTUGAL' }];

        // when
        const countries = buildCountries({ csvData });

        // then
        expect(countries).not.to.be.empty;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return countries with type 4', function () {
        // given
        const csvData = [{ ACTUAL: '4', LIBCOG: 'PORTUGAL' }];

        // when
        const countries = buildCountries({ csvData });

        // then
        expect(countries).not.to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Ignored countries type', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not return countries with type 2', function () {
        // given
        const csvData = [{ ACTUAL: '2' }];

        // when
        const countries = buildCountries({ csvData });

        // then
        expect(countries).to.be.empty;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not return countries with type 3', function () {
        // given
        const csvData = [{ ACTUAL: '3' }];

        // when
        const countries = buildCountries({ csvData });

        // then
        expect(countries).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When ACTUAL is 1 and COG is XXXX', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should set the code as 99100', function () {
        // given
        const csvData = [{ ACTUAL: '1', COG: 'XXXXX', LIBCOG: 'FRANCE' }];

        // when
        const countries = buildCountries({ csvData });

        // then
        expect(countries[0].code).to.equal('99100');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return countries with their alternatives', function () {
      // given
      const csvData = [
        { LIBCOG: 'PAYS-BAS', LIBENR: 'ROYAUME DES PAYS-BAS', COG: '99135', ACTUAL: '1' },
        { LIBCOG: 'ESPAGNE', LIBENR: "ROYAUME D'ESPAGNE", COG: '99134', ACTUAL: '1' },
      ];

      // when
      const countries = buildCountries({ csvData });

      // then
      expect(countries).to.deep.equal([
        {
          code: '99135',
          commonName: 'PAYS-BAS',
          originalName: 'PAYS-BAS',
          matcher: 'AABPSSY',
        },
        {
          code: '99135',
          commonName: 'PAYS-BAS',
          originalName: 'ROYAUME DES PAYS-BAS',
          matcher: 'AAABDEEMOPRSSSUYY',
        },
        {
          code: '99134',
          commonName: 'ESPAGNE',
          originalName: 'ESPAGNE',
          matcher: 'AEEGNPS',
        },
        {
          code: '99134',
          commonName: 'ESPAGNE',
          originalName: "ROYAUME D'ESPAGNE",
          matcher: 'AADEEEGMNOPRSUY',
        },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return one occurence of a country if its alternative is the same as its common', function () {
      // given
      const csvData = [{ LIBCOG: 'PAYS-BAS', LIBENR: 'PAYS-BAS', COG: '99135', ACTUAL: '1' }];

      // when
      const countries = buildCountries({ csvData });

      // then
      expect(countries).to.deep.equal([
        {
          code: '99135',
          commonName: 'PAYS-BAS',
          originalName: 'PAYS-BAS',
          matcher: 'AABPSSY',
        },
      ]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkTransformUnicity', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#when there are no conflicts', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw an error', async function () {
        const countries = [
          {
            code: '99141',
            commonName: 'REPUBLIQUE DEMOCRATIQUE ALLEMANDE',
            originalName: 'RÉPUBLIQUE DÉMOCRATIQUE ALLEMANDE',
            matcher: 'AAABCDDEEEEEEIILLLMMNOPQQRRTUUU',
          },
          {
            code: '990000',
            commonName: 'AU PAYS DE CANDY',
            originalName: 'AU PAYS DE CANDY',
            matcher: 'AAACDDENPSUYY',
          },
          {
            code: '990000',
            commonName: 'AU PAYS DE CANDY',
            originalName: 'COMME DANS TOUT LES PAYS',
            matcher: 'AACDEELMMNOOPSSSTTUY',
          },
        ];
        const error = checkTransformUnicity(countries);

        // then
        expect(error).to.be.undefined;
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        // eslint-disable-next-line no-console
        expect(console.error).not.to.have.been.called;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#when there are conflicts', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        const countries = [
          {
            code: '99140',
            commonName: 'REPUBLIQUE DEMOCRATIQUE ALLEMANDE',
            originalName: 'RÉPUBLIQUE DÉMOCRATIQUE ALLEMANDE',
            matcher: 'AAABCDDEEEEEEIILLLMMNOPQQRRTUUU',
          },
          {
            code: '99141',
            commonName: 'ALLEMAGNE',
            originalName: 'RÉPUBLIQUE DÉMOCRATIQUE ALLEMANDE',
            matcher: 'AAABCDDEEEEEEIILLLMMNOPQQRRTUUU',
          },
          {
            code: '990000',
            commonName: 'AU PAYS DE CANDY',
            originalName: 'LA LA LA COMME DANS TOUT LES PAYS',
            matcher: 'AAAAACDEELLLLMMNOOPSSSTTUY',
          },
          {
            code: '990001',
            commonName: 'AU PAYS DE CANDY',
            originalName: 'COMME DANS TOUT LES PAYS LA LA LA',
            matcher: 'AAAAACDEELLLLMMNOOPSSSTTUY',
          },
        ];
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkTransformUnicity)(countries);

        // then
        expect(error).to.be.instanceOf(Error);
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        // eslint-disable-next-line no-console
        expect(console.error.getCall(0)).to.have.been.calledWithExactly(
          'CONFLICT: 99140,99141 RÉPUBLIQUE DÉMOCRATIQUE ALLEMANDE,RÉPUBLIQUE DÉMOCRATIQUE ALLEMANDE'
        );
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        // eslint-disable-next-line no-console
        expect(console.error.getCall(1)).to.have.been.calledWithExactly(
          'CONFLICT: 990000,990001 LA LA LA COMME DANS TOUT LES PAYS,COMME DANS TOUT LES PAYS LA LA LA'
        );
      });
    });
  });
});
