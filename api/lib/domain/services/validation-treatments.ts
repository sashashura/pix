// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
function normalizeAndRemoveAccents(string: $TSFixMe) {
  // Remove uppercase/spaces/accents/diacritics, see http://stackoverflow.com/a/37511463/827989
  return string
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s/g, '');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'removeSpec... Remove this comment to see the full error message
function removeSpecialCharacters(string: $TSFixMe) {
  return string
    .toString()
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .replace('/ {2,}/', ' ')
    .replace(/\s\s+/g, ' ');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'applyPreTr... Remove this comment to see the full error message
function applyPreTreatments(string: $TSFixMe) {
  return string.replace(/\u00A0/g, ' ');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'applyTreat... Remove this comment to see the full error message
function applyTreatments(string: $TSFixMe, enabledTreatments: $TSFixMe) {
  let result = string.toString();
  if (_.isEmpty(enabledTreatments)) {
    return result;
  }
  if (enabledTreatments.includes('t1')) {
    result = normalizeAndRemoveAccents(result);
  }
  if (enabledTreatments.includes('t2')) {
    result = removeSpecialCharacters(result);
  }
  return result;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  normalizeAndRemoveAccents,
  removeSpecialCharacters,
  applyPreTreatments,
  applyTreatments,
};
