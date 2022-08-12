// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Country'.
const { Country } = require('../../../../lib/domain/read-models/Country');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
const { normalizeAndSortChars } = require('../../../../lib/infrastructure/utils/string-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCountry({ code = '99345', name = 'TOGO', matcher = normalizeAndSortChars(name) } = {}) {
  return new Country({
    code,
    name,
    matcher,
  });
};
