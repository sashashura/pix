// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationService = require('../services/campaign-participation-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResult = require('./CompetenceResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationBadge = require('./CampaignParticipationBadge');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationResult {
  campaignParticipationBadges: $TSFixMe;
  competenceResults: $TSFixMe;
  id: $TSFixMe;
  isCompleted: $TSFixMe;
  knowledgeElementsCount: $TSFixMe;
  reachedStage: $TSFixMe;
  stageCount: $TSFixMe;
  testedSkillsCount: $TSFixMe;
  totalSkillsCount: $TSFixMe;
  validatedSkillsCount: $TSFixMe;
  constructor({
    id,
    isCompleted,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount,
    knowledgeElementsCount,

    // relationships
    campaignParticipationBadges,

    competenceResults = [],
    reachedStage,
    stageCount
  }: $TSFixMe = {}) {
    this.id = id;
    this.isCompleted = isCompleted;
    this.totalSkillsCount = totalSkillsCount;
    this.testedSkillsCount = testedSkillsCount;
    this.validatedSkillsCount = validatedSkillsCount;
    this.knowledgeElementsCount = knowledgeElementsCount;
    // relationships
    this.campaignParticipationBadges = campaignParticipationBadges;
    this.competenceResults = competenceResults;
    this.reachedStage = reachedStage;
    this.stageCount = stageCount;
  }

  static buildFrom({
    campaignParticipationId,
    assessment,
    competences,
    targetProfile,
    knowledgeElements,
    campaignBadges = [],
    acquiredBadgeIds = []
  }: $TSFixMe) {
    const targetProfileSkillsIds = targetProfile.getSkillIds();
    const targetedKnowledgeElements = _removeUntargetedKnowledgeElements(knowledgeElements, targetProfileSkillsIds);

    const targetedCompetenceResults = _computeCompetenceResults(
      competences,
      targetProfileSkillsIds,
      targetedKnowledgeElements
    );
    const campaignParticipationBadges = _.flatMap(campaignBadges, (badge: $TSFixMe) => {
      const skillSetResults = _computeSkillSetResults(badge, targetProfileSkillsIds, targetedKnowledgeElements);
      const isBadgeAcquired = _.includes(acquiredBadgeIds, badge.id);
      return CampaignParticipationBadge.buildFrom({ badge, skillSetResults, isAcquired: isBadgeAcquired });
    });

    const validatedSkillsCount = _.sumBy(targetedCompetenceResults, 'validatedSkillsCount');
    const totalSkillsCount = _.sumBy(targetedCompetenceResults, 'totalSkillsCount');
    const testedSkillsCount = _.sumBy(targetedCompetenceResults, 'testedSkillsCount');

    const stages = targetProfile.stages || null;

    return new CampaignParticipationResult({
      id: campaignParticipationId,
      totalSkillsCount,
      testedSkillsCount,
      validatedSkillsCount,
      knowledgeElementsCount: targetedKnowledgeElements.length,
      isCompleted: assessment.isCompleted(),
      competenceResults: targetedCompetenceResults,
      campaignParticipationBadges,
      reachedStage: _computeReachedStage({ stages, totalSkillsCount, validatedSkillsCount }),
      stageCount: stages && stages.length,
    });
  }

  get masteryPercentage() {
    return _computeMasteryPercentage({
      totalSkillsCount: this.totalSkillsCount,
      validatedSkillsCount: this.validatedSkillsCount,
    });
  }

  get progress() {
    return campaignParticipationService.progress(this.isCompleted, this.knowledgeElementsCount, this.totalSkillsCount);
  }
}

function _computeReachedStage({
  stages,
  totalSkillsCount,
  validatedSkillsCount
}: $TSFixMe) {
  if (!stages) {
    return null;
  }
  const masteryPercentage = _computeMasteryPercentage({ totalSkillsCount, validatedSkillsCount });
  const reachedStages = stages.filter((stage: $TSFixMe) => masteryPercentage >= stage.threshold);
  return {
    ..._.last(reachedStages),
    starCount: reachedStages.length,
  };
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _computeMasteryPercentage({
  totalSkillsCount,
  validatedSkillsCount
}: $TSFixMe) {
  if (totalSkillsCount !== 0) {
    return Math.round((validatedSkillsCount * 100) / totalSkillsCount);
  } else {
    return 0;
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _removeUntargetedKnowledgeElements(knowledgeElements: $TSFixMe, targetProfileSkillsIds: $TSFixMe) {
  return _.filter(knowledgeElements, (ke: $TSFixMe) => targetProfileSkillsIds.some((skillId: $TSFixMe) => skillId === ke.skillId));
}

function _computeCompetenceResults(competences: $TSFixMe, targetProfileSkillsIds: $TSFixMe, targetedKnowledgeElements: $TSFixMe) {
  let targetedCompetences = _removeUntargetedSkillIdsFromCompetences(competences, targetProfileSkillsIds);
  targetedCompetences = _removeCompetencesWithoutAnyTargetedSkillsLeft(targetedCompetences);
  const targetedCompetenceResults = _.map(targetedCompetences, (competence: $TSFixMe) => _getTestedCompetenceResults(competence, targetedKnowledgeElements)
  );
  return targetedCompetenceResults;
}

function _computeSkillSetResults(badge: $TSFixMe, targetProfileSkillsIds: $TSFixMe, targetedKnowledgeElements: $TSFixMe) {
  if (!badge || _.isEmpty(badge.skillSets)) {
    return [];
  }

  return _computeCompetenceResults(badge.skillSets, targetProfileSkillsIds, targetedKnowledgeElements);
}

function _removeUntargetedSkillIdsFromCompetences(competences: $TSFixMe, targetProfileSkillsIds: $TSFixMe) {
  return _.map(competences, (competence: $TSFixMe) => {
    competence.skillIds = _.intersection(competence.skillIds, targetProfileSkillsIds);
    return competence;
  });
}

function _removeCompetencesWithoutAnyTargetedSkillsLeft(competences: $TSFixMe) {
  return _.filter(competences, (competence: $TSFixMe) => !_.isEmpty(competence.skillIds));
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _getTestedCompetenceResults(competence: $TSFixMe, targetedKnowledgeElements: $TSFixMe) {
  const targetedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElements, (ke: $TSFixMe) => _.includes(competence.skillIds, ke.skillId)
  );
  const validatedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElementsForCompetence, 'isValidated');

  const testedSkillsCount = targetedKnowledgeElementsForCompetence.length;
  const validatedSkillsCount = validatedKnowledgeElementsForCompetence.length;
  const totalSkillsCount = competence.skillIds.length;
  const areaColor = competence.area ? competence.area.color : null;
  const areaName = _getAreaName(competence);

  return new CompetenceResult({
    id: competence.id,
    name: competence.name,
    index: competence.index,
    areaColor,
    areaName,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount,
    badgeId: competence.badgeId,
  });
}

function _getAreaName(competence: $TSFixMe) {
  if (!competence.area) return;
  return competence.area.name;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationResult;
