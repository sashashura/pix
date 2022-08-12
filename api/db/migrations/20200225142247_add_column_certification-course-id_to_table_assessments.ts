// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'assessments';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'COLUMN_NAM... Remove this comment to see the full error message
const COLUMN_NAME = 'certificationCourseId';
const REFERENCE = 'certification-courses.id';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async function (knex: $TSFixMe) {
  await knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.integer(COLUMN_NAME).unsigned().references(REFERENCE).index();
  });
  return knex.raw(
    `
      UPDATE ??
      SET ?? = CAST(?? AS INTEGER)
      FROM ??
      WHERE ?? = CAST(?? AS VARCHAR) 
      AND ?? = ?
    `,
    [
      'assessments',
      'certificationCourseId',
      'courseId',
      'certification-courses',
      'assessments.courseId',
      'certification-courses.id',
      'assessments.type',
      'CERTIFICATION',
    ]
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex.schema.table(TABLE_NAME, (table: $TSFixMe) => {
    table.dropColumn(COLUMN_NAME);
  });
};
