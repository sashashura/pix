const { knex } = require('../db/knex-database-connection');
const { _do } = require('./generate-campaign-with-participants');
const faker = require('faker');
const _ = require('lodash');

async function main() {
  try {
    const organizationCount = process.argv[2];

    for (let index = 0; index < organizationCount; index++) {
      const [organizationId] = await knex('organizations').
        returning('id').
        insert({ name: `Organization ${index}`, type: 'SCO', isManagingStudents: true });

      const firstName = faker.name.firstName();
      const lastName = faker.name.firstName();
      const [id] = await knex('users').returning('id').insert({ firstName, lastName, email: `${firstName}.${lastName}@example.net`, password: '' });
      await knex('memberships').insert({ userId: id, organizationId, organizationRole: 'ADMIN' });

      await _do({ organizationId, participantCount: 1000, profileType: 'medium', campaignType: 'assessment' });
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    },
  );
}

