// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const countryRepository = require('../../../../lib/infrastructure/repositories/country-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Country'.
const { Country } = require('../../../../lib/domain/read-models/Country');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | country-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAll', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there are countries', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all common named countries ordered by name', async function () {
        // given
        databaseBuilder.factory.buildCertificationCpfCountry({
          code: '99345',
          commonName: 'TOGO',
          originalName: 'TOGO',
        });

        databaseBuilder.factory.buildCertificationCpfCountry({
          code: '99345',
          commonName: 'TOGO',
          originalName: 'RÉPUBLIQUE TOGOLAISE',
        });

        databaseBuilder.factory.buildCertificationCpfCountry({
          code: '99876',
          commonName: 'NABOO',
          originalName: 'NABOO',
        });

        await databaseBuilder.commit();

        // when
        const countries = await countryRepository.findAll();

        // then
        const togoCountry = domainBuilder.buildCountry({
          code: '99345',
          name: 'TOGO',
          matcher: 'GOOT',
        });
        const nabooCountry = domainBuilder.buildCountry({
          code: '99876',
          name: 'NABOO',
          matcher: 'ABNOO',
        });
        expect(countries.length).to.equal(2);
        expect(countries[0]).to.be.instanceOf(Country);
        expect(countries).to.deep.equal([nabooCountry, togoCountry]);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there are no countries', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // given when
        const countries = await countryRepository.findAll();

        // then
        expect(countries).to.deep.equal([]);
      });
    });
  });
});
