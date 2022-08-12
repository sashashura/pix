// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'batch'.
const { batch } = require('../batch-processing');

const TABLE_NAME_ASSESSMENT_RESULT = 'assessment-results';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME_ASSESSMENTS = 'assessments';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex(TABLE_NAME_ASSESSMENTS)
    .select('id', 'type', 'createdAt', 'pixScore', 'estimatedLevel')
    .where('state', '!=', 'started')
    .then((allAssessments: $TSFixMe) => {
      return batch(knex, allAssessments, (assessment: $TSFixMe) => {
        return knex(TABLE_NAME_ASSESSMENT_RESULT).insert({
          createdAt: assessment.createdAt,
          level: assessment.estimatedLevel,
          pixScore: assessment.pixScore,
          emitter: 'PIX-ALGO',
          commentForJury: 'Computed',
          assessmentId: assessment.id,
          status: 'validated',
        });
      });
    })
    .then(() => {
      return knex.schema.table(TABLE_NAME_ASSESSMENTS, function (table: $TSFixMe) {
        table.dropColumn('pixScore');
        table.dropColumn('estimatedLevel');
      });
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema
    .table(TABLE_NAME_ASSESSMENTS, function (table: $TSFixMe) {
      table.integer('pixScore');
      table.integer('estimatedLevel');
    })
    .then(() => knex(TABLE_NAME_ASSESSMENT_RESULT).select('id', 'assessmentId', 'pixScore', 'level'))
    .then((allAssessmentResults: $TSFixMe) => {
      return batch(knex, allAssessmentResults, (result: $TSFixMe) => {
        return knex(TABLE_NAME_ASSESSMENTS).where('id', '=', result.assessmentId).update({
          estimatedLevel: result.level,
          pixScore: result.pixScore,
        });
      });
    })
    .then(() => {
      return knex(TABLE_NAME_ASSESSMENT_RESULT).delete();
    });
};
