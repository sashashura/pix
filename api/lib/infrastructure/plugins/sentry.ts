// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Pack = require('../../../package');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  plugin: require('hapi-sentry'),
  options: {
    client: {
      dsn: config.sentry.dsn,
      environment: config.sentry.environment,
      release: `v${Pack.version}`,
      maxBreadcrumbs: config.sentry.maxBreadcrumbs,
      debug: config.sentry.debug,
      maxValueLength: config.sentry.maxValueLength,
    },
    scope: {
      tags: [{ name: 'source', value: 'api' }],
    },
  },
};
