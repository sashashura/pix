// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Deserializ... Remove this comment to see the full error message
const { Deserializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'deserializ... Remove this comment to see the full error message
const deserializer = new Deserializer({
  keyForAttribute: 'camelCase',
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = deserializer;
