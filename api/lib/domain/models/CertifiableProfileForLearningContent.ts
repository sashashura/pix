// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('./KnowledgeElement');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certifiabl... Remove this comment to see the full error message
class CertifiableProfileForLearningContent {
  resultsByArea: $TSFixMe;
  resultsByCompetence: $TSFixMe;
  skillResults: $TSFixMe;
  constructor({
    targetProfileWithLearningContent,
    knowledgeElements,
    answerAndChallengeIdsByAnswerId
  }: $TSFixMe) {
    this.skillResults = [];
    for (const knowledgeElement of knowledgeElements) {
      const targetedSkill = targetProfileWithLearningContent.findSkill(knowledgeElement.skillId);
      if (targetedSkill) {
        this.skillResults.push(
          new SkillResult({
            skillId: targetedSkill.id,
            tubeId: targetedSkill.tubeId,
            difficulty: targetedSkill.difficulty,
            createdAt: knowledgeElement.createdAt,
            source: knowledgeElement.source,
            status: knowledgeElement.status,
            earnedPix: knowledgeElement.earnedPix,
            answerId: knowledgeElement.answerId,
            assessmentId: knowledgeElement.assessmentId,
            challengeId: answerAndChallengeIdsByAnswerId[knowledgeElement.answerId].challengeId,
          })
        );
      }
    }

    const skillResultsByCompetenceId = {};
    const skillResultsGroupedByTubeId = _.groupBy(this.skillResults, 'tubeId');
    for (const [tubeId, skillResults] of Object.entries(skillResultsGroupedByTubeId)) {
      const targetedTube = targetProfileWithLearningContent.findTube(tubeId);
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (!skillResultsByCompetenceId[targetedTube.competenceId])
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        skillResultsByCompetenceId[targetedTube.competenceId] = [];
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      skillResultsByCompetenceId[targetedTube.competenceId] = [
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        ...skillResultsByCompetenceId[targetedTube.competenceId],
        // @ts-expect-error TS(2488): Type 'unknown' must have a '[Symbol.iterator]()' m... Remove this comment to see the full error message
        ...skillResults,
      ];
    }

    this.resultsByCompetence = [];
    for (const [competenceId, skillResults] of Object.entries(skillResultsByCompetenceId)) {
      const targetedCompetence = targetProfileWithLearningContent.getCompetence(competenceId);
      this.resultsByCompetence.push(
        new ResultByCompetence({
          competenceId: targetedCompetence.id,
          areaId: targetedCompetence.areaId,
          origin: targetedCompetence.origin,
          skillResults,
        })
      );
    }

    this.resultsByArea = [];
    const resultsByCompetenceGroupedByAreaId = _.groupBy(this.resultsByCompetence, 'areaId');
    for (const [areaId, resultsByCompetence] of Object.entries(resultsByCompetenceGroupedByAreaId)) {
      const targetedArea = targetProfileWithLearningContent.getArea(areaId);
      this.resultsByArea.push(
        new ResultByArea({
          areaId: targetedArea.id,
          resultsByCompetence,
        })
      );
    }
  }

  getOrderedCertifiableSkillsByAreaId(excludedOrigins = []) {
    const skillIdsByAreaId = {};
    for (const resultByArea of this.resultsByArea) {
      const certifiableSkillsForArea = this._getCertifiableSkillsForArea(resultByArea, excludedOrigins);
      const certifiableOrderedSkillsInArea = this._orderSkillsByDecreasingDifficulty(certifiableSkillsForArea);
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      skillIdsByAreaId[resultByArea.areaId] = _.map(certifiableOrderedSkillsInArea, 'skillId');
    }

    return skillIdsByAreaId;
  }

  _getCertifiableSkillsForArea(resultByArea: $TSFixMe, excludedOrigins: $TSFixMe) {
    return _.flatMap(resultByArea.resultsByCompetence, (resultByCompetence: $TSFixMe) => {
      if (resultByCompetence.isNotInOrigins(excludedOrigins)) {
        return resultByCompetence.getDirectlyValidatedSkills();
      }
      return [];
    });
  }

  _orderSkillsByDecreasingDifficulty(skills: $TSFixMe) {
    return _(skills).sortBy('difficulty').reverse().value();
  }

  getAlreadyAnsweredChallengeIds() {
    return _(this.skillResults).filter('isDirectlyValidated').map('challengeId').uniq().value();
  }
}

class SkillResult {
  answerId: $TSFixMe;
  assessmentId: $TSFixMe;
  challengeId: $TSFixMe;
  createdAt: $TSFixMe;
  difficulty: $TSFixMe;
  earnedPix: $TSFixMe;
  skillId: $TSFixMe;
  source: $TSFixMe;
  status: $TSFixMe;
  tubeId: $TSFixMe;
  constructor({
    skillId,
    tubeId,
    difficulty,
    createdAt,
    source,
    status,
    earnedPix,
    answerId,
    assessmentId,
    challengeId
  }: $TSFixMe) {
    this.skillId = skillId;
    this.tubeId = tubeId;
    this.difficulty = difficulty;
    this.createdAt = createdAt;
    this.source = source;
    this.status = status;
    this.earnedPix = earnedPix;
    this.answerId = answerId;
    this.assessmentId = assessmentId;
    this.challengeId = challengeId;
  }

  get isDirectlyValidated() {
    return this.source === KnowledgeElement.SourceType.DIRECT && this.status === KnowledgeElement.StatusType.VALIDATED;
  }
}

class ResultByCompetence {
  areaId: $TSFixMe;
  competenceId: $TSFixMe;
  origin: $TSFixMe;
  skillResults: $TSFixMe;
  constructor({
    competenceId,
    areaId,
    origin,
    skillResults = []
  }: $TSFixMe) {
    this.competenceId = competenceId;
    this.areaId = areaId;
    this.origin = origin;
    this.skillResults = skillResults;
  }

  isNotInOrigins(origins = []) {
    // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
    return !origins.includes(this.origin);
  }

  getDirectlyValidatedSkills() {
    return _.filter(this.skillResults, 'isDirectlyValidated');
  }
}

class ResultByArea {
  areaId: $TSFixMe;
  resultsByCompetence: $TSFixMe;
  constructor({
    areaId,
    resultsByCompetence = []
  }: $TSFixMe) {
    this.areaId = areaId;
    this.resultsByCompetence = resultsByCompetence;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertifiableProfileForLearningContent;
