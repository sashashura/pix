// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'feedbackCo... Remove this comment to see the full error message
const feedbackController = require('./feedback-controller');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async (server: $TSFixMe) => {
  server.route([
    {
      method: 'POST',
      path: '/api/feedbacks',
      config: {
        auth: false,
        handler: feedbackController.save,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'feedbacks-api';
