// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'batch'.
const { batch } = require('../batch-processing');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME_ASSESSMENT_RESULTS = 'assessment-results';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME_MARKS = 'marks';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema
    .table(TABLE_NAME_MARKS, function (table: $TSFixMe) {
      table.integer('assessmentResultId').unsigned();
      table.foreign('assessmentResultId').references('assessment-results.id');
      table.index('assessmentResultId');
    })
    .then(() => {
      return knex(TABLE_NAME_ASSESSMENT_RESULTS).select('id', 'assessmentId');
    })
    .then((allAssessmentResults: $TSFixMe) => {
      return batch(knex, allAssessmentResults, (result: $TSFixMe) => {
        return knex(TABLE_NAME_MARKS).where('assessmentId', '=', result.assessmentId).update({
          assessmentResultId: result.id,
        });
      });
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME_MARKS, function (table: $TSFixMe) {
    table.dropColumn('assessmentResultId');
  });
};
