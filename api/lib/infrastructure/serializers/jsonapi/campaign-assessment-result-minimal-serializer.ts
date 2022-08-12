// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize({
    participations,
    pagination
  }: $TSFixMe) {
    return new Serializer('campaign-assessment-result-minimals', {
      id: 'campaignParticipationId',
      attributes: ['firstName', 'lastName', 'participantExternalId', 'masteryRate', 'badges'],
      badges: {
        ref: 'id',
        included: true,
        attributes: ['title', 'altMessage', 'imageUrl'],
      },
      meta: pagination,
    }).serialize(participations);
  },
};
