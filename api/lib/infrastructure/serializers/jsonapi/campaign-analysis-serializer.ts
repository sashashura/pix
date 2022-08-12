// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialAt... Remove this comment to see the full error message
const tutorialAttributes = require('./tutorial-attributes');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(results: $TSFixMe) {
    return new Serializer('campaign-analysis', {
      attributes: ['campaignTubeRecommendations'],
      campaignTubeRecommendations: {
        ref: 'id',
        includes: true,
        attributes: [
          'tubeId',
          'competenceId',
          'competenceName',
          'tubePracticalTitle',
          'areaColor',
          'averageScore',
          'tutorials',
          'tubeDescription',
        ],
        tutorials: tutorialAttributes,
      },
    }).serialize(results);
  },
};
