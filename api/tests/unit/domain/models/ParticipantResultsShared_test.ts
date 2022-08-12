// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participan... Remove this comment to see the full error message
const ParticipantResultsShared = require('../../../../lib/domain/models/ParticipantResultsShared');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
const { MAX_REACHABLE_PIX_BY_COMPETENCE } = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ParticipantResultsShared', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#masteryRate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are targetSkills', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('computes the masteryRate using the number of skill validated', function () {
        // given
        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
          domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
        ];

        const targetedSkillIds = ['skill1', 'skill2', 'skill3'];

        // when
        const participantResultsShared = new ParticipantResultsShared({
          knowledgeElements,
          targetedSkillIds,
        });

        // then
        expect(participantResultsShared.masteryRate).to.be.equal(1 / 3);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are no targetSkills', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('computes the masteryPercentage using the pixScore and the maximal pix score', function () {
        // given
        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({
            skillId: 'skill1',
            earnedPix: 10,
            status: KnowledgeElement.StatusType.VALIDATED,
          }),
          domainBuilder.buildKnowledgeElement({
            skillId: 'skill2',
            earnedPix: 0,
            status: KnowledgeElement.StatusType.INVALIDATED,
          }),
        ];

        const targetedSkillIds: $TSFixMe = [];

        // when
        const participantResultsShared = new ParticipantResultsShared({
          knowledgeElements,
          targetedSkillIds,
        });

        // then
        expect(participantResultsShared.masteryRate).to.be.equal(10 / (16 * MAX_REACHABLE_PIX_BY_COMPETENCE));
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns the validated skills count', function () {
    // given
    const knowledgeElements = [
      domainBuilder.buildKnowledgeElement({ skillId: 'skill1', status: KnowledgeElement.StatusType.VALIDATED }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill2', status: KnowledgeElement.StatusType.INVALIDATED }),
    ];

    const targetedSkillIds = ['skill1', 'skill2', 'skill3'];

    // when
    const participantResultsShared = new ParticipantResultsShared({
      knowledgeElements,
      targetedSkillIds,
    });

    // then
    expect(participantResultsShared.validatedSkillsCount).to.be.equal(1);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns the Pix score', function () {
    // given
    const knowledgeElements = [
      domainBuilder.buildKnowledgeElement({ skillId: 'skill1.1', earnedPix: 8 }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill2.1', earnedPix: 1 }),
      domainBuilder.buildKnowledgeElement({ skillId: 'skill3.1', earnedPix: 2 }),
    ];

    const targetedSkillIds = ['skill1.1', 'skill2.1'];

    // when
    const participantResultsShared = new ParticipantResultsShared({
      knowledgeElements,
      targetedSkillIds,
    });

    // then
    expect(participantResultsShared.pixScore).to.be.equal(9);
  });
});
