// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const JSZip = require('jszip');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'loadOdsZip... Remove this comment to see the full error message
async function loadOdsZip(odsFilePath: $TSFixMe) {
  const odsFileData = await _openOdsFile(odsFilePath);
  const zip = JSZip();
  return zip.loadAsync(odsFileData);
}

function _openOdsFile(odsFilePath: $TSFixMe) {
  return fs.readFile(odsFilePath);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  loadOdsZip,
};
