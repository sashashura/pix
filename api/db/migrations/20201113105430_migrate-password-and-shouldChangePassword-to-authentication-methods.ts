// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = async (knex: $TSFixMe) => {
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    'INSERT INTO "authentication-methods" ("userId", "identityProvider", "authenticationComplement") ' +
      'SELECT id AS "userId", ' +
      '\'PIX\' AS "identityProvider", ' +
      'jsonb_build_object(\'password\', "password", \'shouldChangePassword\', "shouldChangePassword") AS "authenticationComplement" ' +
      'FROM users WHERE ("password" = \'\') IS FALSE'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async (knex: $TSFixMe) => {
  const sqlRequest =
    'UPDATE users ' +
    'SET password = subquery.password, ' +
    '"shouldChangePassword" = subquery."shouldChangePassword" ' +
    'FROM ( ' +
    'SELECT ' +
    '"userId", ' +
    '"authenticationComplement" -> \'password\' AS password, ' +
    '("authenticationComplement" -> \'shouldChangePassword\')::boolean AS "shouldChangePassword" ' +
    'FROM "authentication-methods" ' +
    'WHERE "identityProvider" = \'PIX\' ' +
    ') AS subquery ' +
    'WHERE users.id = subquery."userId"; ';

  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(sqlRequest);

  return knex.raw('DELETE FROM "authentication-methods" WHERE "identityProvider" = \'PIX\';');
};
