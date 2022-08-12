// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = require('i18n');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
function getI18n() {
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const directory = path.resolve(path.join(__dirname, '../../../translations'));
  i18n.configure({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    directory,
    objectNotation: true,
    updateFiles: false,
  });
  return i18n;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { getI18n };
