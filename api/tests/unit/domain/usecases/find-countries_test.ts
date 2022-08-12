// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findCountries = require('../../../../lib/domain/usecases/find-countries');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-country', function () {
  let countryRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    countryRepository = {
      findAll: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should find the countries', async function () {
    // given
    const countries = [
      domainBuilder.buildCountry({
        code: '1234',
        name: 'TOGO',
      }),
      domainBuilder.buildCountry({
        code: '5678',
        name: 'NABOO',
      }),
    ];
    countryRepository.findAll.resolves(countries);

    // when
    const result = await findCountries({
      countryRepository,
    });

    // then
    expect(result).to.deep.equal(countries);
  });
});
