// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readFile'.
const { readFile } = require('fs/promises');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { createHash } = require('crypto');

function _hash(buffer: $TSFixMe) {
  const h = createHash('sha1');
  h.update(buffer);
  h.end();
  return h.digest('hex');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isSameBina... Remove this comment to see the full error message
async function isSameBinary(referencePath: $TSFixMe, buffer: $TSFixMe) {
  const actualHash = _hash(buffer);

  const expectedBuffer = await readFile(referencePath);
  const expectedHash = _hash(expectedBuffer);

  return expectedHash == actualHash;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  isSameBinary,
};
