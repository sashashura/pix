// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getArrayOf... Remove this comment to see the full error message
function getArrayOfStrings(commaSeparatedStrings: $TSFixMe) {
  if (!commaSeparatedStrings) return [];
  return _(commaSeparatedStrings).split(',').map(_.trim).map(_.toUpper).value();
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNumeric'... Remove this comment to see the full error message
function isNumeric(string: $TSFixMe) {
  if (typeof string != 'string') {
    return false;
  }
  const stringWithoutComma = string.replace(',', '.').trim();
  const stringWithoutCommaAndSpace = stringWithoutComma.replace(' ', '');
  // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
  return !isNaN(stringWithoutCommaAndSpace) && !isNaN(parseFloat(stringWithoutCommaAndSpace));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cleanStrin... Remove this comment to see the full error message
function cleanStringAndParseFloat(string: $TSFixMe) {
  const stringWithoutSpace = string.replace(' ', '');
  return parseFloat(stringWithoutSpace.replace(',', '.'));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'splitIntoW... Remove this comment to see the full error message
function splitIntoWordsAndRemoveBackspaces(string: $TSFixMe) {
  return _.chain(string).split('\n').reject(_.isEmpty).value();
}

/**
 * Normalize and uppercase a string, remove non canonical characters, zero-width characters and sort the remaining characters alphabetically
 * @param {string} str
 * @returns {string}
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
function normalizeAndSortChars(str: $TSFixMe) {
  const normalizedName = normalize(str);
  return [...normalizedName].sort().join('');
}

/**
 * Normalize and uppercase a string, remove non canonical characters and zero-width characters
 * @param {string} str
 * @returns {string}
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalize'... Remove this comment to see the full error message
function normalize(str: $TSFixMe) {
  const strCanonical = _removeNonCanonicalChars(str);
  const strUpper = strCanonical.toUpperCase();
  return [...strUpper].filter((char) => Boolean(char.match(/[0-9A-Z]/))).join('');
}

function _removeNonCanonicalChars(str: $TSFixMe) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toArrayOfF... Remove this comment to see the full error message
function toArrayOfFixedLengthStringsConservingWords(str: $TSFixMe, maxLength: $TSFixMe) {
  const result: $TSFixMe = [];
  const words = str.split(' ');
  let index = 0;
  words.forEach((word: $TSFixMe) => {
    if (!result[index]) {
      result[index] = '';
    }
    if (result[index].length + word.length <= maxLength) {
      result[index] += `${word} `;
    } else {
      index++;
      result[index] = `${word} `;
    }
  });
  // @ts-expect-error TS(7006): Parameter 'str' implicitly has an 'any' type.
  return result.map((str) => str.trim());
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isNumeric,
  splitIntoWordsAndRemoveBackspaces,
  cleanStringAndParseFloat,
  getArrayOfStrings,
  normalizeAndSortChars,
  normalize,
  toArrayOfFixedLengthStringsConservingWords,
};
