// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../lib/domain/models/AuthenticationMethod');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.up = function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    'INSERT INTO "authentication-methods"("userId", "externalIdentifier", "identityProvider") ' +
      'SELECT id AS "userId", "samlId" AS "externalIdentifier", \'GAR\' AS "identityProvider" FROM users WHERE "samlId" IS NOT NULL'
  );
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.down = async function (knex: $TSFixMe) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(
    'UPDATE users SET "samlId" = ' +
      '(SELECT "externalIdentifier" FROM "authentication-methods" WHERE "authentication-methods"."userId" = users.id AND "authentication-methods"."identityProvider" = \'GAR\')'
  );

  return await knex('authentication-methods')
    .where({ identityProvider: AuthenticationMethod.identityProviders.GAR })
    .delete();
};
