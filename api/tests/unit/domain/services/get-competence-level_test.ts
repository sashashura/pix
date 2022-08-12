// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCompete... Remove this comment to see the full error message
const getCompetenceLevel = require('../../../../lib/domain/services/get-competence-level');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('../../../../lib/domain/services/scoring/scoring-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Service | Get Competence Level', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCompetenceLevel', function () {
    const userId = 'userId';
    const competenceId = 'competenceId';
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const knowledgeElements = Symbol('knowledgeElements');
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const domainTransaction = Symbol('domainTransaction');
    const level = 3;
    let competenceLevel: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      sinon.stub(knowledgeElementRepository, 'findUniqByUserIdAndCompetenceId').resolves(knowledgeElements);
      sinon.stub(scoringService, 'calculateScoringInformationForCompetence').returns({ currentLevel: level });

      // when
      competenceLevel = await getCompetenceLevel({
        knowledgeElementRepository,
        scoringService,
        userId,
        competenceId,
        domainTransaction,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve knowledgeElements for competence and user', function () {
      // then
      expect(knowledgeElementRepository.findUniqByUserIdAndCompetenceId).to.be.calledWith({
        userId,
        competenceId,
        domainTransaction,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should use scoringService to compute competence level', function () {
      // then
      expect(scoringService.calculateScoringInformationForCompetence).to.be.calledWith({ knowledgeElements });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return competence level', function () {
      // then
      expect(competenceLevel).to.equal(level);
    });
  });
});
