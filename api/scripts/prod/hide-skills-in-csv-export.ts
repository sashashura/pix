// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'hideSkills... Remove this comment to see the full error message
async function hideSkills() {
  await knex('organizations').where('showSkills', true).update({ showSkills: false });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  hideSkills,
};

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  hideSkills()
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    .then(() => process.exit(0))
    .catch((err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
      process.exit(1);
    });
}
