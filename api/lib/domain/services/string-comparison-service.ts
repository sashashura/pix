// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'levenshtei... Remove this comment to see the full error message
const levenshtein = require('fast-levenshtein');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getLevensh... Remove this comment to see the full error message
function getLevenshteinRatio(inputString: $TSFixMe, reference: $TSFixMe) {
  return levenshtein.get(inputString, reference) / inputString.length;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areTwoStri... Remove this comment to see the full error message
function areTwoStringsCloseEnough(inputString: $TSFixMe, reference: $TSFixMe, MAX_ACCEPTABLE_RATIO: $TSFixMe) {
  return getLevenshteinRatio(inputString, reference) <= MAX_ACCEPTABLE_RATIO;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isOneStrin... Remove this comment to see the full error message
function isOneStringCloseEnoughFromMultipleStrings(inputString: $TSFixMe, references: $TSFixMe, MAX_ACCEPTABLE_RATIO: $TSFixMe) {
  return getSmallestLevenshteinRatio(inputString, references) <= MAX_ACCEPTABLE_RATIO;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSmalles... Remove this comment to see the full error message
function getSmallestLevenshteinRatio(inputString: $TSFixMe, references: $TSFixMe) {
  return getSmallestLevenshteinDistance(inputString, references) / inputString.length;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSmalles... Remove this comment to see the full error message
function getSmallestLevenshteinDistance(comparative: $TSFixMe, alternatives: $TSFixMe) {
  const getLevenshteinDistance = (alternative: $TSFixMe) => levenshtein.get(comparative, alternative);
  return _(alternatives).map(getLevenshteinDistance).min();
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  areTwoStringsCloseEnough,
  isOneStringCloseEnoughFromMultipleStrings,
  getSmallestLevenshteinDistance,
  getSmallestLevenshteinRatio,
  getLevenshteinRatio,
};
