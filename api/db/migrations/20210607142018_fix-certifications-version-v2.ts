// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'certification-courses';

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  return knex(TABLE_NAME).where('createdAt', '>', '2021-01-01').andWhere('isV2Certification', false).update({
    isV2Certification: true,
  });
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function (_: $TSFixMe) {
  // un rollback serait contre-productif
  return Promise.resolve();
};
