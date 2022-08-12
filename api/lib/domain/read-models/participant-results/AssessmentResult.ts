// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeResul... Remove this comment to see the full error message
const BadgeResult = require('./BadgeResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ReachedSta... Remove this comment to see the full error message
const ReachedStage = require('./ReachedStage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResult = require('./CompetenceResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentResult {
  badgeResults: $TSFixMe;
  canImprove: $TSFixMe;
  canRetry: $TSFixMe;
  competenceResults: $TSFixMe;
  estimatedFlashLevel: $TSFixMe;
  id: $TSFixMe;
  isCompleted: $TSFixMe;
  isDisabled: $TSFixMe;
  isShared: $TSFixMe;
  masteryRate: $TSFixMe;
  participantExternalId: $TSFixMe;
  reachedStage: $TSFixMe;
  stageCount: $TSFixMe;
  testedSkillsCount: $TSFixMe;
  totalSkillsCount: $TSFixMe;
  validatedSkillsCount: $TSFixMe;
  constructor(
    participationResults: $TSFixMe,
    targetProfile: $TSFixMe,
    isCampaignMultipleSendings: $TSFixMe,
    isOrganizationLearnerActive: $TSFixMe,
    isCampaignArchived: $TSFixMe
  ) {
    const { knowledgeElements, sharedAt, assessmentCreatedAt } = participationResults;
    const { competences } = targetProfile;

    this.id = participationResults.campaignParticipationId;
    this.isCompleted = participationResults.isCompleted;
    this.isShared = Boolean(participationResults.sharedAt);
    this.participantExternalId = participationResults.participantExternalId;
    this.estimatedFlashLevel = participationResults.estimatedFlashLevel;

    this.totalSkillsCount = competences.flatMap(({
      skillIds
    }: $TSFixMe) => skillIds).length;
    this.testedSkillsCount = knowledgeElements.length;
    this.validatedSkillsCount = knowledgeElements.filter(({
      isValidated
    }: $TSFixMe) => isValidated).length;
    this.masteryRate = this._computeMasteryRate(
      participationResults.masteryRate,
      this.isShared,
      this.totalSkillsCount,
      this.validatedSkillsCount
    );

    this.competenceResults = competences.map((competence: $TSFixMe) => _buildCompetenceResults(competence, knowledgeElements));
    this.badgeResults = targetProfile.badges.map((badge: $TSFixMe) => new BadgeResult(badge, participationResults));

    this.stageCount = targetProfile.stages.length;
    if (targetProfile.stages.length > 0) {
      this.reachedStage = new ReachedStage(this.masteryRate, targetProfile.stages);
    }
    this.canImprove = this._computeCanImprove(knowledgeElements, assessmentCreatedAt, this.isShared);
    this.isDisabled = this._computeIsDisabled(isCampaignArchived, participationResults.isDeleted);
    this.canRetry = this._computeCanRetry(
      isCampaignMultipleSendings,
      sharedAt,
      isOrganizationLearnerActive,
      this.masteryRate,
      this.isDisabled
    );
  }

  _computeMasteryRate(masteryRate: $TSFixMe, isShared: $TSFixMe, totalSkillsCount: $TSFixMe, validatedSkillsCount: $TSFixMe) {
    if (isShared) {
      return masteryRate;
    } else if (totalSkillsCount > 0) {
      const rate = (validatedSkillsCount / totalSkillsCount).toPrecision(2);
      return parseFloat(rate);
    } else {
      return 0;
    }
  }

  _computeCanImprove(knowledgeElements: $TSFixMe, assessmentCreatedAt: $TSFixMe, isShared: $TSFixMe) {
    const isImprovementPossible =
      knowledgeElements.filter((knowledgeElement: $TSFixMe) => {
        const isOldEnoughToBeImproved =
          moment(assessmentCreatedAt).diff(knowledgeElement.createdAt, 'days', true) >=
          constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING;
        return knowledgeElement.isInvalidated && isOldEnoughToBeImproved;
      }).length > 0;
    return isImprovementPossible && !isShared;
  }

  _computeCanRetry(isCampaignMultipleSendings: $TSFixMe, sharedAt: $TSFixMe, isOrganizationLearnerActive: $TSFixMe, masteryRate: $TSFixMe, isDisabled: $TSFixMe) {
    return (
      isCampaignMultipleSendings &&
      this._timeBeforeRetryingPassed(sharedAt) &&
      masteryRate < constants.MAX_MASTERY_RATE &&
      isOrganizationLearnerActive &&
      !isDisabled
    );
  }

  _computeIsDisabled(isCampaignArchived: $TSFixMe, isParticipationDeleted: $TSFixMe) {
    return isCampaignArchived || isParticipationDeleted;
  }

  _timeBeforeRetryingPassed(sharedAt: $TSFixMe) {
    const isShared = Boolean(sharedAt);
    if (!isShared) return false;
    return sharedAt && moment().diff(sharedAt, 'days', true) >= constants.MINIMUM_DELAY_IN_DAYS_BEFORE_RETRYING;
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _buildCompetenceResults(competence: $TSFixMe, knowledgeElements: $TSFixMe) {
  const competenceKnowledgeElements = knowledgeElements.filter(({
    skillId
  }: $TSFixMe) => competence.skillIds.includes(skillId));
  return new CompetenceResult(competence, competenceKnowledgeElements);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AssessmentResult;
