const camelCase = require('camelcase');

function changeCase(request) {
  const payload = map(request.payload);
  const params = map(request.params);
  return { payload, params };
}

function map(value) {
  if (value === null || typeof value != 'object') {
    return value;
  }

  const objectWithCamelCase = {};
  Object.entries(value).forEach(([key, value]) => {
    objectWithCamelCase[camelCase(key)] = map(value);
  });

  return objectWithCamelCase;
}

module.exports = { changeCase };
