// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../models/Scorecard');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserProfile({
  userId,
  competenceRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  locale
}: $TSFixMe) {
  const [knowledgeElementsGroupedByCompetenceId, competencesWithArea, competenceEvaluations] = await Promise.all([
    knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({ userId }),
    competenceRepository.listPixCompetencesOnly({ locale }),
    competenceEvaluationRepository.findByUserId(userId),
  ]);

  const scorecards = _.map(competencesWithArea, (competence: $TSFixMe) => {
    const competenceId = competence.id;
    const knowledgeElementsForCompetence = knowledgeElementsGroupedByCompetenceId[competenceId];
    const competenceEvaluation = _.find(competenceEvaluations, { competenceId });

    return Scorecard.buildFrom({
      userId,
      knowledgeElements: knowledgeElementsForCompetence,
      competence,
      competenceEvaluation,
    });
  });

  const pixScore = _.sumBy(scorecards, 'earnedPix');

  return {
    id: userId,
    pixScore,
    scorecards,
  };
};
