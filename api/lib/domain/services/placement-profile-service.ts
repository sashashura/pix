// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCompet... Remove this comment to see the full error message
const UserCompetence = require('../models/UserCompetence');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PlacementP... Remove this comment to see the full error message
const PlacementProfile = require('../models/PlacementProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../../infrastructure/repositories/skill-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultRepository = require('../../infrastructure/repositories/assessment-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('../../infrastructure/repositories/competence-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('./scoring/scoring-service');

async function getPlacementProfile({
  userId,
  limitDate,
  isV2Certification = true,
  allowExcessPixAndLevels = true,
  locale
}: $TSFixMe) {
  const pixCompetences = await competenceRepository.listPixCompetencesOnly({ locale });
  if (isV2Certification) {
    return _generatePlacementProfileV2({
      userId,
      profileDate: limitDate,
      competences: pixCompetences,
      allowExcessPixAndLevels,
    });
  }
  return _generatePlacementProfileV1({ userId, profileDate: limitDate, competences: pixCompetences });
}

async function _createUserCompetencesV1({
  competences,
  userLastAssessments,
  limitDate
}: $TSFixMe) {
  return bluebird.mapSeries(competences, async (competence: $TSFixMe) => {
    const assessment = _.find(userLastAssessments, { competenceId: competence.id });
    let estimatedLevel = 0;
    let pixScore = 0;
    if (assessment) {
      const assessmentResultLevelAndPixScore =
        await assessmentResultRepository.findLatestLevelAndPixScoreByAssessmentId({
          assessmentId: assessment.id,
          limitDate,
        });
      estimatedLevel = assessmentResultLevelAndPixScore.level;
      pixScore = assessmentResultLevelAndPixScore.pixScore;
    }
    return new UserCompetence({
      id: competence.id,
      area: competence.area,
      index: competence.index,
      name: competence.name,
      estimatedLevel,
      pixScore,
    });
  });
}

async function _generatePlacementProfileV1({
  userId,
  profileDate,
  competences
}: $TSFixMe) {
  const placementProfile = new PlacementProfile({
    userId,
    profileDate,
  });
  const userLastAssessments = await assessmentRepository.findLastCompletedAssessmentsForEachCompetenceByUser(
    placementProfile.userId,
    placementProfile.profileDate
  );
  placementProfile.userCompetences = await _createUserCompetencesV1({
    competences,
    userLastAssessments,
    limitDate: placementProfile.profileDate,
  });

  return placementProfile;
}

function _createUserCompetencesV2({
  knowledgeElementsByCompetence,
  competences,
  allowExcessPixAndLevels = true,
  skills = []
}: $TSFixMe) {
  // @ts-expect-error TS(7006): Parameter 'skill' implicitly has an 'any' type.
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]));

  return competences.map((competence: $TSFixMe) => {
    const knowledgeElementsForCompetence = knowledgeElementsByCompetence[competence.id] || [];

    const { pixScoreForCompetence, currentLevel } = scoringService.calculateScoringInformationForCompetence({
      knowledgeElements: knowledgeElementsForCompetence,
      allowExcessPix: allowExcessPixAndLevels,
      allowExcessLevel: allowExcessPixAndLevels,
    });

    const directlyValidatedCompetenceSkills = _matchingDirectlyValidatedSkillsForCompetence(
      knowledgeElementsForCompetence,
      skillMap
    );

    return new UserCompetence({
      id: competence.id,
      area: competence.area,
      index: competence.index,
      name: competence.name,
      estimatedLevel: currentLevel,
      pixScore: pixScoreForCompetence,
      skills: directlyValidatedCompetenceSkills,
    });
  });
}

async function _generatePlacementProfileV2({
  userId,
  profileDate,
  competences,
  allowExcessPixAndLevels
}: $TSFixMe) {
  const placementProfile = new PlacementProfile({
    userId,
    profileDate,
  });

  const knowledgeElementsByCompetence = await knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
    userId: placementProfile.userId,
    limitDate: placementProfile.profileDate,
  });

  const skills = await skillRepository.list();

  placementProfile.userCompetences = _createUserCompetencesV2({
    knowledgeElementsByCompetence,
    competences,
    allowExcessPixAndLevels,
    skills,
  });

  return placementProfile;
}

async function getPlacementProfilesWithSnapshotting({
  userIdsAndDates,
  competences,
  allowExcessPixAndLevels = true
}: $TSFixMe) {
  const knowledgeElementsByUserIdAndCompetenceId =
    await knowledgeElementRepository.findSnapshotGroupedByCompetencesForUsers(userIdsAndDates);

  const placementProfilesList = [];
  for (const [strUserId, knowledgeElementsByCompetence] of Object.entries(knowledgeElementsByUserIdAndCompetenceId)) {
    const userId = parseInt(strUserId);
    const placementProfile = new PlacementProfile({
      userId,
      profileDate: userIdsAndDates[userId],
    });

    placementProfile.userCompetences = _createUserCompetencesV2({
      knowledgeElementsByCompetence,
      competences,
      allowExcessPixAndLevels,
    });

    placementProfilesList.push(placementProfile);
  }

  return placementProfilesList;
}

function _matchingDirectlyValidatedSkillsForCompetence(knowledgeElementsForCompetence: $TSFixMe, skillMap: $TSFixMe) {
  const competenceSkills = knowledgeElementsForCompetence
    .filter((ke: $TSFixMe) => ke.isDirectlyValidated())
    .map((ke: $TSFixMe) => {
      return skillMap.get(ke.skillId);
    });

  return _.compact(competenceSkills);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getPlacementProfile,
  getPlacementProfilesWithSnapshotting,
};
