// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('../monitoring-tools');

function logObjectSerializer(req: $TSFixMe) {
  const enhancedReq = {
    ...req,
    version: config.version,
  };

  if (!config.hapi.enableRequestMonitoring) return enhancedReq;
  const context = monitoringTools.getContext();

  return {
    ...enhancedReq,
    user_id: monitoringTools.extractUserIdFromRequest(req),
    metrics: context?.metrics,
    route: context?.request?.route?.path,
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  plugin: require('hapi-pino'),
  options: {
    serializers: {
      req: logObjectSerializer,
    },
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    instance: require('../logger'),
    // Remove duplicated req property: https://github.com/pinojs/hapi-pino#optionsgetchildbindings-request---key-any-
    getChildBindings: () => ({}),
    logQueryParams: true,
  },
};
