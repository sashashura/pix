// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseCont... Remove this comment to see the full error message
const courseController = require('./course-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'identifier... Remove this comment to see the full error message
const identifiersType = require('../../domain/types/identifiers-type');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'GET',
      path: '/api/courses/{id}',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.courseId,
          }),
        },
        handler: courseController.get,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'courses-api';
