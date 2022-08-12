// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const featureToggleController = require('./feature-toggle-controller');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async (server: $TSFixMe) => {
  server.route([
    {
      method: 'GET',
      path: '/api/feature-toggles',
      config: {
        auth: false,
        handler: featureToggleController.getActiveFeatures,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'feature-toggles-api';
