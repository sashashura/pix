// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../domain/models/TutorialEvaluation');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'tutorial-evaluations';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async createOrUpdate({
    userId,
    tutorialId,
    status
  }: $TSFixMe) {
    const tutorialEvaluation = await knex(TABLE_NAME)
      .insert({
        userId,
        tutorialId,
        status,
      })
      .onConflict(['userId', 'tutorialId'])
      .merge({
        status,
        updatedAt: knex.fn.now(),
      })
      .returning('*');
    return _toDomain(tutorialEvaluation[0]);
  },

  async find({
    userId
  }: $TSFixMe) {
    const tutorialEvaluation = await knex(TABLE_NAME).where({ userId });
    return tutorialEvaluation.map(_toDomain);
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(tutorialEvaluationData: $TSFixMe) {
  return new TutorialEvaluation({
    id: tutorialEvaluationData.id,
    userId: tutorialEvaluationData.userId,
    tutorialId: tutorialEvaluationData.tutorialId,
    status: tutorialEvaluationData.status,
    updatedAt: tutorialEvaluationData.updatedAt,
  });
}
