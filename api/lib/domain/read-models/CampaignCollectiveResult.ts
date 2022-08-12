// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
class CampaignCollectiveResult {
  campaignCompetenceCollectiveResults: $TSFixMe;
  id: $TSFixMe;
  constructor({
    id,
    targetProfile
  }: $TSFixMe = {}) {
    this.id = id;
    const targetedCompetences = _.sortBy(targetProfile.competences, 'index');

    this.campaignCompetenceCollectiveResults = _.map(targetedCompetences, (targetedCompetence: $TSFixMe) => {
      const targetedArea = targetProfile.getAreaOfCompetence(targetedCompetence.id);
      return new CampaignCompetenceCollectiveResult({
        campaignId: id,
        targetedCompetence,
        targetedArea,
      });
    });
  }

  addValidatedSkillCountToCompetences(participantsKECountByCompetenceId: $TSFixMe) {
    _.each(this.campaignCompetenceCollectiveResults, (campaignCompetenceCollectiveResult: $TSFixMe) => {
      const competenceId = campaignCompetenceCollectiveResult.competenceId;
      if (competenceId in participantsKECountByCompetenceId) {
        campaignCompetenceCollectiveResult.addValidatedSkillCount(participantsKECountByCompetenceId[competenceId]);
      }
    });
  }

  finalize(participantCount: $TSFixMe) {
    _.each(this.campaignCompetenceCollectiveResults, (campaignCompetenceCollectiveResult: $TSFixMe) => {
      campaignCompetenceCollectiveResult.finalize(participantCount);
    });
  }
}

class CampaignCompetenceCollectiveResult {
  areaCode: $TSFixMe;
  areaColor: $TSFixMe;
  averageValidatedSkills: $TSFixMe;
  competenceId: $TSFixMe;
  competenceName: $TSFixMe;
  id: $TSFixMe;
  targetedSkillsCount: $TSFixMe;
  validatedSkillCount: $TSFixMe;
  constructor({
    campaignId,
    targetedArea,
    targetedCompetence
  }: $TSFixMe = {}) {
    this.areaCode = targetedCompetence.index.split('.')[0];
    this.competenceId = targetedCompetence.id;
    this.id = `${campaignId}_${this.competenceId}`;
    this.competenceName = targetedCompetence.name;
    this.areaColor = targetedArea.color;
    this.targetedSkillsCount = targetedCompetence.skillCount;
    this.validatedSkillCount = 0;
    this.averageValidatedSkills = 0;
  }

  addValidatedSkillCount(validatedSkillCount: $TSFixMe) {
    this.validatedSkillCount += validatedSkillCount;
  }

  finalize(participantCount: $TSFixMe) {
    if (participantCount) {
      this.averageValidatedSkills = this.validatedSkillCount / participantCount;
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignCollectiveResult;
