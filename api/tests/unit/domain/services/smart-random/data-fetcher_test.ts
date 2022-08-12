// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dataFetche... Remove this comment to see the full error message
const dataFetcher = require('../../../../../lib/domain/services/algorithm-methods/data-fetcher');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | services | smart-random | dataFetcher', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fetchForCampaigns', function () {
    let answerRepository: $TSFixMe;
    let targetProfileRepository: $TSFixMe;
    let challengeRepository: $TSFixMe;
    let knowledgeElementRepository: $TSFixMe;
    let campaignParticipationRepository: $TSFixMe;
    let improvementService: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      answerRepository = {
        findByAssessment: sinon.stub(),
      };
      targetProfileRepository = {
        getByCampaignParticipationId: sinon.stub(),
      };
      challengeRepository = {
        findOperativeBySkills: sinon.stub(),
        answerRepository,
      };
      knowledgeElementRepository = {
        findUniqByUserId: sinon.stub(),
      };
      campaignParticipationRepository = {
        isRetrying: sinon.stub(),
      };
      improvementService = {
        filterKnowledgeElementsIfImproving: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fetches answers, lastAnswer, targetsSkills challenges and knowledgeElements', async function () {
      // given
      const assessment = domainBuilder.buildAssessment.ofTypeCampaign({
        state: 'started',
        campaignParticipationId: 1,
        userId: 5678899,
      });
      const answer = Symbol('answer');
      const challenges = Symbol('challenge');
      const knowledgeElements = Symbol('knowledgeElements');
      const targetProfile = Symbol('targetProfile');
      const isRetrying = Symbol('isRetrying');
      const filteredKnowledgeElements = Symbol('filteredKnowledgeElements');

      answerRepository.findByAssessment.withArgs(assessment.id).resolves([answer]);
      targetProfileRepository.getByCampaignParticipationId
        .withArgs(assessment.campaignParticipationId)
        .resolves(targetProfile);
      challengeRepository.findOperativeBySkills.withArgs((targetProfile as $TSFixMe).skills).resolves(challenges);
      knowledgeElementRepository.findUniqByUserId.withArgs({ userId: assessment.userId }).resolves(knowledgeElements);
      campaignParticipationRepository.isRetrying
        .withArgs({ campaignParticipationId: assessment.campaignParticipationId })
        .resolves(isRetrying);
      improvementService.filterKnowledgeElementsIfImproving
        .withArgs({ knowledgeElements, assessment, isRetrying })
        .resolves(filteredKnowledgeElements);

      // when
      const data = await dataFetcher.fetchForCampaigns({
        assessment,
        answerRepository,
        targetProfileRepository,
        challengeRepository,
        knowledgeElementRepository,
        campaignParticipationRepository,
        improvementService,
      });

      // then
      expect(data.allAnswers).to.deep.equal([answer]);
      expect(data.lastAnswer).to.deep.equal(answer);
      expect(data.targetSkills).to.deep.equal((targetProfile as $TSFixMe).skills);
      expect(data.challenges).to.deep.equal(challenges);
      expect(data.knowledgeElements).to.deep.equal(filteredKnowledgeElements);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fetchForCompetenceEvaluations', function () {
    let answerRepository;
    let challengeRepository;
    let knowledgeElementRepository;
    let skillRepository;
    let improvementService: $TSFixMe;
    let data: $TSFixMe;
    let answer: $TSFixMe;
    let knowledgeElements;
    let filteredKnowledgeElements: $TSFixMe;
    let skills: $TSFixMe;
    let challenges: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      answerRepository = {
        findByAssessment: sinon.stub(),
      };
      challengeRepository = {
        findValidatedByCompetenceId: sinon.stub(),
      };
      knowledgeElementRepository = {
        findUniqByUserId: sinon.stub(),
      };
      skillRepository = {
        findActiveByCompetenceId: sinon.stub(),
      };
      improvementService = {
        filterKnowledgeElementsIfImproving: sinon.stub(),
      };

      answer = domainBuilder.buildAnswer();
      challenges = [domainBuilder.buildChallenge()];
      knowledgeElements = [domainBuilder.buildKnowledgeElement()];
      skills = [domainBuilder.buildSkill()];
      const assessment = domainBuilder.buildAssessment.ofTypeCampaign();
      filteredKnowledgeElements = Symbol('filteredKnowledgeElements');

      answerRepository.findByAssessment.withArgs(assessment.id).resolves([answer]);
      skillRepository.findActiveByCompetenceId.withArgs(assessment.competenceId).resolves(skills);
      challengeRepository.findValidatedByCompetenceId.withArgs(assessment.competenceId).resolves(challenges);
      knowledgeElementRepository.findUniqByUserId.withArgs({ userId: assessment.userId }).resolves(knowledgeElements);
      improvementService.filterKnowledgeElementsIfImproving
        .withArgs({ knowledgeElements, assessment, isRetrying: false })
        .resolves(filteredKnowledgeElements);

      // when
      data = await dataFetcher.fetchForCompetenceEvaluations({
        assessment,
        answerRepository,
        challengeRepository,
        knowledgeElementRepository,
        skillRepository,
        improvementService,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('filter knowledge elements if assessment is an improving one', async function () {
      // then
      expect(improvementService.filterKnowledgeElementsIfImproving).to.be.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fetches answers, targetsSkills challenges and knowledgeElements', async function () {
      // then
      expect(data.lastAnswer).to.deep.equal(answer);
      expect(data.allAnswers).to.deep.equal([answer]);
      expect(data.targetSkills).to.deep.equal(skills);
      expect(data.challenges).to.deep.equal(challenges);
      expect(data.knowledgeElements).to.deep.equal(filteredKnowledgeElements);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fetchForFlashCampaigns', function () {
    let answerRepository: $TSFixMe;
    let challengeRepository: $TSFixMe;
    let flashAssessmentResultRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      answerRepository = {
        findByAssessment: sinon.stub(),
      };
      challengeRepository = {
        findFlashCompatible: sinon.stub(),
      };
      flashAssessmentResultRepository = {
        getLatestByAssessmentId: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fetches answers and challenges', async function () {
      // given
      const assessment = domainBuilder.buildAssessment.ofTypeCampaign({
        state: 'started',
        method: 'FLASH',
        campaignParticipationId: 1,
        userId: 5678899,
      });
      const answer = Symbol('answer');
      const challenges = Symbol('challenge');
      const estimatedLevel = Symbol('estimatedLevel');

      answerRepository.findByAssessment.withArgs(assessment.id).resolves([answer]);
      challengeRepository.findFlashCompatible.withArgs().resolves(challenges);
      flashAssessmentResultRepository.getLatestByAssessmentId.withArgs(assessment.id).resolves({ estimatedLevel });

      // when
      const data = await dataFetcher.fetchForFlashCampaigns({
        assessment,
        answerRepository,
        challengeRepository,
        flashAssessmentResultRepository,
      });

      // then
      expect(data.allAnswers).to.deep.equal([answer]);
      expect(data.challenges).to.deep.equal(challenges);
      expect(data.estimatedLevel).to.equal(estimatedLevel);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fetchForFlashLevelEstimation', function () {
    let answerRepository: $TSFixMe;
    let challengeRepository: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      answerRepository = {
        findByAssessment: sinon.stub(),
      };
      challengeRepository = {
        getMany: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fetches answers and challenges', async function () {
      // given
      const assessment = domainBuilder.buildAssessment.ofTypeCampaign({
        state: 'started',
        method: 'FLASH',
        campaignParticipationId: 1,
        userId: 5678899,
      });
      const answer = Symbol('answer');
      const challenges = Symbol('challenge');

      answerRepository.findByAssessment.withArgs(assessment.id).resolves([answer]);
      challengeRepository.getMany.withArgs().resolves(challenges);

      // when
      const data = await dataFetcher.fetchForFlashLevelEstimation({
        assessment,
        answerRepository,
        challengeRepository,
      });

      // then
      expect(data.allAnswers).to.deep.equal([answer]);
      expect(data.challenges).to.deep.equal(challenges);
    });
  });
});
