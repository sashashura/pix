// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

function generateLink(sending: $TSFixMe, filters = {}) {
  const host = settings.apiManager.url;
  const { dateEnvoi, idEnvoi } = sending;
  const cursor = generateCursor({ idEnvoi, dateEnvoi });
  let link = `${host}/pole-emploi/envois?curseur=${cursor}`;
  if (Object.keys(filters).includes('isSuccessful')) {
    link += `&enErreur=${!(filters as $TSFixMe).isSuccessful}`;
  }
  return link;
}

function generateCursor(data: $TSFixMe) {
  const string = JSON.stringify(data);
  const buffer = new Buffer.from(string);
  return buffer.toString('base64');
}

function decodeCursor(strbase64: $TSFixMe) {
  if (!strbase64) return null;

  const buffer = new Buffer.from(strbase64, 'base64');
  const string = buffer.toString('ascii');
  return JSON.parse(string);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { generateLink, generateCursor, decodeCursor };
