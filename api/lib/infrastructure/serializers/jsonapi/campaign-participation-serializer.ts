// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer, Deserializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../../domain/models/Campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../../domain/models/CampaignParticipation');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignParticipation: $TSFixMe) {
    return new Serializer('campaign-participation', {
      transform: (campaignParticipation: $TSFixMe) => {
        const campaignParticipationForSerialization = new CampaignParticipation(campaignParticipation);
        if (campaignParticipation.lastAssessment) {
          campaignParticipationForSerialization.assessment = { id: campaignParticipation.lastAssessment.id };
        }
        campaignParticipationForSerialization.trainings = null;
        return campaignParticipationForSerialization;
      },

      attributes: [
        'isShared',
        'sharedAt',
        'createdAt',
        'participantExternalId',
        'campaign',
        'assessment',
        'deletedAt',
        'trainings',
      ],
      campaign: {
        ref: 'id',
        attributes: ['code', 'title', 'type'],
      },
      assessment: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: $TSFixMe) {
            return `/api/assessments/${record.assessment.id}`;
          },
        },
      },
      trainings: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/campaign-participations/${parent.id}/trainings`;
          },
        },
      },
    }).serialize(campaignParticipation);
  },

  deserialize(json: $TSFixMe) {
    return new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(json).then((campaignParticipation: $TSFixMe) => {
      let campaign;
      if (json.data?.relationships?.campaign) {
        campaign = new Campaign({ id: json.data.relationships.campaign.data.id });
      }

      return new CampaignParticipation({ ...campaignParticipation, campaign });
    });
  },
};
