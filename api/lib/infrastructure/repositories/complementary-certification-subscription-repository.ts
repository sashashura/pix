// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(complementaryCertificationSubscription: $TSFixMe) {
    return knex('complementary-certification-subscriptions').insert(complementaryCertificationSubscription);
  },
};
