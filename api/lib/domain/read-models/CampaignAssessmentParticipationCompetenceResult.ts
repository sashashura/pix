// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipationCompetenceResult {
  areaColor: $TSFixMe;
  competenceMasteryRate: $TSFixMe;
  id: $TSFixMe;
  index: $TSFixMe;
  name: $TSFixMe;
  constructor({
    campaignParticipationId,
    targetedArea,
    targetedCompetence,
    targetedSkillsCount,
    validatedTargetedKnowledgeElementsCount
  }: $TSFixMe = {}) {
    this.id = `${campaignParticipationId}-${targetedCompetence.id}`;
    this.name = targetedCompetence.name;
    this.index = targetedCompetence.index;
    this.areaColor = targetedArea.color;
    this.competenceMasteryRate = Number((validatedTargetedKnowledgeElementsCount / targetedSkillsCount).toFixed(2));
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipationCompetenceResult;
