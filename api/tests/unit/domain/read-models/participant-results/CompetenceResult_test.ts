// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResult = require('../../../../../lib/domain/read-models/participant-results/CompetenceResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../../lib/domain/models/KnowledgeElement');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Read-Models | ParticipantResult | CompetenceResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('computes the result for the given competence', function () {
    const competence = {
      id: 'rec1',
      name: 'C1',
      index: '1.1',
      areaName: 'Domaine1',
      areaColor: 'Couleur1',
      skillIds: ['skill1', 'skill2', 'skill3'],
    };

    const knowledgeElements = [
      domainBuilder.buildKnowledgeElement({ status: KnowledgeElement.StatusType.VALIDATED }),
      domainBuilder.buildKnowledgeElement({ status: KnowledgeElement.StatusType.INVALIDATED }),
    ];

    const competenceResult = new CompetenceResult(competence, knowledgeElements);

    expect(competenceResult).to.deep.equal({
      id: 'rec1',
      name: 'C1',
      index: '1.1',
      areaName: 'Domaine1',
      areaColor: 'Couleur1',
      testedSkillsCount: 2,
      totalSkillsCount: 3,
      validatedSkillsCount: 1,
      masteryPercentage: 33,
    });
  });
});
