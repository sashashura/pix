// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('./helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userToCrea... Remove this comment to see the full error message
const userToCreateRepository = require('../lib/infrastructure/repositories/user-to-create-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../lib/infrastructure/repositories/authentication-method-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userServic... Remove this comment to see the full error message
const userService = require('../lib/domain/services/user-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encryption... Remove this comment to see the full error message
const encryptionService = require('../lib/domain/services/encryption-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prepareDat... Remove this comment to see the full error message
function prepareDataForInsert(rawUsers: $TSFixMe) {
  return rawUsers.map(({
    firstName,
    lastName,
    email,
    password
  }: $TSFixMe) => {
    return {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createUser... Remove this comment to see the full error message
async function createUsers({
  usersInRaw
}: $TSFixMe) {
  const now = new Date();
  await bluebird.mapSeries(usersInRaw, async (userDTO: $TSFixMe) => {
    const userToCreate = {
      firstName: userDTO.firstName,
      lastName: userDTO.lastName,
      email: userDTO.email,
      createAt: now,
      updatedAt: now,
      cgu: true,
      lang: 'fr',
    };
    const hashedPassword = await encryptionService.hashPassword(userDTO.password);

    await userService.createUserWithPassword({
      user: userToCreate,
      hashedPassword,
      userToCreateRepository,
      authenticationMethodRepository,
    });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting creating users accounts for contest.');

  try {
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    const filePath = process.argv[2];

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Reading and parsing csv data file... ');
    const csvData = await parseCsvWithHeader(filePath);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Preparing data... ');
    const usersInRaw = prepareDataForInsert(csvData);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('ok');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Creating users...');
    await createUsers({ usersInRaw });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\nDone.');
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\n', error);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
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
      process.exit(1);
    }
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  prepareDataForInsert,
  createUsers,
};
