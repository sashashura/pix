// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../lib/infrastructure/bookshelf');
const ERROR_RETURN_CODE = 1;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'markUsersR... Remove this comment to see the full error message
async function markUsersRequiringTermsOfServiceValidationForRevalidation() {
  const subquery = Bookshelf.knex.select('users.id').from('users').where({
    cgu: true,
  });

  const result = await Bookshelf.knex
    .table('users')
    .update({ mustValidateTermsOfService: true })
    .whereIn('id', subquery)
    .returning('id');
  return result.map(({
    id
  }: $TSFixMe) => id);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(
    'Start updating "mustValidateTermsOfService" column for some records of users table, from false to true.'
  );

  try {
    const updatedUserIds = await markUsersRequiringTermsOfServiceValidationForRevalidation();
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`Successfully updated ${updatedUserIds.length} records.`);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Done.');
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\n', error);
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    process.exit(ERROR_RETURN_CODE);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main().then(
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    () => process.exit(0),
    (err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.error(err);
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(ERROR_RETURN_CODE);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  markUsersRequiringTermsOfServiceValidationForRevalidation,
};
