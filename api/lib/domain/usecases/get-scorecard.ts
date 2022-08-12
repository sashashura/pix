// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../models/Scorecard');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getScorecard({
  authenticatedUserId,
  scorecardId,
  scorecardService,
  competenceRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  locale
}: $TSFixMe) {
  const { userId, competenceId } = Scorecard.parseId(scorecardId);

  if (authenticatedUserId !== userId) {
    throw new UserNotAuthorizedToAccessEntityError();
  }

  return scorecardService.computeScorecard({
    userId: authenticatedUserId,
    competenceId,
    competenceRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    locale,
  });
};
