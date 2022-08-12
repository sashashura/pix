// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertification = require('../../../domain/models/ComplementaryCertification');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(habilitation: $TSFixMe) {
    return new Serializer('habilitation', {
      attributes: ['label', 'key'],
    }).serialize(habilitation);
  },

  deserialize(jsonAPI: $TSFixMe) {
    return new ComplementaryCertification({
      id: jsonAPI.data.id,
      label: jsonAPI.data.attributes.label,
      key: jsonAPI.data.attributes.key,
    });
  },
};
