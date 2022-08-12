// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAnswe... Remove this comment to see the full error message
const buildAnswer = require('./build-answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildKnowl... Remove this comment to see the full error message
const buildKnowledgeElement = require('./build-knowledge-element');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCorre... Remove this comment to see the full error message
const buildCorrectAnswerAndKnowledgeElement = async function ({
  userId,
  competenceId,
  challengeId,
  pixValue,
  acquisitionDate,
  skillId
}: $TSFixMe) {
  const assessmentId = buildAssessment({ userId }).id;
  const answerId = buildAnswer({
    assessmentId,
    challengeId,
  }).id;
  buildKnowledgeElement({
    userId,
    assessmentId,
    earnedPix: pixValue,
    competenceId,
    answerId,
    createdAt: acquisitionDate,
    skillId,
  });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildCorrectAnswerAndKnowledgeElement;
