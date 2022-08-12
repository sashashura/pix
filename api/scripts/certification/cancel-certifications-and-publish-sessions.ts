// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'yargs'.
const yargs = require('yargs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'unpublishS... Remove this comment to see the full error message
const unpublishSession = require('../../lib/domain/usecases/unpublish-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'publishSes... Remove this comment to see the full error message
const publishSession = require('../../lib/domain/usecases/publish-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'finalizedS... Remove this comment to see the full error message
const finalizedSessionRepository = require('../../lib/infrastructure/repositories/sessions/finalized-session-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../lib/infrastructure/repositories/sessions/session-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationRepository = require('../../lib/infrastructure/repositories/certification-repository');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionPublicationService = require('../../lib/domain/services/session-publication-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
const { parseCsvWithHeader } = require('../helpers/csvHelpers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'progressio... Remove this comment to see the full error message
let progression = 0;
// @ts-expect-error TS(2393): Duplicate function implementation.
function _logProgression(totalCount: $TSFixMe) {
  ++progression;
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.stdout.cursorTo(0);
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.stdout.write(`${Math.round((progression * 100) / totalCount, 2)} %`);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _resetProgression() {
  progression = 0;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    const commandLineArgs = yargs
      .option('file', {
        description: 'fichier csv contenant les données de certification à annuler.',
        type: 'string',
      })
      .help().argv;
    const { file } = _validateArgs(commandLineArgs);
    await _do({ file });
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error('\x1b[31mErreur : %s\x1b[0m', (error as $TSFixMe).message);
    yargs.showHelp();
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.exit(1);
  }
}

function _validateArgs({
  file
}: $TSFixMe) {
  if (!_.isString(file)) {
    throw new Error(`Argument "file" ${file} doit être une chaîne vers un fichier existant.`);
  }

  return { file };
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _do({
  file
}: $TSFixMe) {
  const trx = await knex.transaction();
  let certificationsToCancelBySession;
  try {
    certificationsToCancelBySession = await _parseFile(file, trx);

    const certificationIdsToCancel = [];
    for (const certificationIdsOfSession of Object.values(certificationsToCancelBySession)) {
      // @ts-expect-error TS(2488): Type 'unknown' must have a '[Symbol.iterator]()' m... Remove this comment to see the full error message
      certificationIdsToCancel.push(...certificationIdsOfSession);
    }
    await _cancelCertifications(certificationIdsToCancel, trx);
    await trx.commit();
  } catch (err) {
    await trx.rollback();
    throw err;
  }

  const sessionIdsToPublish = _.map(Object.keys(certificationsToCancelBySession), (sessionIdStr: $TSFixMe) => parseInt(sessionIdStr)
  );
  await _publishSessions(sessionIdsToPublish);
}

async function _parseFile(file: $TSFixMe, trx: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\tParsing file ${file}...`);
  const parsedCsv = await parseCsvWithHeader(file);
  const certificationsToCancelBySession = {};
  for (const line of parsedCsv) {
    const { sessionId, certificationIds } = await _parseLine(line, trx);
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (!certificationsToCancelBySession[sessionId]) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      certificationsToCancelBySession[sessionId] = [];
    }
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    certificationsToCancelBySession[sessionId].push(...certificationIds);
  }

  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tDone !');
  return certificationsToCancelBySession;
}

async function _parseLine(line: $TSFixMe, trx: $TSFixMe) {
  const sessionId = _parseSessionId(line);
  const certificationIds = await _parseCertifications(line, sessionId, trx);
  if (certificationIds.length === 0) {
    throw new Error(`No certifications indicated for session ${sessionId}`);
  }
  return { sessionId, certificationIds };
}

function _parseSessionId(line: $TSFixMe) {
  const COL_NAME_SESSION_ID = 'session_id';
  const sessionIdValue = line[COL_NAME_SESSION_ID];
  if (!sessionIdValue || _.isNaN(sessionIdValue)) {
    throw new Error(`Invalid session id ${sessionIdValue}`);
  }
  return _.toNumber(sessionIdValue);
}

async function _parseCertifications(line: $TSFixMe, sessionId: $TSFixMe, trx: $TSFixMe) {
  const COL_NAME_CERTIFICATIONS = 'certifications';
  const certificationsValue = line[COL_NAME_CERTIFICATIONS];
  if (certificationsValue === 'tout annuler') {
    return _findAllCertificationIdsOfSession(sessionId, trx);
  }
  const certificationIdValues = certificationsValue.split(', ');
  const certificationIds = [];
  for (const certificationIdValue of certificationIdValues) {
    if (!_.isInteger(parseInt(certificationIdValue))) {
      throw new Error(`Invalid certification ID ${certificationIdValue} for session ${sessionId}`);
    }
    certificationIds.push(parseInt(certificationIdValue));
  }
  return certificationIds;
}

async function _findAllCertificationIdsOfSession(sessionId: $TSFixMe, trx: $TSFixMe) {
  const results = await trx.select('certification-courses.id').from('certification-courses').where({ sessionId });

  return _.map(results, 'id');
}

async function _cancelCertifications(certificationIdsToCancel: $TSFixMe, trx: $TSFixMe) {
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\tCancelling ${certificationIdsToCancel.length} certifications...`);
  const cancelledCertificationIds = await trx('certification-courses')
    .whereIn('id', certificationIdsToCancel)
    .update({ isCancelled: true, updatedAt: new Date() })
    .returning('id');

  const notUpdatedCertificationIds = _.difference(certificationIdsToCancel, cancelledCertificationIds);
  if (notUpdatedCertificationIds.length > 0) {
    throw new Error(
      `Some certifications do not exist or were already cancelled : ${notUpdatedCertificationIds.join(', ')}`
    );
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tDone !');
}

async function _publishSessions(sessionIdsToPublish: $TSFixMe) {
  const alreadyPublishedSessionIds = await _findAlreadyPublishedSessions(sessionIdsToPublish);
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\tUnpublishing ${alreadyPublishedSessionIds.length} sessions...`);
  for (const alreadyPublishedSessionId of alreadyPublishedSessionIds) {
    await unpublishSession({
      sessionId: alreadyPublishedSessionId,
      certificationRepository,
      finalizedSessionRepository,
      sessionRepository,
    });
    _logProgression(alreadyPublishedSessionIds.length);
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tDone !');
  _resetProgression();
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log(`\tPublishing ${sessionIdsToPublish.length} sessions...`);
  for (const sessionId of sessionIdsToPublish) {
    try {
      await publishSession({
        sessionId,
        certificationRepository,
        finalizedSessionRepository,
        sessionRepository,
        sessionPublicationService,
      });
    } catch (err) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(`\nError when trying to publish session ${sessionId}`);
      throw err;
    }
    _logProgression(sessionIdsToPublish.length);
  }
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('\tDone !');
  throw new Error('coucou');
}

async function _findAlreadyPublishedSessions(sessionIdsToPublish: $TSFixMe) {
  const results = await knex
    .select('id')
    .from('sessions')
    .whereNotNull('publishedAt')
    .whereIn('id', sessionIdsToPublish);

  return _.map(results, 'id');
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
