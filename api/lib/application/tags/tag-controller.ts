// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tagSeriali... Remove this comment to see the full error message
const tagSerializer = require('../../infrastructure/serializers/jsonapi/tag-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(request: $TSFixMe, h: $TSFixMe) {
    const tagName = request.payload.data.attributes['name'].toUpperCase();
    const createdTag = await usecases.createTag({ tagName });
    return h.response(tagSerializer.serialize(createdTag)).created();
  },

  async findAllTags() {
    const organizationsTags = await usecases.findAllTags();
    return tagSerializer.serialize(organizationsTags);
  },
};
