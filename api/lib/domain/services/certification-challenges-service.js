const _ = require('lodash');
const CertificationChallenge = require('../models/CertificationChallenge');
const {
  MAX_CHALLENGES_PER_SKILL_FOR_CERTIFICATION,
} = require('../constants');

const KnowledgeElement = require('../models/KnowledgeElement');
const challengeRepository = require('../../infrastructure/repositories/challenge-repository');
const competenceRepository = require('../../infrastructure/repositories/competence-repository');
const answerRepository = require('../../infrastructure/repositories/answer-repository');
const knowledgeElementRepository = require('../../infrastructure/repositories/knowledge-element-repository');

function _correctAnswerIds(knowledgeElementsByCompetence) {
  const knowledgeElements = KnowledgeElement.findDirectlyValidatedFromGroups(knowledgeElementsByCompetence);
  const answerIds = _.map(knowledgeElements, 'answerId');
  return answerIds;
}

module.exports = {

  async pickCertificationChallenges(placementProfile) {
    const knowledgeElementsByCompetence = await knowledgeElementRepository
      .findUniqByUserIdGroupedByCompetenceId({
        userId: placementProfile.userId,
        limitDate: placementProfile.profileDate
      });
    const answerIds = _correctAnswerIds(knowledgeElementsByCompetence);
    const challengeIdsCorrectlyAnswered = await answerRepository.findChallengeIdsFromAnswerIds(answerIds);

    const allChallenges = await challengeRepository.findFrenchFranceOperative();
    const pixCompetences = await competenceRepository.listPixCompetencesOnly();

    const learningContentForCertificationCandidate = LearningContentForCertificationCandidate.from({
      allFrenchFranceOperativeChallenges: allChallenges,
      pixCompetences,
      allCorrectlyAnsweredChallengeIds: challengeIdsCorrectlyAnswered,
      placementProfile
    });
    return learningContentForCertificationCandidate.pickCertificationChallenges();
  },
};

class LearningContentForCertificationCandidate {
  constructor(learningContent) {
    this._learningContent = learningContent;
  }

  pickCertificationChallenges() {
    const pickedCertificationChallengesByCompetenceId = {};
    _.forEach(this._learningContent, (skills, competenceId) => {
      skills.forEach((skill) => {
        const alreadyPickedChallengesByCompetence = pickedCertificationChallengesByCompetenceId[competenceId] || [];
        if (alreadyPickedChallengesByCompetence.length < MAX_CHALLENGES_PER_SKILL_FOR_CERTIFICATION) {
          const pickedChallenge = this._pickRandomChallengeForSkill(skill);
          if (!this._hasChallengeAlreadyBeenPicked(alreadyPickedChallengesByCompetence, pickedChallenge)) {
            alreadyPickedChallengesByCompetence.push(
              new CertificationChallenge({
                challengeId: pickedChallenge.id,
                competenceId: skill.competenceId,
                associatedSkillName: skill.name,
                associatedSkillId: skill.id
              })
            );
            pickedCertificationChallengesByCompetenceId[competenceId] = alreadyPickedChallengesByCompetence;
          }
        }
      });
    });
    return _.flatMap(pickedCertificationChallengesByCompetenceId, (challenges) => challenges);
  }

  _hasChallengeAlreadyBeenPicked(alreadyPickedChallengesByCompetence, pickedChallenge) {
    return alreadyPickedChallengesByCompetence.map((pickedChallenges) => pickedChallenges.challengeId).includes(pickedChallenge.id);
  }

  _pickRandomChallengeForSkill(skill) {
    const unansweredChallenges = this._unansweredChallengesForSkill(skill);
    let pickedChallenge = undefined;
    if (!_.isEmpty(unansweredChallenges)) {
      pickedChallenge = this._pickRandomChallengeFrom(unansweredChallenges);
    } else {
      pickedChallenge = this._pickRandomChallengeFrom(skill.challenges);
    }
    return pickedChallenge;
  }

  _pickRandomChallengeFrom(challenges) {
    return _.sample(challenges);
  }

  _unansweredChallengesForSkill(skill) {
    return skill.challenges.filter((challenge) => !challenge.hasBeenCorrectlyAnsweredByCandidateDuringPlacement);
  }

