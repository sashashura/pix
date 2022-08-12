// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { extractParameters };

// query example : 'filter[organizationId]=4&page[size]=30$page[number]=3&sort=-createdAt,name&include=user'
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractPar... Remove this comment to see the full error message
function extractParameters(query: $TSFixMe) {
  return {
    filter: _extractFilter(query),
    page: _extractPage(query),
    sort: _extractArrayParameter(query, 'sort'),
    include: _extractArrayParameter(query, 'include'),
  };
}

function _extractFilter(query: $TSFixMe) {
  const regex = /filter\[([a-zA-Z]*)\]/;
  return _extractObjectParameter(query, regex);
}

function _extractPage(query: $TSFixMe) {
  const regex = /page\[([a-zA-Z]*)\]/;
  const params = _extractObjectParameter(query, regex);

  return _convertObjectValueToInt(params);
}

function _extractObjectParameter(query: $TSFixMe, regex: $TSFixMe) {
  return _.reduce(
    query,
    (result: $TSFixMe, queryFilterValue: $TSFixMe, queryFilterKey: $TSFixMe) => {
      const parameter = queryFilterKey.match(regex);
      if (parameter && parameter[1]) {
        result[parameter[1]] = queryFilterValue;
      }
      return result;
    },
    {}
  );
}

function _extractArrayParameter(query: $TSFixMe, parameterName: $TSFixMe) {
  return _.has(query, parameterName) ? query[parameterName].split(',') : [];
}

function _convertObjectValueToInt(params: $TSFixMe) {
  return _.mapValues(params, _.toInteger);
}
