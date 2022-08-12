// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignAssessmentParticipationResult: $TSFixMe) {
    return new Serializer('campaign-assessment-participation-results', {
      id: 'campaignParticipationId',
      attributes: ['campaignId', 'competenceResults'],
      typeForAttribute: (attribute: $TSFixMe) => {
        if (attribute === 'competenceResults') return 'campaign-assessment-participation-competence-results';
      },
      competenceResults: {
        ref: 'id',
        attributes: ['name', 'index', 'areaColor', 'competenceMasteryRate'],
      },
    }).serialize(campaignAssessmentParticipationResult);
  },
};
