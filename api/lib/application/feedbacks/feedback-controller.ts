// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
const { BadRequestError } = require('../http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('../../infrastructure/utils/lodash-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../infrastructure/serializers/jsonapi/feedback-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(request: $TSFixMe, h: $TSFixMe) {
    const newFeedback = await serializer.deserialize(request.payload, request.headers['user-agent']);

    if (_.isBlank(newFeedback.get('content'))) {
      throw new BadRequestError('Feedback content must not be blank');
    }

    const persistedFeedback = await newFeedback.save();

    return h.response(serializer.serialize(persistedFeedback.toJSON())).created();
  },
};
