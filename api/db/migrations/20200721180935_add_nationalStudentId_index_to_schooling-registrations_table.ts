// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = (knex: $TSFixMe) => {
  return knex.raw(
    'CREATE INDEX "schooling-registrations_nationalstudentid_index" ON "schooling-registrations" ("nationalStudentId");'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = (knex: $TSFixMe) => {
  return knex.raw('DROP INDEX "schooling-registrations_nationalstudentid_index";');
};
