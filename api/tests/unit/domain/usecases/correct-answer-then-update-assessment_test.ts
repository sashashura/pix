// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const correctAnswerThenUpdateAssessment = require('../../../../lib/domain/usecases/correct-answer-then-update-assessment');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
  ChallengeNotAskedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
  ForbiddenAccess,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationEndedBySupervisorError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationEndedByFinalizationError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dateUtils'... Remove this comment to see the full error message
const dateUtils = require('../../../../lib/infrastructure/utils/date-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | correct-answer-then-update-assessment', function () {
  const userId = 1;
  let assessment: $TSFixMe;
  let challenge;
  let solution;
  let validator: $TSFixMe;
  let correctAnswerValue: $TSFixMe;
  let answer: $TSFixMe;
  const addOneLevel = {
    level: 1,
    pix: 8,
  };
  const answerRepository = {
    saveWithKnowledgeElements: () => undefined,
  };
  const assessmentRepository = { get: () => undefined };
  const challengeRepository = { get: () => undefined };
  const competenceEvaluationRepository = {};
  const targetProfileRepository = { getByCampaignParticipationId: () => undefined };
  const skillRepository = { findActiveByCompetenceId: () => undefined };
  const flashAssessmentResultRepository = { save: () => undefined };
  const scorecardService = { computeScorecard: () => undefined };
  const knowledgeElementRepository = {
    findUniqByUserIdAndAssessmentId: () => undefined,
  };
  const flashAlgorithmService = { getEstimatedLevelAndErrorRate: () => undefined };
  const algorithmDataFetcherService = { fetchForFlashLevelEstimation: () => undefined };
  const nowDate = new Date('2021-03-11T11:00:04Z');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  nowDate.setMilliseconds(1);

  let dependencies: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(answerRepository, 'saveWithKnowledgeElements');
    sinon.stub(assessmentRepository, 'get');
    sinon.stub(challengeRepository, 'get');
    sinon.stub(skillRepository, 'findActiveByCompetenceId');
    sinon.stub(targetProfileRepository, 'getByCampaignParticipationId');
    sinon.stub(flashAssessmentResultRepository, 'save');
    sinon.stub(scorecardService, 'computeScorecard');
    sinon.stub(knowledgeElementRepository, 'findUniqByUserIdAndAssessmentId');
    sinon.stub(KnowledgeElement, 'createKnowledgeElementsForAnswer');
    sinon.stub(dateUtils, 'getNowDate');
    sinon.stub(flashAlgorithmService, 'getEstimatedLevelAndErrorRate');
    sinon.stub(algorithmDataFetcherService, 'fetchForFlashLevelEstimation');

    const challengeId = 'oneChallengeId';
    assessment = domainBuilder.buildAssessment({ userId, lastQuestionDate: nowDate });
    answer = domainBuilder.buildAnswer({ assessmentId: assessment.id, value: correctAnswerValue, challengeId });
    answer.id = undefined;
    answer.result = undefined;
    answer.resultDetails = undefined;
    correctAnswerValue = '1';
    solution = domainBuilder.buildSolution({ id: answer.challengeId, value: correctAnswerValue });
    validator = domainBuilder.buildValidator.ofTypeQCU({ solution });
    challenge = domainBuilder.buildChallenge({ id: answer.challengeId, validator });
    (challengeRepository.get as $TSFixMe).resolves(challenge);

    dateUtils.getNowDate.returns(nowDate);

    dependencies = {
      answerRepository,
      assessmentRepository,
      challengeRepository,
      competenceEvaluationRepository,
      skillRepository,
      targetProfileRepository,
      knowledgeElementRepository,
      flashAssessmentResultRepository,
      scorecardService,
      flashAlgorithmService,
      algorithmDataFetcherService,
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when an answer for that challenge is not for an asked challenge', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      assessment.type = Assessment.types.CERTIFICATION;
      assessment.lastChallengeId = 'anotherChallenge';
      (assessmentRepository.get as $TSFixMe).resolves(assessment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fail because Challenge Not Asked', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(correctAnswerThenUpdateAssessment)({
        answer,
        userId,
        ...dependencies,
      });

      // then
      return expect(error).to.be.an.instanceOf(ChallengeNotAskedError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the assessment has been ended by supervisor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a CertificationEndedBySupervisorError error', async function () {
      // given
      assessment.state = Assessment.states.ENDED_BY_SUPERVISOR;
      (assessmentRepository.get as $TSFixMe).resolves(assessment);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(correctAnswerThenUpdateAssessment)({
        answer,
        userId,
        ...dependencies,
      });

      // then
      return expect(error).to.be.an.instanceOf(CertificationEndedBySupervisorError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the assessment has been ended because session was finalized', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a CertificationEndedByFinalizationError error', async function () {
      // given
      const assessment = domainBuilder.buildAssessment({
        userId,
        lastQuestionDate: nowDate,
        state: Assessment.states.ENDED_DUE_TO_FINALIZATION,
      });
      (assessmentRepository.get as $TSFixMe).resolves(assessment);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(correctAnswerThenUpdateAssessment)({
        answer,
        userId,
        ...dependencies,
      });

      // then
      expect(error).to.be.an.instanceOf(CertificationEndedByFinalizationError);
      expect((error as $TSFixMe).message).to.equal('La session a été finalisée par votre centre de certification.');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when no answer already exists', function () {
    let completedAnswer: $TSFixMe;
    let savedAnswer: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      completedAnswer = domainBuilder.buildAnswer(answer);
      completedAnswer.id = undefined;
      completedAnswer.result = AnswerStatus.OK;
      completedAnswer.resultDetails = null;
      completedAnswer.timeSpent = 0;
      savedAnswer = domainBuilder.buildAnswer(completedAnswer);
      (answerRepository.saveWithKnowledgeElements as $TSFixMe).resolves(savedAnswer);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('and assessment is a COMPETENCE_EVALUATION', function () {
      let knowledgeElement;
      let firstCreatedKnowledgeElement;
      let secondCreatedKnowledgeElement;
      let skills;
      let scorecard: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        assessment.type = Assessment.types.COMPETENCE_EVALUATION;
        assessment.competenceId = 'recABCD';
        (assessmentRepository.get as $TSFixMe).resolves(assessment);
        knowledgeElement = domainBuilder.buildKnowledgeElement();
        firstCreatedKnowledgeElement = domainBuilder.buildKnowledgeElement({ earnedPix: 2 });
        secondCreatedKnowledgeElement = domainBuilder.buildKnowledgeElement({ earnedPix: 1 });
        skills = domainBuilder.buildSkillCollection();

        scorecard = domainBuilder.buildUserScorecard({ level: 2, earnedPix: 22, exactlyEarnedPix: 22 });
        (skillRepository.findActiveByCompetenceId as $TSFixMe).withArgs(assessment.competenceId).resolves(skills);
        (knowledgeElementRepository.findUniqByUserIdAndAssessmentId as $TSFixMe).withArgs({ userId: assessment.userId, assessmentId: assessment.id })
    .resolves([knowledgeElement]);
        KnowledgeElement.createKnowledgeElementsForAnswer.returns([
          firstCreatedKnowledgeElement,
          secondCreatedKnowledgeElement,
        ]);
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        (targetProfileRepository.getByCampaignParticipationId as $TSFixMe).rejects(new NotFoundError());
        (scorecardService.computeScorecard as $TSFixMe).resolves(scorecard);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the answer repository to save the answer', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        expect(answerRepository.saveWithKnowledgeElements).to.have.been.calledWith(completedAnswer);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call repositories to get needed information', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        expect(skillRepository.findActiveByCompetenceId).to.have.been.calledWith(assessment.competenceId);
        expect(knowledgeElementRepository.findUniqByUserIdAndAssessmentId).to.have.been.calledWith({
          userId: assessment.userId,
          assessmentId: assessment.id,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the saved answer - with the id', async function () {
        // when
        const result = await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = savedAnswer;
        expect(result).to.deep.equal(expectedArgument);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user responds correctly', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should add the level up to the answer when the user gain one level', async function () {
          // given
          const scorecardAfterAnswer = domainBuilder.buildUserScorecard({
            name: scorecard.name,
            level: scorecard.level + addOneLevel.level,
            earnedPix: scorecard.earnedPix + addOneLevel.pix,
            exactlyEarnedPix: scorecard.exactlyEarnedPix + addOneLevel.pix,
          });
          (scorecardService.computeScorecard as $TSFixMe).onFirstCall()
    .resolves(scorecard)
    .onSecondCall()
    .resolves(scorecardAfterAnswer);
          const expectedLevel = scorecardAfterAnswer.level;

          // when
          const result = await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(result.levelup).to.deep.equal({
            id: result.id,
            competenceName: scorecard.name,
            level: expectedLevel,
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an empty levelup when not gaining a level', async function () {
          (scorecardService.computeScorecard as $TSFixMe).onFirstCall().resolves(scorecard).onSecondCall().resolves(scorecard);

          // when
          const result = await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(result.levelup).to.deep.equal({});
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user responds badly', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not compute the level up', async function () {
          // given
          answer = domainBuilder.buildAnswer({ value: '' });
          answer.id = undefined;
          answer.result = undefined;
          answer.resultDetails = undefined;

          // when
          await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(scorecardService.computeScorecard).to.not.have.been.called;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('and assessment is a CAMPAIGN with SMART_RANDOM method', function () {
      let firstKnowledgeElement: $TSFixMe;
      let secondKnowledgeElement: $TSFixMe;
      let scorecard: $TSFixMe,
        knowledgeElement,
        targetProfile: $TSFixMe,
        skills,
        challenge: $TSFixMe,
        skillAlreadyValidated: $TSFixMe,
        skillNotAlreadyValidated;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        assessment.type = Assessment.types.CAMPAIGN;
        assessment.method = Assessment.methods.SMART_RANDOM;
        assessment.campaignParticipationId = 123;
        (assessmentRepository.get as $TSFixMe).resolves(assessment);
        skills = domainBuilder.buildSkillCollection({ minLevel: 1, maxLevel: 4 });
        skillAlreadyValidated = skills[0];
        skillNotAlreadyValidated = skills[2];
        challenge = domainBuilder.buildChallenge({
          skill: skillNotAlreadyValidated,
          id: answer.challengeId,
          validator,
        });

        knowledgeElement = domainBuilder.buildKnowledgeElement({
          status: 'validated',
          skillId: skillAlreadyValidated.id,
        });
        firstKnowledgeElement = domainBuilder.buildKnowledgeElement({ earnedPix: 2 });
        secondKnowledgeElement = domainBuilder.buildKnowledgeElement({ earnedPix: 1.8 });
        scorecard = domainBuilder.buildUserScorecard({ level: 2, earnedPix: 20, exactlyEarnedPix: 20.2 });
        targetProfile = domainBuilder.buildTargetProfile({ skills });
        (challengeRepository.get as $TSFixMe).resolves(challenge);

        (knowledgeElementRepository.findUniqByUserIdAndAssessmentId as $TSFixMe).withArgs({ userId: assessment.userId, assessmentId: assessment.id })
    .resolves([knowledgeElement]);

        (targetProfileRepository.getByCampaignParticipationId as $TSFixMe).resolves(targetProfile);
        KnowledgeElement.createKnowledgeElementsForAnswer.returns([firstKnowledgeElement, secondKnowledgeElement]);
        (scorecardService.computeScorecard as $TSFixMe).resolves(scorecard);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the answer repository to save the answer', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });
        // then
        const expectedArgs = [[completedAnswer, [firstKnowledgeElement, secondKnowledgeElement]]];
        expect((answerRepository.saveWithKnowledgeElements as $TSFixMe).args).to.deep.equal(expectedArgs);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the target profile repository to find target skills', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = assessment.campaignParticipationId;
        expect(targetProfileRepository.getByCampaignParticipationId).to.have.been.calledWith(expectedArgument);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the challenge repository to get the answer challenge', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = answer.challengeId;
        expect(challengeRepository.get).to.have.been.calledWith(expectedArgument);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create the knowledge elements for the answer', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const answerCreated = domainBuilder.buildAnswer(savedAnswer);
        answerCreated.id = undefined;
        const expectedArgument = {
          answer: answerCreated,
          challenge: challenge,
          previouslyFailedSkills: [],
          previouslyValidatedSkills: [skillAlreadyValidated],
          targetSkills: targetProfile.skills,
          userId: assessment.userId,
        };
        expect(KnowledgeElement.createKnowledgeElementsForAnswer).to.have.been.calledWith(expectedArgument);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the saved answer - with the id', async function () {
        // when
        const result = await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = savedAnswer;
        expect(result).to.deep.equal(expectedArgument);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user responds correctly', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should add the level up to the answer when the user gain one level', async function () {
          // given
          const scorecardAfterAnswer = domainBuilder.buildUserScorecard({
            name: scorecard.name,
            level: scorecard.level + addOneLevel.level,
            earnedPix: scorecard.earnedPix + addOneLevel.pix,
            exactlyEarnedPix: scorecard.exactlyEarnedPix + addOneLevel.pix,
          });
          (scorecardService.computeScorecard as $TSFixMe).onFirstCall()
    .resolves(scorecard)
    .onSecondCall()
    .resolves(scorecardAfterAnswer);
          const expectedLevel = scorecardAfterAnswer.level;
          // when
          const result = await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(result.levelup).to.deep.equal({
            id: result.id,
            competenceName: scorecard.name,
            level: expectedLevel,
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an empty levelup when not gaining a level', async function () {
          // given
(scorecardService.computeScorecard as $TSFixMe).onFirstCall().resolves(scorecard).onSecondCall().resolves(scorecard);

          // when
          const result = await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(result.levelup).to.deep.equal({});
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user responds badly', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not compute the level up', async function () {
          // given
          answer = domainBuilder.buildAnswer({ value: '' });
          answer.id = undefined;
          answer.result = undefined;
          answer.resultDetails = undefined;

          // when
          await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(scorecardService.computeScorecard).to.not.have.been.called;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('and assessment is a CAMPAIGN with FLASH method', function () {
      let firstKnowledgeElement;
      let secondKnowledgeElement;
      let scorecard,
        knowledgeElement,
        targetProfile,
        skills,
        challenge,
        skillAlreadyValidated,
        skillNotAlreadyValidated;
      let flashData: $TSFixMe;
      const estimatedLevel = 1.93274982;
      const errorRate = 0.9127398127;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        assessment.type = Assessment.types.CAMPAIGN;
        assessment.method = Assessment.methods.FLASH;
        assessment.campaignParticipationId = 123;
        (assessmentRepository.get as $TSFixMe).resolves(assessment);
        skills = domainBuilder.buildSkillCollection({ minLevel: 1, maxLevel: 4 });
        skillAlreadyValidated = skills[0];
        skillNotAlreadyValidated = skills[2];
        challenge = domainBuilder.buildChallenge({
          skill: skillNotAlreadyValidated,
          id: answer.challengeId,
          validator,
        });

        knowledgeElement = domainBuilder.buildKnowledgeElement({
          status: 'validated',
          skillId: skillAlreadyValidated.id,
        });
        firstKnowledgeElement = domainBuilder.buildKnowledgeElement({ earnedPix: 2 });
        secondKnowledgeElement = domainBuilder.buildKnowledgeElement({ earnedPix: 1.8 });
        scorecard = domainBuilder.buildUserScorecard({ level: 2, earnedPix: 20, exactlyEarnedPix: 20.2 });
        targetProfile = domainBuilder.buildTargetProfile({ skills });
        (challengeRepository.get as $TSFixMe).resolves(challenge);

        (knowledgeElementRepository.findUniqByUserIdAndAssessmentId as $TSFixMe).withArgs({ userId: assessment.userId, assessmentId: assessment.id })
    .resolves([knowledgeElement]);

        (targetProfileRepository.getByCampaignParticipationId as $TSFixMe).resolves(targetProfile);
        KnowledgeElement.createKnowledgeElementsForAnswer.returns([firstKnowledgeElement, secondKnowledgeElement]);
        (scorecardService.computeScorecard as $TSFixMe).resolves(scorecard);

        flashData = Symbol('flashData');
        (algorithmDataFetcherService.fetchForFlashLevelEstimation as $TSFixMe).returns(flashData);
        (flashAlgorithmService.getEstimatedLevelAndErrorRate as $TSFixMe).returns({
    estimatedLevel,
    errorRate,
});
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the answer repository to save the answer', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });
        // then
        const expectedArgs = [[completedAnswer, []]];
        expect((answerRepository.saveWithKnowledgeElements as $TSFixMe).args).to.deep.equal(expectedArgs);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not call the target profile repository to find target skills', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        expect(targetProfileRepository.getByCampaignParticipationId).to.not.have.been.called;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the challenge repository to get the answer challenge', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = answer.challengeId;
        expect(challengeRepository.get).to.have.been.calledWith(expectedArgument);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create the knowledge elements for the answer', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const answerCreated = domainBuilder.buildAnswer(savedAnswer);
        answerCreated.id = undefined;
        expect(KnowledgeElement.createKnowledgeElementsForAnswer).to.not.have.been.called;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the saved answer - with the id', async function () {
        // when
        const result = await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = savedAnswer;
        expect(result).to.deep.equal(expectedArgument);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the algorithm data fetcher for level estimation', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        expect(algorithmDataFetcherService.fetchForFlashLevelEstimation).to.have.been.calledWith({
          assessment,
          answerRepository,
          challengeRepository,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the flash algorithm to estimate level and error rate', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        expect(flashAlgorithmService.getEstimatedLevelAndErrorRate).to.have.been.calledWith(flashData);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the flash assessment result repository to save estimatedLevel and errorRate', async function () {
        // when
        const { id } = await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        expect(flashAssessmentResultRepository.save).to.have.been.calledWith({
          answerId: id,
          estimatedLevel,
          errorRate,
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user responds correctly', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not add the level up to the answer when the user gain one level', async function () {
          // when
          const result = await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(result.levelup).to.deep.equal({});
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user responds badly', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not compute the level up', async function () {
          // given
          answer = domainBuilder.buildAnswer({ value: '' });
          answer.id = undefined;
          answer.result = undefined;
          answer.resultDetails = undefined;

          // when
          await correctAnswerThenUpdateAssessment({
            answer,
            userId,
            ...dependencies,
          });

          // then
          expect(scorecardService.computeScorecard).to.not.have.been.called;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('and assessment is a nor a CAMPAIGN nor a COMPETENCE_EVALUATION', function () {
      let answer: $TSFixMe;
      let assessment;
      let challenge;
      let completedAnswer: $TSFixMe;
      let correctAnswerValue;
      let savedAnswer: $TSFixMe;
      let solution;
      let validator;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        correctAnswerValue = '1';

        answer = domainBuilder.buildAnswer();
        answer.id = undefined;
        answer.result = undefined;
        answer.resultDetails = undefined;

        solution = domainBuilder.buildSolution({ id: answer.challengeId, value: correctAnswerValue });
        validator = domainBuilder.buildValidator.ofTypeQCU({ solution });
        challenge = domainBuilder.buildChallenge({ id: answer.challengeId, validator });

        completedAnswer = domainBuilder.buildAnswer(answer);
        completedAnswer.timeSpent = 0;
        completedAnswer.id = undefined;
        completedAnswer.result = AnswerStatus.OK;
        completedAnswer.resultDetails = null;

        savedAnswer = domainBuilder.buildAnswer(completedAnswer);

        assessment = domainBuilder.buildAssessment({
          userId,
          type: Assessment.types.CERTIFICATION,
          lastQuestionDate: nowDate,
        });

        (assessmentRepository.get as $TSFixMe).resolves(assessment);
        (challengeRepository.get as $TSFixMe).resolves(challenge);
        (answerRepository.saveWithKnowledgeElements as $TSFixMe).resolves(savedAnswer);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the answer repository to save the answer', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = completedAnswer;
        expect(answerRepository.saveWithKnowledgeElements).to.have.been.calledWith(expectedArgument);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the challenge repository to get the answer challenge', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = answer.challengeId;
        expect(challengeRepository.get).to.have.been.calledWith(expectedArgument);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not call the compute scorecard method', async function () {
        // when
        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        expect(scorecardService.computeScorecard).to.not.have.been.called;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the saved answer - with the id', async function () {
        // when
        const result = await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        // then
        const expectedArgument = savedAnswer;
        expect(result).to.deep.equal(expectedArgument);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the user which want to save the answer is not the right user', function () {
    let answer: $TSFixMe;
    let assessment;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      answer = domainBuilder.buildAnswer();
      assessment = domainBuilder.buildAssessment({ userId: userId + 1 });
      (assessmentRepository.get as $TSFixMe).resolves(assessment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if no userId is passed', function () {
      // when
      const result = correctAnswerThenUpdateAssessment({
        answer,
        userId,
        ...dependencies,
      });

      // then
      return expect(result).to.be.rejectedWith(ForbiddenAccess);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('compute the timeSpent and save it on the answer', function () {
    let answer;
    let assessment;
    let answerSaved;

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('compute the timeSpent', async function () {
      answer = domainBuilder.buildAnswer({ timeSpent: null });
      assessment = domainBuilder.buildAssessment({
        userId,
        lastQuestionDate: new Date('2021-03-11T11:00:00Z'),
      });
      assessment.type = Assessment.types.CERTIFICATION;
      (assessmentRepository.get as $TSFixMe).resolves(assessment);
      answerSaved = domainBuilder.buildAnswer(answer);
      answerSaved.timeSpent = 5;
      (answerRepository.saveWithKnowledgeElements as $TSFixMe).resolves(answerSaved);

      await correctAnswerThenUpdateAssessment({
        answer,
        userId,
        ...dependencies,
      });

      const expectedAnswer = domainBuilder.buildAnswer(answer);
      expectedAnswer.timeSpent = 5;
      expect(answerRepository.saveWithKnowledgeElements).to.be.calledWith(expectedAnswer);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment type is preview', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('compute timeSpent=0 when the assessment does not have a lastQuestionDate', async function () {
        answer = domainBuilder.buildAnswer({ timeSpent: null });
        assessment = domainBuilder.buildAssessment({
          userId,
          lastQuestionDate: null,
        });
        assessment.type = Assessment.types.PREVIEW;
        (assessmentRepository.get as $TSFixMe).resolves(assessment);
        answerSaved = domainBuilder.buildAnswer(answer);
        (answerRepository.saveWithKnowledgeElements as $TSFixMe).resolves(answerSaved);

        await correctAnswerThenUpdateAssessment({
          answer,
          userId,
          ...dependencies,
        });

        const expectedAnswer = domainBuilder.buildAnswer(answer);
        expectedAnswer.timeSpent = 0;
        expect(answerRepository.saveWithKnowledgeElements).to.be.calledWith(expectedAnswer);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the challenge is not focused', function () {
    let focusedOutAnswer: $TSFixMe;
    let assessment;
    let answerSaved;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // Given
      focusedOutAnswer = domainBuilder.buildAnswer({ isFocusedOut: true });
      const nonFocusedChallenge = domainBuilder.buildChallenge({
        id: focusedOutAnswer.challengeId,
        validator,
        focused: false,
      });
      (challengeRepository.get as $TSFixMe).resolves(nonFocusedChallenge);
      assessment = domainBuilder.buildAssessment({
        userId,
        lastQuestionDate: new Date('2021-03-11T11:00:00Z'),
        type: Assessment.types.CERTIFICATION,
      });
      (assessmentRepository.get as $TSFixMe).resolves(assessment);
      answerSaved = domainBuilder.buildAnswer(focusedOutAnswer);
      (answerRepository.saveWithKnowledgeElements as $TSFixMe).resolves(answerSaved);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return focused out answer', async function () {
      // When
      const { result } = await correctAnswerThenUpdateAssessment({
        answer: focusedOutAnswer,
        userId,
        ...dependencies,
      });

      // Then
      expect(result).not.to.equal(AnswerStatus.FOCUSEDOUT);
      expect(result).to.deep.equal(AnswerStatus.OK);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the challenge is focused in certification', function () {
    let answer: $TSFixMe;
    let assessment: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // Given
      answer = domainBuilder.buildAnswer({});
      const nonFocusedChallenge = domainBuilder.buildChallenge({
        id: answer.challengeId,
        validator,
        focused: true,
      });
      (challengeRepository.get as $TSFixMe).resolves(nonFocusedChallenge);
      assessment = domainBuilder.buildAssessment({
        userId,
        lastQuestionDate: new Date('2021-03-11T11:00:00Z'),
        type: Assessment.types.CERTIFICATION,
      });
      (assessmentRepository.get as $TSFixMe).resolves(assessment);
    });

    /* eslint-disable mocha/no-setup-in-describe */
    [
      {
        isFocusedOut: true,
        lastQuestionState: 'focusedout',
        expected: { result: AnswerStatus.FOCUSEDOUT, isFocusedOut: true },
      },
      {
        isFocusedOut: false,
        lastQuestionState: 'asked',
        expected: { result: AnswerStatus.OK, isFocusedOut: false },
      },
      {
        isFocusedOut: false,
        lastQuestionState: 'focusedout',
        expected: { result: AnswerStatus.FOCUSEDOUT, isFocusedOut: true },
      },
      {
        isFocusedOut: true,
        lastQuestionState: 'asked',
        expected: { result: AnswerStatus.FOCUSEDOUT, isFocusedOut: true },
      },
    ].forEach(({ isFocusedOut, lastQuestionState, expected }) => {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(`when answer.isFocusedOut=${isFocusedOut} and lastQuestionState=${lastQuestionState}`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should return result=${expected.result.status} and isFocusedOut=${expected.isFocusedOut}`, async function () {
          // Given
          answer.isFocusedOut = isFocusedOut;
          assessment.lastQuestionState = lastQuestionState;
          // @ts-expect-error TS(2322): Type '(_: $TSFixMe) => any' is not assignable to t... Remove this comment to see the full error message
          answerRepository.saveWithKnowledgeElements = (_: $TSFixMe) => _;

          // When
          const correctedAnswer = await correctAnswerThenUpdateAssessment({
            answer: answer,
            userId,
            ...dependencies,
          });

          // Then
          expect(correctedAnswer).to.deep.contain(expected);
        });
      });
    });
    /* eslint-enable mocha/no-setup-in-describe */
  });
});
