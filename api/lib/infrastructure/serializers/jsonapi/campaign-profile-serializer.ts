// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignProfile: $TSFixMe) {
    return new Serializer('campaign-profiles', {
      id: 'campaignParticipationId',
      attributes: [
        'firstName',
        'lastName',
        'externalId',
        'createdAt',
        'sharedAt',
        'isShared',
        'campaignId',
        'pixScore',
        'competencesCount',
        'certifiableCompetencesCount',
        'isCertifiable',
        'competences',
      ],
      typeForAttribute: (attribute: $TSFixMe) => {
        if (attribute === 'competences') return 'campaign-profile-competences';
      },
      competences: {
        ref: 'id',
        attributes: ['name', 'index', 'pixScore', 'estimatedLevel', 'areaColor'],
      },
    }).serialize(campaignProfile);
  },
};
