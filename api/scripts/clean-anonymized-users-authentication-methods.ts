'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('./helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../lib/infrastructure/repositories/authentication-method-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cleanAnony... Remove this comment to see the full error message
async function cleanAnonymizedAuthenticationMethods({
  arrayOfAnonymizedUsersIds
}: $TSFixMe) {
  const anonymizedUserIdsWithAuthenticationMethodsDeleted: $TSFixMe = [];
  await bluebird.mapSeries(arrayOfAnonymizedUsersIds, async (userId: $TSFixMe) => {
    const numberOfRowDeleted = await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({
      userId,
    });
    if (numberOfRowDeleted > 0) {
      anonymizedUserIdsWithAuthenticationMethodsDeleted.push(userId);
    }
  });
  return anonymizedUserIdsWithAuthenticationMethodsDeleted;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('Starting deleting anonymized users authentication methods');

  try {
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    const filePath = process.argv[2];

    const anonymizedUsersIds = await parseCsvWithHeader(filePath);
    const arrayOfAnonymizedUsersIds = _(anonymizedUsersIds)
      .map((user: $TSFixMe) => user.ID)
      .filter((userId: $TSFixMe) => !_.isNil(userId))
      .value();

    if (arrayOfAnonymizedUsersIds.length < 1) {
      throw new Error('ID column must be present in CSV');
    }
    const anonymizedUserIdsWithAllAuthenticationMethodsDeleted = await cleanAnonymizedAuthenticationMethods({
      arrayOfAnonymizedUsersIds,
    });

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(
      "\nDone. Here the list of user's id which authentication methods were deleted : ",
      anonymizedUserIdsWithAllAuthenticationMethodsDeleted
    );
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(error);

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
module.exports = { cleanAnonymizedAuthenticationMethods };
