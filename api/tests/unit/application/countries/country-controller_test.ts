const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'hFake'.
  hFake,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
  domainBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'countrySer... Remove this comment to see the full error message
const countrySerializer = require('../../../../lib/infrastructure/serializers/jsonapi/country-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'countryCon... Remove this comment to see the full error message
const countryController = require('../../../../lib/application/countries/country-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | country-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findCountries', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch and return the countries, serialized as JSONAPI', async function () {
      // given
      const countries = [
        domainBuilder.buildCountry({ code: '99345', name: 'Pologne' }),
        domainBuilder.buildCountry({ code: '99324', name: 'Espagne' }),
      ];

      const serializedCountries = [
        {
          id: '99345',
          type: 'countries',
          attributes: {
            code: '99345',
            name: 'Pologne',
          },
        },
        {
          id: '99324',
          type: 'countries',
          attributes: {
            code: '99324',
            name: 'Espagne',
          },
        },
      ];

      const userId = 42;
      sinon.stub(countrySerializer, 'serialize');
      sinon.stub(usecases, 'findCountries');

      usecases.findCountries.resolves(countries);
      countrySerializer.serialize.withArgs(countries).resolves(serializedCountries);

      const request = {
        params: { id: 'course_id' },
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        pre: { userId },
      };

      // when
      const response = await countryController.findCountries(request, hFake);

      // then
      expect(usecases.findCountries).to.have.been.called;
      expect(countrySerializer.serialize).to.have.been.called;
      expect(countrySerializer.serialize).to.have.been.calledWithExactly(countries);
      expect(response).to.deep.equal(serializedCountries);
    });
  });
});
