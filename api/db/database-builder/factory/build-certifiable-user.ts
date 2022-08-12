// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAsses... Remove this comment to see the full error message
const buildAssessment = require('./build-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAnswe... Remove this comment to see the full error message
const buildAnswer = require('./build-answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildKnowl... Remove this comment to see the full error message
const buildKnowledgeElement = require('./build-knowledge-element');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCertifiableUser({
  competencesAssociatedSkillsAndChallenges,
  limitDate
}: $TSFixMe) {
  const certifiableUser = buildUser();
  const assessmentId = buildAssessment({ userId: certifiableUser.id }).id;
  const commonUserIdAssessmentIdAndEarnedPixForAllKEs = { userId: certifiableUser.id, assessmentId, earnedPix: 4 };
  competencesAssociatedSkillsAndChallenges.forEach((element: $TSFixMe) => {
    const { challengeId, competenceId } = element;
    const answerId = buildAnswer({ assessmentId, challengeId }).id;
    buildKnowledgeElement({
      ...commonUserIdAssessmentIdAndEarnedPixForAllKEs,
      competenceId,
      answerId,
      createdAt: limitDate,
    });
  });

  return certifiableUser;
};
