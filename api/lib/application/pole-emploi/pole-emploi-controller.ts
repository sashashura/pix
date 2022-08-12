// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getSendings(request: $TSFixMe, h: $TSFixMe) {
    const cursor = request.query.curseur;
    const filters = _extractFilters(request);
    const { sendings, link } = await usecases.getPoleEmploiSendings({ cursor, filters });
    return h.response(sendings).header('link', link).code(200);
  },
};

function _extractFilters(request: $TSFixMe) {
  const filters = {};
  if (Object.keys(request.query).includes('enErreur')) {
    (filters as $TSFixMe).isSuccessful = !request.query.enErreur;
  }
  return filters;
}
