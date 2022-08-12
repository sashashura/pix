// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'batch'.
const { batch } = require('../batch-processing');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME_MARKS = 'marks';
const TABLE_NAME_COMPETENCE_MARKS = 'competence-marks';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME_ASSESSMENT_RESULTS = 'assessment-results';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex(TABLE_NAME_MARKS)
    .select('id', 'level', 'score', 'area_code', 'competence_code', 'assessmentResultId')
    .then((allMarks: $TSFixMe) => {
      return batch(knex, allMarks, (mark: $TSFixMe) => {
        return knex(TABLE_NAME_COMPETENCE_MARKS).insert({
          level: mark.level,
          score: mark.score,
          area_code: mark.area_code,
          competence_code: mark.competence_code,
          assessmentResultId: mark.assessmentResultId,
        });
      });
    })
    .then(() => knex.schema.dropTable(TABLE_NAME_MARKS));
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema
    .createTable(TABLE_NAME_MARKS, (t: $TSFixMe) => {
      t.increments().primary();
      t.integer('level').unsigned();
      t.integer('score').unsigned();
      t.text('area_code').notNull();
      t.text('competence_code').notNull();
      t.integer('assessmentId').unsigned().references('assessments.id');
      t.integer('assessmentResultId').unsigned();
    })
    .then(() =>
      knex(TABLE_NAME_COMPETENCE_MARKS).select('id', 'level', 'score', 'area_code', 'competence_code', 'correctionId')
    )
    .then((allMarks: $TSFixMe) => {
      return batch(knex, allMarks, (mark: $TSFixMe) => {
        return knex(TABLE_NAME_MARKS).insert({
          level: mark.level,
          score: mark.score,
          area_code: mark.area_code,
          competence_code: mark.competence_code,
          assessmentResultId: mark.assessmentResultId,
        });
      });
    })
    .then(() => knex(TABLE_NAME_ASSESSMENT_RESULTS).select('id', 'assessmentId'))
    .then((allAssessmentResults: $TSFixMe) => {
      return batch(knex, allAssessmentResults, (result: $TSFixMe) => {
        return knex(TABLE_NAME_MARKS).where('assessmentResultId', '=', result.id).update({
          assessmentId: result.assessmentResultId,
        });
      });
    });
};
