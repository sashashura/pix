// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'recommenda... Remove this comment to see the full error message
const recommendationService = require('../services/recommendation-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAn... Remove this comment to see the full error message
class CampaignAnalysis {
  campaignTubeRecommendations: $TSFixMe;
  id: $TSFixMe;
  participantCount: $TSFixMe;
  constructor({
    campaignId,
    targetProfileWithLearningContent,
    tutorials,
    participantCount = 0
  }: $TSFixMe = {}) {
    this.id = campaignId;
    this.participantCount = participantCount;
    const maxSkillLevelInTargetProfile = targetProfileWithLearningContent.maxSkillDifficulty;
    this.campaignTubeRecommendations = targetProfileWithLearningContent.tubes.map((tube: $TSFixMe) => {
      const competence = targetProfileWithLearningContent.getCompetence(tube.competenceId);
      const area = targetProfileWithLearningContent.getArea(competence.areaId);
      const tutorialIds = _.uniq(_.flatMap(tube.skills, 'tutorialIds'));
      const tubeTutorials = _.filter(tutorials, (tutorial: $TSFixMe) => tutorialIds.includes(tutorial.id));
      return new CampaignTubeRecommendation({
        campaignId: campaignId,
        area,
        competence,
        tube,
        maxSkillLevelInTargetProfile,
        tutorials: tubeTutorials,
        participantCount: this.participantCount,
      });
    });
  }

  addToTubeRecommendations({ knowledgeElementsByTube = {} }) {
    this.campaignTubeRecommendations.forEach((campaignTubeRecommendation: $TSFixMe) => {
      const tubeId = campaignTubeRecommendation.tubeId;
      if (tubeId in knowledgeElementsByTube) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        campaignTubeRecommendation.add({ knowledgeElements: knowledgeElementsByTube[tubeId] });
      }
    });
  }

  finalize() {
    this.campaignTubeRecommendations.forEach((campaignTubeRecommendation: $TSFixMe) => {
      campaignTubeRecommendation.finalize();
    });
  }
}

class CampaignTubeRecommendation {
  areaColor: $TSFixMe;
  averageScore: $TSFixMe;
  campaignId: $TSFixMe;
  competenceId: $TSFixMe;
  competenceName: $TSFixMe;
  cumulativeParticipantCount: $TSFixMe;
  cumulativeScore: $TSFixMe;
  maxSkillLevelInTargetProfile: $TSFixMe;
  participantCount: $TSFixMe;
  tube: $TSFixMe;
  tutorials: $TSFixMe;
  constructor({
    campaignId,
    area,
    tube,
    competence,
    maxSkillLevelInTargetProfile,
    tutorials,
    participantCount = 0
  }: $TSFixMe = {}) {
    this.campaignId = campaignId;
    this.tube = tube;
    this.competenceId = competence.id;
    this.competenceName = competence.name;
    this.areaColor = area.color;
    this.maxSkillLevelInTargetProfile = maxSkillLevelInTargetProfile;
    this.tutorials = tutorials;
    this.participantCount = participantCount;
    this.cumulativeScore = 0;
    this.cumulativeParticipantCount = 0;
    this.averageScore = null;
  }

  get tubeId() {
    return this.tube.id;
  }

  get tubePracticalTitle() {
    return this.tube.practicalTitle;
  }

  get tubeDescription() {
    return this.tube.description;
  }

  get id() {
    return `${this.campaignId}_${this.tubeId}`;
  }

  add({ knowledgeElements = [] }) {
    const knowledgeElementsByParticipant = _.toArray(_.groupBy(knowledgeElements, 'userId'));
    this._computeCumulativeScore(knowledgeElementsByParticipant);
    this.cumulativeParticipantCount += knowledgeElementsByParticipant.length;
  }

  finalize() {
    if (this.participantCount > 0) {
      const participantCountWithoutKnowledgeElements = this.participantCount - this.cumulativeParticipantCount;
      const emptyKnowledgeElementsByParticipant = _.times(participantCountWithoutKnowledgeElements, () => []);
      this._computeCumulativeScore(emptyKnowledgeElementsByParticipant);
      this.averageScore = this.cumulativeScore / this.participantCount;
    }
  }

  _computeCumulativeScore(knowledgeElementsByParticipant: $TSFixMe) {
    this.cumulativeScore += _(knowledgeElementsByParticipant).sumBy((knowledgeElements: $TSFixMe) => recommendationService.computeRecommendationScore(
      this.tube.skills,
      this.maxSkillLevelInTargetProfile,
      knowledgeElements
    )
    );
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignAnalysis;
