// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(scorecard = {}) {
    return new Serializer('scorecard', {
      attributes: [
        'name',
        'description',
        'index',
        'competenceId',
        'area',
        'earnedPix',
        'level',
        'pixScoreAheadOfNextLevel',
        'status',
        'remainingDaysBeforeReset',
        'remainingDaysBeforeImproving',
        'tutorials',
      ],

      area: {
        ref: ['id'],
        attributes: ['code', 'title', 'color'],
      },
      tutorials: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related(record: $TSFixMe, current: $TSFixMe, parent: $TSFixMe) {
            return `/api/scorecards/${parent.id}/tutorials`;
          },
        },
        attributes: [
          'id',
          'duration',
          'format',
          'link',
          'source',
          'title',
          'tubeName',
          'tubePracticalTitle',
          'tubePracticalDescription',
        ],
      },
    }).serialize(scorecard);
  },
};
