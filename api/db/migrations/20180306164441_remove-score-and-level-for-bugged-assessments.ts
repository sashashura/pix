// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'batch'.
const { batch } = require('../batch-processing');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME_ASSESSMENTS = 'assessments';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex(TABLE_NAME_ASSESSMENTS)
    .select('id', 'estimatedLevel', 'pixScore', 'type')
    .where('type', '=', 'PLACEMENT')
    .where('pixScore', '=', '0')
    .where('estimatedLevel', '>', '0')

    .then((allAssessmentsWithBuggedScore: $TSFixMe) => {
      return batch(knex, allAssessmentsWithBuggedScore, (assessment: $TSFixMe) => {
        return knex(TABLE_NAME_ASSESSMENTS).where('id', '=', assessment.id).update({
          pixScore: null,
          estimatedLevel: null,
          updatedAt: knex.fn.now(),
        });
      });
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  return;
};
