// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignManagement: $TSFixMe, meta: $TSFixMe) {
    return new Serializer('campaign', {
      attributes: [
        'name',
        'code',
        'type',
        'createdAt',
        'archivedAt',
        'creatorId',
        'creatorLastName',
        'creatorFirstName',
        'ownerId',
        'ownerLastName',
        'ownerFirstName',
      ],
      meta,
    }).serialize(campaignManagement);
  },
};
