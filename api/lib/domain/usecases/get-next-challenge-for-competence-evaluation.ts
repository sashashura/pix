// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const { AssessmentEndedError, UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'smartRando... Remove this comment to see the full error message
const smartRandom = require('../services/algorithm-methods/smart-random');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dataFetche... Remove this comment to see the full error message
const dataFetcher = require('../services/algorithm-methods/data-fetcher');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getNextChallengeForCompetenceEvaluation({
  pickChallengeService,
  assessment,
  userId,
  locale
}: $TSFixMe) {
  _checkIfAssessmentBelongsToUser(assessment, userId);
  const inputValues = await dataFetcher.fetchForCompetenceEvaluations(...arguments);

  const { possibleSkillsForNextChallenge, hasAssessmentEnded } = smartRandom.getPossibleSkillsForNextChallenge({
    ...inputValues,
    locale,
  });

  if (hasAssessmentEnded) {
    throw new AssessmentEndedError();
  }

  return pickChallengeService.pickChallenge({
    skills: possibleSkillsForNextChallenge,
    randomSeed: assessment.id,
    locale: locale,
  });
};

function _checkIfAssessmentBelongsToUser(assessment: $TSFixMe, userId: $TSFixMe) {
  if (assessment.userId !== userId) {
    throw new UserNotAuthorizedToAccessEntityError();
  }
}
