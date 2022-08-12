// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'assessments';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex(TABLE_NAME)
    .where('type', 'SMART_PLACEMENT')
    .update({ type: 'CAMPAIGN', courseId: '[NOT USED] Campaign Assessment CourseId Not Used' });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  return knex(TABLE_NAME)
    .where('type', 'CAMPAIGN')
    .update({ type: 'SMART_PLACEMENT', courseId: 'Smart Placement Tests CourseId Not Used' });
};
