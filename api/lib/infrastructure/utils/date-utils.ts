// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment-timezone');

moment.parseTwoDigitYear = function (yearString: $TSFixMe) {
  const year = parseInt(yearString);
  const currentYear = new Date().getFullYear();
  return 2000 + year < currentYear ? 2000 + year : 1900 + year;
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isValidDat... Remove this comment to see the full error message
function isValidDate(dateValue: $TSFixMe, format: $TSFixMe) {
  return moment.utc(dateValue, format, true).isValid();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'convertDat... Remove this comment to see the full error message
function convertDateValue({
  dateString,
  inputFormat,
  alternativeInputFormat = null,
  outputFormat
}: $TSFixMe) {
  if (isValidDate(dateString, inputFormat)) {
    return moment(dateString, inputFormat, true).format(outputFormat);
  } else if (alternativeInputFormat && isValidDate(dateString, alternativeInputFormat)) {
    return moment(dateString, alternativeInputFormat, true).format(outputFormat);
  }
  return null;
}

function getNowDate() {
  return new Date();
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isValidDate,
  convertDateValue,
  getNowDate,
};
