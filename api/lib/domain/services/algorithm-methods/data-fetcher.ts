// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

async function fetchForCampaigns({
  assessment,
  answerRepository,
  targetProfileRepository,
  challengeRepository,
  knowledgeElementRepository,
  campaignParticipationRepository,
  improvementService
}: $TSFixMe) {
  const targetProfile = await targetProfileRepository.getByCampaignParticipationId(assessment.campaignParticipationId);
  const isRetrying = await campaignParticipationRepository.isRetrying({
    campaignParticipationId: assessment.campaignParticipationId,
  });

  const [allAnswers, knowledgeElements, [targetSkills, challenges]] = await Promise.all([
    answerRepository.findByAssessment(assessment.id),
    _fetchKnowledgeElements({
      assessment,
      isRetrying,
      campaignParticipationRepository,
      knowledgeElementRepository,
      improvementService,
    }),
    _fetchSkillsAndChallenges({ targetProfile, challengeRepository }),
  ]);

  return {
    allAnswers,
    lastAnswer: _.isEmpty(allAnswers) ? null : _.last(allAnswers),
    targetSkills,
    challenges,
    knowledgeElements,
  };
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _fetchKnowledgeElements({
  assessment,
  isRetrying = false,
  knowledgeElementRepository,
  improvementService
}: $TSFixMe) {
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId: assessment.userId });
  return improvementService.filterKnowledgeElementsIfImproving({ knowledgeElements, assessment, isRetrying });
}

async function _fetchSkillsAndChallenges({
  targetProfile,
  challengeRepository
}: $TSFixMe) {
  const challenges = await challengeRepository.findOperativeBySkills(targetProfile.skills);
  return [targetProfile.skills, challenges];
}

async function fetchForCompetenceEvaluations({
  assessment,
  answerRepository,
  challengeRepository,
  knowledgeElementRepository,
  skillRepository,
  improvementService
}: $TSFixMe) {
  const [allAnswers, targetSkills, challenges, knowledgeElements] = await Promise.all([
    answerRepository.findByAssessment(assessment.id),
    skillRepository.findActiveByCompetenceId(assessment.competenceId),
    challengeRepository.findValidatedByCompetenceId(assessment.competenceId),
    _fetchKnowledgeElements({ assessment, knowledgeElementRepository, improvementService }),
  ]);

  return {
    allAnswers,
    lastAnswer: _.isEmpty(allAnswers) ? null : _.last(allAnswers),
    targetSkills,
    challenges,
    knowledgeElements,
  };
}

async function fetchForFlashCampaigns({
  assessment,
  answerRepository,
  challengeRepository,
  flashAssessmentResultRepository,
  locale
}: $TSFixMe) {
  const [allAnswers, challenges, {
    estimatedLevel
  }: $TSFixMe = {}] = await Promise.all([
    answerRepository.findByAssessment(assessment.id),
    challengeRepository.findFlashCompatible(locale),
    flashAssessmentResultRepository.getLatestByAssessmentId(assessment.id),
  ]);

  return {
    allAnswers,
    challenges,
    estimatedLevel,
  };
}

async function fetchForFlashLevelEstimation({
  assessment,
  answerRepository,
  challengeRepository
}: $TSFixMe) {
  const allAnswers = await answerRepository.findByAssessment(assessment.id);
  const challenges = await challengeRepository.getMany(allAnswers.map(({
    challengeId
  }: $TSFixMe) => challengeId));

  return {
    allAnswers,
    challenges,
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  fetchForCampaigns,
  fetchForCompetenceEvaluations,
  fetchForFlashCampaigns,
  fetchForFlashLevelEstimation,
};
