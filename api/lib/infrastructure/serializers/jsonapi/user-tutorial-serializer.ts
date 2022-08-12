// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorial'.
const tutorial = require('./tutorial-attributes.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorial = require('../../../domain/models/UserSavedTutorial');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(userTutorial: $TSFixMe) {
    return new Serializer('user-tutorial', {
      attributes: ['tutorial', 'userId', 'tutorialId', 'skillId', 'updatedAt'],
      tutorial,
    }).serialize(userTutorial);
  },

  deserialize(json: $TSFixMe) {
    return new UserSavedTutorial({
      id: json?.data.id,
      skillId: json?.data.attributes['skill-id'],
    });
  },
};
