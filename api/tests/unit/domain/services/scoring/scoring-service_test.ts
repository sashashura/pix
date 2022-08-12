// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('../../../../../lib/domain/services/scoring/scoring-service');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
  PIX_COUNT_BY_LEVEL,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
  MAX_REACHABLE_LEVEL,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
  MAX_REACHABLE_PIX_BY_COMPETENCE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Scoring Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#calculateScoringInformationForCompetence', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the information about pix score and level for given competence', function () {
      // given
      const knowledgeElements = [
        domainBuilder.buildKnowledgeElement({ earnedPix: 3.7 }),
        domainBuilder.buildKnowledgeElement({ earnedPix: 4.4 }),
        domainBuilder.buildKnowledgeElement({ earnedPix: 1.2 }),
      ];

      const expectedScoring = {
        realTotalPixScoreForCompetence: 9.3,
        pixScoreForCompetence: 9,
        currentLevel: 1,
        pixAheadForNextLevel: 1,
      };

      // when
      const scoring = scoringService.calculateScoringInformationForCompetence({ knowledgeElements });

      // then
      expect(scoring).to.deep.equal(expectedScoring);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the information about pix score and level for one competence blocked with max information', function () {
      // given
      const knowledgeElements = [
        domainBuilder.buildKnowledgeElement({ earnedPix: MAX_REACHABLE_PIX_BY_COMPETENCE }),
        domainBuilder.buildKnowledgeElement({ earnedPix: PIX_COUNT_BY_LEVEL }),
        domainBuilder.buildKnowledgeElement({ earnedPix: PIX_COUNT_BY_LEVEL }),
      ];

      const expectedScoring = {
        realTotalPixScoreForCompetence: 56,
        pixScoreForCompetence: MAX_REACHABLE_PIX_BY_COMPETENCE,
        currentLevel: MAX_REACHABLE_LEVEL,
        pixAheadForNextLevel: 0,
      };

      // when
      const scoring = scoringService.calculateScoringInformationForCompetence({ knowledgeElements });

      // then
      expect(scoring).to.be.deep.equal(expectedScoring);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when we allow an excess in pix or level', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the information about pix score and level for one competence blocked not blocked', function () {
        // given
        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({ earnedPix: MAX_REACHABLE_PIX_BY_COMPETENCE }),
          domainBuilder.buildKnowledgeElement({ earnedPix: PIX_COUNT_BY_LEVEL }),
          domainBuilder.buildKnowledgeElement({ earnedPix: PIX_COUNT_BY_LEVEL }),
        ];
        const allowExcessLevel = true;
        const allowExcessPix = true;
        const expectedScoring = {
          realTotalPixScoreForCompetence: 56,
          pixScoreForCompetence: 56,
          currentLevel: 7,
          pixAheadForNextLevel: 0,
        };

        // when
        const scoring = scoringService.calculateScoringInformationForCompetence({
          knowledgeElements,
          allowExcessLevel,
          allowExcessPix,
        });

        // then
        expect(scoring).to.be.deep.equal(expectedScoring);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#calculatePixScore', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the Pix score and limit the score', function () {
      const knowledgeElements = [
        domainBuilder.buildKnowledgeElement({ competenceId: 'competence1', skillId: 'skill1.1', earnedPix: 8 }),
        domainBuilder.buildKnowledgeElement({ competenceId: 'competence1', skillId: 'skill1.2', earnedPix: 35 }),
        domainBuilder.buildKnowledgeElement({ competenceId: 'competence2', skillId: 'skill2.1', earnedPix: 1 }),
      ];

      expect(scoringService.calculatePixScore(knowledgeElements)).to.be.equal(41);
    });
  });
});
