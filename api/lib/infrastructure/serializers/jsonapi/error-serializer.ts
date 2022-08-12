// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JSONAPIErr... Remove this comment to see the full error message
const JSONAPIError = require('jsonapi-serializer').Error;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(infrastructureError: $TSFixMe) {
    return JSONAPIError({
      status: `${infrastructureError.status}`,
      title: infrastructureError.title,
      detail: infrastructureError.message,
      code: infrastructureError.code,
      meta: infrastructureError.meta,
    });
  },
};
