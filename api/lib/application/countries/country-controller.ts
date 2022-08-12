// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'countrySer... Remove this comment to see the full error message
const countrySerializer = require('../../infrastructure/serializers/jsonapi/country-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findCountries() {
    const countries = await usecases.findCountries();
    return countrySerializer.serialize(countries);
  },
};
