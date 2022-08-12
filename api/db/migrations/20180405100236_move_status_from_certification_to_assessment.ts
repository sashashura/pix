// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'batch'.
const { batch } = require('../batch-processing');

const TABLE_NAME_CERTIFICATION = 'certification-courses';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME_ASSESSMENTS = 'assessments';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex.schema
    // Add Column
    .table(TABLE_NAME_ASSESSMENTS, function (table: $TSFixMe) {
      table.text('state');
      table.index('state');
    })
    .then(() => knex(TABLE_NAME_CERTIFICATION).select('id', 'status'))

    // Put certification status in assessments.status
    .then((allCertificationStatus: $TSFixMe) => {
      return batch(knex, allCertificationStatus, (certification: $TSFixMe) => {
        return knex(TABLE_NAME_ASSESSMENTS).where('courseId', '=', certification.id).update({
          state: certification.status,
        });
      });
    })
    // Get assessment without status
    .then(() => knex(TABLE_NAME_ASSESSMENTS).select('id', 'state', 'pixScore').where('state', null))
    .then((allAssessments: $TSFixMe) => {
      return batch(knex, allAssessments, (assessment: $TSFixMe) => {
        const state = assessment.pixScore === null ? 'started' : 'completed';
        return knex(TABLE_NAME_ASSESSMENTS).where('id', '=', assessment.id).update({
          state: state,
        });
      });
    })

    // Add status to assessments
    .then(() => {
      return knex.schema.table(TABLE_NAME_CERTIFICATION, function (table: $TSFixMe) {
        table.dropColumn('status');
        table.dropColumn('rejectionReason');
      });
    });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  // Add Column
  return knex.schema
    .table(TABLE_NAME_CERTIFICATION, function (table: $TSFixMe) {
      table.text('status');
      table.text('rejectionReason');
    })
    .then(() => {
      // Get certifications Status

      return knex(TABLE_NAME_ASSESSMENTS).select('id', 'courseId', 'state').where('type', '=', 'CERTIFICATION');
    })
    .then((allAssessmentForCertification: $TSFixMe) => {
      // Put certification status in assessments.status
      return batch(knex, allAssessmentForCertification, (assessment: $TSFixMe) => {
        return knex(TABLE_NAME_CERTIFICATION).where('id', '=', assessment.courseId).update({
          status: assessment.state,
        });
      });
    })
    .then(() => {
      return knex.schema.table(TABLE_NAME_ASSESSMENTS, function (table: $TSFixMe) {
        table.dropColumn('state');
      });
    });
};
