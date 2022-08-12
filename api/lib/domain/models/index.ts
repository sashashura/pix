// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path');

/* eslint-disable-next-line no-sync */
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('fs')
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  .readdirSync(__dirname)
  .forEach(function (file: $TSFixMe) {
    if (file === 'index.js') return;

    // @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
    module.exports[path.basename(file, '.js')] = require(path.join(__dirname, file));
  });
