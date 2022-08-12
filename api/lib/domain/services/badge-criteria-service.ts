// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../lib/domain/models/BadgeCriterion');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');

function areBadgeCriteriaFulfilled({
  knowledgeElements,
  targetProfile,
  badge
}: $TSFixMe) {
  const targetProfileSkillsIds = targetProfile.getSkillIds();
  const targetedKnowledgeElements = _removeUntargetedKnowledgeElements(knowledgeElements, targetProfileSkillsIds);

  const masteryPercentage = getMasteryPercentageForTargetProfile({ targetProfileSkillsIds, targetedKnowledgeElements });
  const skillSetResults = getMasteryPercentageForAllSkillSets({
    badge,
    targetProfileSkillsIds,
    targetedKnowledgeElements,
  });

  return verifyCriteriaFulfilment({ masteryPercentage, skillSetResults, badge });
}

function getMasteryPercentageForTargetProfile({
  targetProfileSkillsIds,
  targetedKnowledgeElements
}: $TSFixMe) {
  const validatedSkillsCount = targetedKnowledgeElements.filter(
    (targetedKnowledgeElement: $TSFixMe) => targetedKnowledgeElement.isValidated
  ).length;
  const totalSkillsCount = targetProfileSkillsIds.length;
  return _computeMasteryPercentage({ totalSkillsCount, validatedSkillsCount });
}

function getMasteryPercentageForAllSkillSets({
  targetedKnowledgeElements,
  targetProfileSkillsIds,
  badge
}: $TSFixMe) {
  if (_.isEmpty(badge.skillSets)) {
    return [];
  }

  const validTargetedSkillSets = _keepValidTargetedSkillSets(badge.skillSets, targetProfileSkillsIds);
  return _.map(validTargetedSkillSets, (skillSet: $TSFixMe) => _getTestedCompetenceResults(skillSet, targetedKnowledgeElements));
}

function verifyCriteriaFulfilment({
  masteryPercentage,
  skillSetResults,
  badge
}: $TSFixMe) {
  if (!badge.badgeCriteria.length) {
    logger.warn(`No criteria for badge ${badge.id}`);
    return false;
  }
  return _.every(badge.badgeCriteria, (criterion: $TSFixMe) => {
    if (criterion.scope === BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION) {
      return masteryPercentage >= criterion.threshold;
    } else if (criterion.scope === BadgeCriterion.SCOPES.SKILL_SET) {
      return _verifyListOfSkillSetResultsMasteryPercentageCriterion({
        allSkillSetResults: skillSetResults,
        threshold: criterion.threshold,
        skillSetIds: criterion.skillSetIds,
      });
    } else {
      return false;
    }
  });
}

function _verifyListOfSkillSetResultsMasteryPercentageCriterion({
  allSkillSetResults,
  threshold,
  skillSetIds
}: $TSFixMe) {
  const filteredSkillSetResults = _.filter(allSkillSetResults, (skillSetResult: $TSFixMe) => skillSetIds.includes(skillSetResult.id)
  );

  return _.every(filteredSkillSetResults, (skillSetResult: $TSFixMe) => skillSetResult.masteryPercentage >= threshold);
}

function _removeUntargetedKnowledgeElements(knowledgeElements: $TSFixMe, targetProfileSkillsIds: $TSFixMe) {
  return _.filter(knowledgeElements, (ke: $TSFixMe) => targetProfileSkillsIds.some((skillId: $TSFixMe) => skillId === ke.skillId));
}

function _keepValidTargetedSkillSets(skillSets: $TSFixMe, targetProfileSkillsIds: $TSFixMe) {
  const targetedCompetences = _removeUntargetedSkillIdsFromSkillSets(skillSets, targetProfileSkillsIds);
  return _removeSkillSetsWithoutAnyTargetedSkillsLeft(targetedCompetences);
}

function _removeUntargetedSkillIdsFromSkillSets(skillSets: $TSFixMe, targetProfileSkillsIds: $TSFixMe) {
  return _.map(skillSets, (skillSet: $TSFixMe) => {
    skillSet.skillIds = _.intersection(skillSet.skillIds, targetProfileSkillsIds);
    return skillSet;
  });
}

function _removeSkillSetsWithoutAnyTargetedSkillsLeft(skillSets: $TSFixMe) {
  return _.filter(skillSets, (skillSet: $TSFixMe) => !_.isEmpty(skillSet.skillIds));
}

function _computeMasteryPercentage({
  totalSkillsCount,
  validatedSkillsCount
}: $TSFixMe) {
  if (totalSkillsCount === 0) {
    return 0;
  } else {
    return Math.round((validatedSkillsCount * 100) / totalSkillsCount);
  }
}

function _getTestedCompetenceResults(skillSet: $TSFixMe, targetedKnowledgeElements: $TSFixMe) {
  const targetedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElements, (ke: $TSFixMe) => _.includes(skillSet.skillIds, ke.skillId)
  );
  const validatedKnowledgeElementsForCompetence = _.filter(targetedKnowledgeElementsForCompetence, 'isValidated');

  const validatedSkillsCount = validatedKnowledgeElementsForCompetence.length;
  const totalSkillsCount = skillSet.skillIds.length;

  const masteryPercentage = _computeMasteryPercentage({ totalSkillsCount, validatedSkillsCount });

  return {
    id: skillSet.id,
    masteryPercentage,
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  areBadgeCriteriaFulfilled,
  verifyCriteriaFulfilment,
  getMasteryPercentageForTargetProfile,
  getMasteryPercentageForAllSkillSets,
};
