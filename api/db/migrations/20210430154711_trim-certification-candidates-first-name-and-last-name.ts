// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    'UPDATE "certification-candidates"' +
      'SET "firstName" = TRIM("firstName"), "lastName" = TRIM("lastName")' +
      'WHERE "firstName" LIKE \'% \' OR "firstName" LIKE \' %\'' +
      ' OR "lastName" LIKE \'% \' OR "lastName" LIKE \' %\''
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = function () {
  return;
};