  static from({
    allCorrectlyAnsweredChallengeIds,
    allFrenchFranceOperativeChallenges,
    pixCompetences,
    placementProfile
  }) {
    const allCertificationChallenges = this._allCertificationChallenges(pixCompetences, allFrenchFranceOperativeChallenges);
    const certificationChallengesCorrectlyAnsweredByCandidate = this._certificationChallengesCorrectlyAnsweredByCandidate(allCertificationChallenges, allCorrectlyAnsweredChallengeIds);
    const certifiableCompetenceIds = this._certifiableCompetenceIds(placementProfile);
    const testableSkills = this._testableSkills(certificationChallengesCorrectlyAnsweredByCandidate, certifiableCompetenceIds);

    const skillsByCompetenceIdOrderedByDescendingSkillDifficulty = this._groupByCompetenceIdAndDescendingDifficulty(testableSkills);

    const challengesBySkillByCompetenceId = this._populateWithCertificationChallenges(
      skillsByCompetenceIdOrderedByDescendingSkillDifficulty,
      allCertificationChallenges,
      allCorrectlyAnsweredChallengeIds
    );

    return new LearningContentForCertificationCandidate(challengesBySkillByCompetenceId);
  }

  static _populateWithCertificationChallenges(skillsByCompetenceIdOrderedByDescendingSkillDifficulty, allCertificationChallenges, allCorrectlyAnsweredChallengeIds) {
    return _(skillsByCompetenceIdOrderedByDescendingSkillDifficulty)
      .mapValues((skills) => skills.map((skill) => {
        const mutatedSkill = _.cloneDeep(skill);
        const skillRelatedChallenges = _.filter(allCertificationChallenges, (challenge) => _.map(challenge.skills, 'id').includes(mutatedSkill.id));
        const skillRelatedChallengesWithIsAnsweredFlag = _.map(skillRelatedChallenges, (challenge) => {
          const mutatedChallenge = _.cloneDeep(challenge);
          mutatedChallenge.hasBeenCorrectlyAnsweredByCandidateDuringPlacement = _.some(allCorrectlyAnsweredChallengeIds, (correctlyAnsweredChallengeId) => correctlyAnsweredChallengeId === challenge.id);
          return mutatedChallenge;
        });
        mutatedSkill.challenges = skillRelatedChallengesWithIsAnsweredFlag;
        return mutatedSkill;
      })).value();
  }

  static _groupByCompetenceIdAndDescendingDifficulty(testableSkills) {
    return _(testableSkills)
      .groupBy((skill) => skill.competenceId)
      .mapValues((skills) => _.orderBy(skills, ['difficulty'], ['desc']))
      .value();
  }

  static _testableSkills(certificationChallengesCorrectlyAnsweredByCandidate, certifiableCompetenceIds) {
    return _(certificationChallengesCorrectlyAnsweredByCandidate)
      .flatMap((challenge) => challenge.skills)
      .uniqBy((skill) => skill.id)
      .filter((skill) => certifiableCompetenceIds.includes(skill.competenceId))
      .value();
  }

  static _certifiableCompetenceIds(placementProfile) {
    return _(placementProfile.userCompetences)
      .filter((userCompetence) => userCompetence.isCertifiable())
      .map((userCompetence) => userCompetence.id)
      .value();
  }

  static _certificationChallengesCorrectlyAnsweredByCandidate(allCertificationChallenges, allCorrectlyAnsweredChallengeIds) {
    const certificationChallengesCorrectlyAnsweredByCandidate = _(allCertificationChallenges)
      .filter((challenge) => allCorrectlyAnsweredChallengeIds.includes(challenge.id))
      .value();
    return certificationChallengesCorrectlyAnsweredByCandidate;
  }

  // TODO : move to challengeRepository.findFrenchFranceOperativeByCompetenceIds([competenceIds])
  static _allCertificationChallenges(pixCompetences, allFrenchFranceOperativeChallenges) {
    const pixCompetenceIds = pixCompetences.map((pixCompetence) => pixCompetence.id);
    const allCertificationChallenges = _(allFrenchFranceOperativeChallenges)
      .filter((challenge) => pixCompetenceIds.includes(challenge.competenceId))
      .value();
    return allCertificationChallenges;
  }
}

