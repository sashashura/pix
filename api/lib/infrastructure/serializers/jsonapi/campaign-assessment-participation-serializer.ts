// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignAssessmentParticipation: $TSFixMe) {
    return new Serializer('campaign-assessment-participations', {
      id: 'campaignParticipationId',
      attributes: [
        'firstName',
        'lastName',
        'participantExternalId',
        'createdAt',
        'sharedAt',
        'isShared',
        'campaignId',
        'targetedSkillsCount',
        'validatedSkillsCount',
        'masteryRate',
        'progression',
        'badges',
        'campaignAssessmentParticipationResult',
        'campaignAnalysis',
      ],
      badges: {
        ref: 'id',
        included: true,
        attributes: ['title', 'altMessage', 'imageUrl'],
      },
      campaignAssessmentParticipationResult: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe) {
            return `/api/campaigns/${record.campaignId}/assessment-participations/${record.campaignParticipationId}/results`;
          },
        },
      },
      campaignAnalysis: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: $TSFixMe) {
            return `/api/campaign-participations/${record.campaignParticipationId}/analyses`;
          },
        },
      },
    }).serialize(campaignAssessmentParticipation);
  },
};
