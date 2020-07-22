const { knex } = require('../db/knex-database-connection');
const { _do } = require('./generate-campaign-with-participants');
const _ = require('lodash');

async function main() {

  const organizationCount = process.argv[2];

  return _.times(parseInt(organizationCount), async function(index) {

    try {
      console.log('Before');
      const [organizationId] = await knex('organizations')
        .returning('id')
        .insert({ name: `Organization ${index}`, type: 'SCO', isManagingStudents: true });
      console.log('organizationId', organizationId);

      await _do({ organizationId, participantCount: 1000, profileType: 'medium', campaignType: 'assessment' });
    } catch (e) {
      console.log(e);
    }
  });
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

