// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCorre... Remove this comment to see the full error message
const buildCorrectAnswerAndKnowledgeElement = require('./build-correct-answer-and-knowledge-element');

const buildCorrectAnswersAndKnowledgeElementsForLearningContent = function ({
  learningContent,
  userId,
  placementDate,
  earnedPix
}: $TSFixMe) {
  const competenceIdSkillIdPairs: $TSFixMe = [];
  learningContent.forEach((area: $TSFixMe) => {
    area.competences.forEach((competence: $TSFixMe) => {
      competence.tubes.forEach((tube: $TSFixMe) => {
        tube.skills.forEach((skill: $TSFixMe) => {
          competenceIdSkillIdPairs.push({ competenceId: competence.id, skillId: skill.id });
          skill.challenges.forEach((challenge: $TSFixMe) => {
            buildCorrectAnswerAndKnowledgeElement({
              userId,
              competenceId: competence.id,
              skillId: skill.id,
              challengeId: challenge.id,
              pixValue: earnedPix,
              acquisitionDate: placementDate,
            });
          });
        });
      });
    });
  });
  return competenceIdSkillIdPairs;
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCorrectAnswersAndKnowledgeElementsForLearningContent;
