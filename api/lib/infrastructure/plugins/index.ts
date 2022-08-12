// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Inert = require('@hapi/inert');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Vision = require('@hapi/vision');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'plugins'.
const plugins = [
  Inert,
  Vision,
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('./i18n'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('./pino'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('./rate-limit'),
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  ...(config.sentry.enabled ? [require('./sentry')] : []),
];

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = plugins;
