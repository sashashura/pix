// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  plugin: require('hapi-i18n'),
  options: {
    locales: ['en', 'fr'],
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    directory: __dirname + '/../../../translations',
    defaultLocale: 'fr',
    queryParameter: 'lang',
    languageHeaderField: 'Accept-Language',
    objectNotation: true,
    updateFiles: false,
  },
};
