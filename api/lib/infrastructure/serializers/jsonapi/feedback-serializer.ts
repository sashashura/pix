// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Feedback'.
const Feedback = require('../../orm-models/Feedback');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(feedbacks: $TSFixMe) {
    return new Serializer('feedbacks', {
      attributes: ['createdAt', 'content', 'assessment', 'challenge'],
      assessment: { ref: 'id' },
      challenge: { ref: 'id' },
      transform(json: $TSFixMe) {
        const feedback = Object.assign({}, json);
        feedback.assessment = { id: json.assessmentId };
        feedback.challenge = { id: json.challengeId };
        return feedback;
      },
    }).serialize(feedbacks);
  },

  deserialize(json: $TSFixMe, userAgent: $TSFixMe) {
    return new Deserializer()
      .deserialize(json, function (err: $TSFixMe, feedback: $TSFixMe) {
        feedback.assessmentId = json.data.relationships.assessment.data.id;
        feedback.challengeId = json.data.relationships.challenge.data.id;
        feedback.userAgent = userAgent;
      })
      .then((deserializedFeedback: $TSFixMe) => {
        return new Feedback(deserializedFeedback);
      });
  },
};
