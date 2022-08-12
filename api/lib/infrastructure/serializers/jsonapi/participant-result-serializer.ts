// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(results: $TSFixMe) {
    return new Serializer('campaign-participation-results', {
      transform,
      attributes: [
        'masteryRate',
        'totalSkillsCount',
        'testedSkillsCount',
        'validatedSkillsCount',
        'isCompleted',
        'isShared',
        'participantExternalId',
        'estimatedFlashLevel',
        'campaignParticipationBadges',
        'competenceResults',
        'reachedStage',
        'stageCount',
        'canRetry',
        'canImprove',
        'isDisabled',
      ],
      campaignParticipationBadges: {
        ref: 'id',
        included: true,
        attributes: [
          'altMessage',
          'message',
          'title',
          'imageUrl',
          'key',
          'isAcquired',
          'skillSetResults',
          'partnerCompetenceResults',
          'isAlwaysVisible',
        ],
        skillSetResults: {
          ref: 'id',
          included: true,
          attributes: [
            'name',
            'index',
            'areaColor',
            'masteryPercentage',
            'totalSkillsCount',
            'testedSkillsCount',
            'validatedSkillsCount',
          ],
        },
        partnerCompetenceResults: {
          ref: 'id',
          included: true,
          attributes: [
            'name',
            'index',
            'areaColor',
            'masteryPercentage',
            'totalSkillsCount',
            'testedSkillsCount',
            'validatedSkillsCount',
          ],
        },
      },
      competenceResults: {
        ref: 'id',
        attributes: [
          'name',
          'index',
          'areaColor',
          'masteryPercentage',
          'totalSkillsCount',
          'testedSkillsCount',
          'validatedSkillsCount',
        ],
      },
      reachedStage: {
        ref: 'id',
        attributes: ['title', 'message', 'threshold', 'starCount'],
      },
      typeForAttribute(attribute: $TSFixMe) {
        return attribute === 'reachedStage' ? 'reached-stages' : attribute;
      },
    }).serialize(results);
  },
};

function transform(record: $TSFixMe) {
  return {
    ...record,
    campaignParticipationBadges: record.badgeResults.map(mapBadgeResult),
  };
}

function mapBadgeResult(badgeResult: $TSFixMe) {
  const skillSetResults = badgeResult.skillSetResults.map((skillSetResult: $TSFixMe) => {
    return { ...skillSetResult, areaColor: skillSetResult.color };
  });
  return {
    ...badgeResult,
    skillSetResults,
    partnerCompetenceResults: skillSetResults,
  };
}
