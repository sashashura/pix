// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(skills: $TSFixMe) {
    return new Serializer('skill', {
      ref: 'id',
      attributes: ['level'],
    }).serialize(skills);
  },
};
