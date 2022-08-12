// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../../../../lib/domain/models/Scorecard');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetScore... Remove this comment to see the full error message
const resetScorecard = require('../../../../lib/domain/usecases/reset-scorecard');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const { CompetenceResetError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | reset-scorecard', function () {
  let knowledgeElements: $TSFixMe;
  const locale = 'fr-fr';

  const competenceId = 123;
  const userId = 456;
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const resetScorecardResult = Symbol('reset scorecard result');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const scorecard = Symbol('Scorecard');
  const competenceEvaluationRepository = {};
  const knowledgeElementRepository = {};
  const competenceRepository = {};
  const assessmentRepository = {};
  const campaignParticipationRepository = {};
  const targetProfileRepository = {};
  const scorecardService = {};
  let getRemainingDaysBeforeResetStub: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    (competenceEvaluationRepository as $TSFixMe).existsByCompetenceIdAndUserId = sinon.stub();
    (knowledgeElementRepository as $TSFixMe).findUniqByUserIdAndCompetenceId = sinon.stub();
    (scorecardService as $TSFixMe).resetScorecard = sinon.stub();
    (scorecardService as $TSFixMe).computeScorecard = sinon.stub();
    getRemainingDaysBeforeResetStub = sinon.stub(Scorecard, 'computeRemainingDaysBeforeReset');

    knowledgeElements = [{}, {}];
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sinon.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user owns the competenceEvaluation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reset the competenceEvaluation', async function () {
      // given
      const shouldResetCompetenceEvaluation = true;

      (competenceEvaluationRepository as $TSFixMe).existsByCompetenceIdAndUserId.withArgs({ competenceId, userId }).resolves(true);

      (scorecardService as $TSFixMe).resetScorecard
    .withArgs({
    userId,
    competenceId,
    shouldResetCompetenceEvaluation,
    knowledgeElementRepository,
    competenceEvaluationRepository,
    assessmentRepository,
    campaignParticipationRepository,
})
    .resolves(resetScorecardResult);

      (scorecardService as $TSFixMe).computeScorecard
    .withArgs({
    userId,
    competenceId,
    competenceRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    locale,
})
    .resolves(scorecard);

      (knowledgeElementRepository as $TSFixMe).findUniqByUserIdAndCompetenceId
    .withArgs({ userId, competenceId })
    .resolves(knowledgeElements);

      getRemainingDaysBeforeResetStub.withArgs(knowledgeElements).returns(0);

      // when
      const response = await resetScorecard({
        userId,
        competenceId,
        scorecardService,
        assessmentRepository,
        campaignParticipationRepository,
        competenceRepository,
        competenceEvaluationRepository,
        knowledgeElementRepository,
        targetProfileRepository,
        locale,
      });

      // then
expect((scorecardService as $TSFixMe).resetScorecard).to.have.been.calledWithExactly({
    userId,
    competenceId,
    shouldResetCompetenceEvaluation,
    assessmentRepository,
    campaignParticipationRepository,
    competenceRepository,
    knowledgeElementRepository,
    competenceEvaluationRepository,
    targetProfileRepository,
});
      expect(response).to.equal(scorecard);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is no competenceEvaluation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reset knowledge elements', async function () {
      // given
      const shouldResetCompetenceEvaluation = false;

      (knowledgeElementRepository as $TSFixMe).findUniqByUserIdAndCompetenceId
    .withArgs({ userId, competenceId })
    .resolves(knowledgeElements);

      (scorecardService as $TSFixMe).resetScorecard
    .withArgs({
    userId,
    competenceId,
    shouldResetCompetenceEvaluation,
    knowledgeElementRepository,
    competenceEvaluationRepository,
})
    .resolves(resetScorecardResult);

      (scorecardService as $TSFixMe).computeScorecard
    .withArgs({
    userId,
    competenceId,
    competenceRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    locale,
})
    .resolves(scorecard);

      (competenceEvaluationRepository as $TSFixMe).existsByCompetenceIdAndUserId.withArgs({ competenceId, userId }).resolves(false);

      // when
      const response = await resetScorecard({
        userId,
        competenceId,
        scorecardService,
        competenceRepository,
        competenceEvaluationRepository,
        knowledgeElementRepository,
        locale,
      });

      // then
sinon.assert.called((scorecardService as $TSFixMe).resetScorecard);
      expect(response).to.equal(scorecard);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the remainingDaysBeforeReset is over 0', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a CompetenceResetError error', async function () {
      // given
(knowledgeElementRepository as $TSFixMe).findUniqByUserIdAndCompetenceId
    .withArgs({ userId, competenceId })
    .resolves(knowledgeElements);

      getRemainingDaysBeforeResetStub.withArgs(knowledgeElements).returns(4);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const requestErr = await catchErr(resetScorecard)({
        userId,
        competenceId,
        scorecardService,
        competenceRepository,
        competenceEvaluationRepository,
        knowledgeElementRepository,
        locale,
      });

      // then
      expect(requestErr).to.be.instanceOf(CompetenceResetError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is no knowledge elements', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should do nothing', async function () {
      // given
(knowledgeElementRepository as $TSFixMe).findUniqByUserIdAndCompetenceId.withArgs({ userId, competenceId }).resolves([]);

      (scorecardService as $TSFixMe).resetScorecard.resolves();

      // when
      const response = await resetScorecard({
        userId,
        competenceId,
        scorecardService,
        competenceRepository,
        competenceEvaluationRepository,
        knowledgeElementRepository,
        locale,
      });

      // then
      expect(response).to.equal(null);
      sinon.assert.notCalled((scorecardService as $TSFixMe).resetScorecard);
    });
  });
});
