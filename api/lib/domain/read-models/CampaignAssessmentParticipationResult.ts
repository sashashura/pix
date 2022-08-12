// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationCompetenceResult = require('./CampaignAssessmentParticipationCompetenceResult');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
class CampaignAssessmentParticipationResult {
  campaignId: $TSFixMe;
  campaignParticipationId: $TSFixMe;
  competenceResults: $TSFixMe;
  isShared: $TSFixMe;
  constructor({
    campaignParticipationId,
    campaignId,
    status,
    targetedCompetences,
    targetProfile,
    validatedTargetedKnowledgeElementsCountByCompetenceId = {}
  }: $TSFixMe) {
    this.campaignParticipationId = campaignParticipationId;
    this.campaignId = campaignId;
    this.isShared = status === SHARED;

    if (status !== SHARED) {
      this.competenceResults = [];
    } else {
      this.competenceResults = targetedCompetences.map((targetedCompetence: $TSFixMe) => {
        const targetedArea = targetProfile.getAreaOfCompetence(targetedCompetence.id);
        return new CampaignAssessmentParticipationCompetenceResult({
          campaignParticipationId,
          targetedArea,
          targetedCompetence,
          targetedSkillsCount: targetedCompetence.skillCount,
          validatedTargetedKnowledgeElementsCount:
            validatedTargetedKnowledgeElementsCountByCompetenceId[targetedCompetence.id],
        });
      });
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAssessmentParticipationResult;
