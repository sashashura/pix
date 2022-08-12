// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generateNumericalString(numberOfDigits: $TSFixMe) {
    return randomString.generate({
      charset: 'numeric',
      length: numberOfDigits,
      readable: true,
    });
  },
};
