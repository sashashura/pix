#! /usr/bin/env node
/* eslint no-console: ["off"] */
'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config();
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'yargs'.
const yargs = require('yargs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationRepository = require('../../lib/infrastructure/repositories/certification-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'verifyCert... Remove this comment to see the full error message
const verifyCertificateCodeService = require('../../lib/domain/services/verify-certificate-code-service');
const uniqueConstraintViolationCode = '23505';
const DEFAULT_COUNT = 20000;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_CO... Remove this comment to see the full error message
const DEFAULT_CONCURRENCY = 1;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'progressio... Remove this comment to see the full error message
let progression = 0;
function _logProgression(totalCount: $TSFixMe) {
  ++progression;
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  process.stdout.cursorTo(0);
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  process.stdout.write(`${Math.round((progression * 100) / totalCount, 2)} %`);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('DEBUT');
  try {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Validation des arguments...');
    const commandLineArgs = yargs
      .option('count', {
        description: 'Nombre de certificats pour lesquels on génère un code.',
        type: 'number',
        default: DEFAULT_COUNT,
      })
      .option('concurrency', {
        description: 'Concurrence',
        type: 'number',
        default: DEFAULT_CONCURRENCY,
      })
      .help().argv;
    // @ts-expect-error TS(2339): Property 'count' does not exist on type '{ maxSnap... Remove this comment to see the full error message
    const { count, concurrency } = _validateAndNormalizeArgs(commandLineArgs);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`OK : Nombre de certificats - ${count} / Concurrence - ${concurrency}`);

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Génération des codes...');
    await _do({ count, concurrency });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('OK');
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('FIN');
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\x1b[31mErreur : %s\x1b[0m', (error as $TSFixMe).message);
    yargs.showHelp();
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _validateAndNormalizeArgs({
  count,
  concurrency
}: $TSFixMe) {
  const finalCount = _validateAndNormalizeCount(count);
  const finalConcurrency = _validateAndNormalizeConcurrency(concurrency);

  return {
    count: finalCount,
    concurrency: finalConcurrency,
  };
}

function _validateAndNormalizeCount(count: $TSFixMe) {
  if (isNaN(count)) {
    count = DEFAULT_COUNT;
  }
  if (count <= 0 || count > 100000) {
    throw new Error(`Nombre de certifications à traiter ${count} ne peut pas être inférieur à 1 ni supérieur à 50000.`);
  }

  return count;
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _validateAndNormalizeConcurrency(concurrency: $TSFixMe) {
  if (isNaN(concurrency)) {
    concurrency = DEFAULT_CONCURRENCY;
  }
  if (concurrency <= 0 || concurrency > 10) {
    throw new Error(`La concurrence ${concurrency} ne peut pas être inférieure à 1 ni supérieure à 10.`);
  }

  return concurrency;
}

async function _do({
  count,
  concurrency
}: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tRécupération des certifications éligibles...');
  const eligibleCertificationIds = await _findEligibleCertifications(count);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\tOK : ${eligibleCertificationIds.length} certifications récupérées`);

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tGénération des codes de vérification des certifications...');
  let failedGenerations = 0;
  await bluebird.map(
    eligibleCertificationIds,
    async (certificationId: $TSFixMe) => {
      try {
        await _generateVerificationCode(certificationId);
      } catch (err) {
        if ((err as $TSFixMe)?.code === uniqueConstraintViolationCode) {
          ++failedGenerations;
        } else {
          throw err;
        }
      }
      _logProgression(count);
    },
    { concurrency }
  );
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\n\tOK, ${failedGenerations} générations de codes échouées pour cause de code en doublon`);
}

function _findEligibleCertifications(count: $TSFixMe) {
  return knex.pluck('id').from('certification-courses').whereNull('verificationCode').limit(count);
}

async function _generateVerificationCode(certificationId: $TSFixMe) {
  const verificationCode = await verifyCertificateCodeService.generateCertificateVerificationCode();
  return certificationRepository.saveVerificationCode(certificationId, verificationCode);
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
