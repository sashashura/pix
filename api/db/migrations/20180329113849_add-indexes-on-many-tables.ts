// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Promise'.
const Promise = require('bluebird');

const indexes = {
  answers: ['assessmentId'],
  assessments: ['type'],
  'certification-challenges': ['courseId'],
  feedbacks: ['assessmentId'],
  marks: ['assessmentId'],
  snapshots: ['organizationId'],
};
// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  const promises = Object.keys(indexes).map((tableForIndexes) => {
    return knex.schema.table(tableForIndexes, (table: $TSFixMe) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      indexes[tableForIndexes].forEach((column: $TSFixMe) => table.index(column));
    });
  });
  return Promise.all(promises);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (knex: $TSFixMe) {
  const promises = Object.keys(indexes).map((tableForIndexes) => {
    return knex.schema.table(tableForIndexes, (table: $TSFixMe) => {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      indexes[tableForIndexes].forEach((column: $TSFixMe) => table.dropIndex(column));
    });
  });
  return Promise.all(promises);
};
