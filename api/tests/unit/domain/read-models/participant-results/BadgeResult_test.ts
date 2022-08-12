// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeResul... Remove this comment to see the full error message
const BadgeResult = require('../../../../../lib/domain/read-models/participant-results/BadgeResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../../lib/domain/models/KnowledgeElement');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | ParticipantResult | BadgeResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('computes the badges results', function () {
    const knowledgeElements = [
      domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill3', status: KnowledgeElement.StatusType.VALIDATED }),
    ];

    const participationResults = { knowledgeElements, acquiredBadgeIds: [1] };

    const badge = {
      id: 1,
      title: 'Badge Yellow',
      message: 'Yellow Message',
      altMessage: 'Yellow Alt Message',
      key: 'YELLOW',
      imageUrl: 'yellow.svg',
      badgeCompetences: [],
    };

    const badgeResult = new BadgeResult(badge, participationResults);

    expect(badgeResult).to.deep.include({
      id: 1,
      title: 'Badge Yellow',
      message: 'Yellow Message',
      altMessage: 'Yellow Alt Message',
      isAcquired: true,
      key: 'YELLOW',
      imageUrl: 'yellow.svg',
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('computes the result for each badge competence', function () {
    const knowledgeElements = [
      domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill4', status: KnowledgeElement.StatusType.VALIDATED }),
    ];

    const participationResults = { knowledgeElements, acquiredBadgeIds: [1] };

    const badgeCompetence1 = {
      id: 11,
      name: 'BadgeCompetence1',
      color: 'ColorBadgeCompetence1',
      skillIds: ['skill1', 'skill2', 'skill3'],
    };
    const badgeCompetence2 = {
      id: 12,
      name: 'BadgeCompetence2',
      color: 'ColorBadgeCompetence2',
      skillIds: ['skill4'],
    };

    const badge = {
      badgeCompetences: [badgeCompetence1, badgeCompetence2],
    };

    const badgeResult = new BadgeResult(badge, participationResults);
    const skillSetResult1 = badgeResult.skillSetResults.find(({
      id
    }: $TSFixMe) => id === 11);
    const skillSetResult2 = badgeResult.skillSetResults.find(({
      id
    }: $TSFixMe) => id === 12);
    expect(skillSetResult1).to.deep.include({ masteryPercentage: 33, name: 'BadgeCompetence1' });
    expect(skillSetResult2).to.deep.include({ masteryPercentage: 100, name: 'BadgeCompetence2' });
  });
});
