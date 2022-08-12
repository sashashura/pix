// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseSeri... Remove this comment to see the full error message
const courseSerializer = require('../../infrastructure/serializers/jsonapi/course-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseServ... Remove this comment to see the full error message
const courseService = require('../../../lib/domain/services/course-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
const { extractUserIdFromRequest } = require('../../infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get(request: $TSFixMe) {
    const courseId = request.params.id;
    const userId = extractUserIdFromRequest(request);

    return courseService.getCourse({ courseId, userId }).then(courseSerializer.serialize);
  },
};
