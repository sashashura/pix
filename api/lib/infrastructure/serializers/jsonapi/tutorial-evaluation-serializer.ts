// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorial'.
const tutorial = require('./tutorial-attributes.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../domain/models/TutorialEvaluation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(tutorialEvaluation: $TSFixMe) {
    return new Serializer('tutorial-evaluation', {
      attributes: ['tutorial', 'userId', 'tutorialId', 'status', 'updatedAt'],
      tutorial,
    }).serialize(tutorialEvaluation);
  },

  deserialize(json: $TSFixMe) {
    return new TutorialEvaluation({
      id: json?.data.id,
      userId: json?.data.attributes['user-id'],
      tutorialId: json?.data.attributes['tutorial-id'],
      status: json?.data.attributes.status,
    });
  },
};
