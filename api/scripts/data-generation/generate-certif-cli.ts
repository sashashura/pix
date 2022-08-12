#!/usr/bin/env node
'use strict';
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const inquirer = require('inquirer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config({ path: `${__dirname}/../../.env` });
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, disconnect } = require(`../../db/knex-database-connection`);
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const maxBy = require('lodash/maxBy');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../lib/infrastructure/logger');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { getNewSessionCode } = require('../../lib/domain/services/session-code-service');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserPi... Remove this comment to see the full error message
  makeUserPixCertifiable,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserPi... Remove this comment to see the full error message
  makeUserPixDroitCertifiable,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserCl... Remove this comment to see the full error message
  makeUserCleaCertifiable,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'makeUserPi... Remove this comment to see the full error message
  makeUserPixEduCertifiable,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../db/seeds/data/certification/tooling');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DatabaseBu... Remove this comment to see the full error message
const DatabaseBuilder = require('../../db/database-builder/database-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../../db/database-builder/database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
const { CLEA } = require('../../lib/domain/models/ComplementaryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuilder = new DatabaseBuilder({ knex, emptyFirst: false });

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../../lib/infrastructure/caches/learning-content-cache');

/**
 * LOG_LEVEL=info ./scripts/data-generation/generate-certif-cli.js 'SUP' 1 '[{"candidateNumber": 1, "name": "Pix+ Édu 2nd degré"}]'
 */

const PIXCLEA = 'CLEA';
const PIXDROIT = 'DROIT';
const PIXEDU2NDDEGRE = 'EDU_2ND_DEGRE';
const PIXEDU1ERDEGRE = 'EDU_1ER_DEGRE';

const CERTIFICATION_CENTER_IDS_BY_TYPE = {
  SCO: 1,
  SUP: 3,
  PRO: 2,
};

const COMPLEMENTARY_CERTIFICATION_IDS_BY_KEY = {
  [PIXCLEA]: 52,
  [PIXDROIT]: 53,
  [PIXEDU1ERDEGRE]: 54,
  [PIXEDU2NDDEGRE]: 55,
};
const COMPLEMENTARY_CERTIFICATION_BADGES_BY_NAME = {
  [PIXCLEA]: 'PIX_EMPLOI_CLEA_V3',
  [PIXDROIT]: 'PIX_DROIT_EXPERT_CERTIF',
  [PIXEDU1ERDEGRE]: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME',
  [PIXEDU2NDDEGRE]: 'PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME',
};

const questions = [
  {
    type: 'list',
    name: 'centerType',
    message: 'Quel type de centre ?',
    choices: ['SCO', 'SUP', 'PRO'],
  },
  {
    type: 'input',
    name: 'candidateNumber',
    message: 'Combien de candidats ?',
    validate(value: $TSFixMe) {
      const valid = !isNaN(parseInt(value));
      return valid || 'Renseigner un nombre';
    },
    filter: Number,
  },
  {
    type: 'confirm',
    name: 'needComplementaryCertifications',
    message: 'As tu besoin de certifications complémentaires ?',
    default: false,
    when({
      centerType
    }: $TSFixMe) {
      return centerType !== 'SCO';
    },
  },
  {
    type: 'checkbox',
    name: 'complementaryCertifications',
    message: "Quelles certifications complémentaires souhaitez-vous ? ('space' pour séléctionner)",
    when({
      needComplementaryCertifications
    }: $TSFixMe) {
      return needComplementaryCertifications;
    },
    loop: false,
    choices({
      candidateNumber
    }: $TSFixMe) {
      const choices = [];
      for (let i = 0; i < candidateNumber; i++) {
        choices.push(
          new inquirer.Separator(`----- Candidat ${i + 1} -----`),
          {
            name: 'Pix+ Édu 1er degré',
            value: { candidateNumber: i + 1, key: 'EDU_1ER_DEGRE' },
          },
          {
            name: 'Pix+ Édu 2nd degré',
            value: { candidateNumber: i + 1, key: 'EDU_2ND_DEGRE' },
          },
          {
            name: 'Pix+ Droit',
            value: { candidateNumber: i + 1, key: 'DROIT' },
          },
          {
            name: 'CléA Numérique',
            value: { candidateNumber: i + 1, key: 'CLEA' },
          }
        );
      }
      return choices;
    },
  },
];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main({
  centerType,
  candidateNumber,
  complementaryCertifications
}: $TSFixMe) {
  await _updateDatabaseBuilderSequenceNumber();

  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const certificationCenterId = CERTIFICATION_CENTER_IDS_BY_TYPE[centerType];
  await _updateCertificationCenterSupervisorPortalAccess(certificationCenterId);

  const sessionId = await _createSessionAndReturnId(certificationCenterId, databaseBuilder);

  if (centerType === 'SCO') {
    await _createScoCertificationCandidates(certificationCenterId, candidateNumber, sessionId, databaseBuilder);
  } else {
    let complementaryCertificationGroupedByCandidateIndex;
    if (complementaryCertifications?.length) {
      const complementaryCertificationIds = complementaryCertifications.map(({
        key
      }: $TSFixMe) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return COMPLEMENTARY_CERTIFICATION_IDS_BY_KEY[key];
      });

      await _createComplementaryCertificationHabilitations(
        new Set(complementaryCertificationIds),
        certificationCenterId,
        databaseBuilder
      );
      complementaryCertificationGroupedByCandidateIndex = _groupByCandidateIndex(complementaryCertifications);
    }

    await _createNonScoCertificationCandidates(
      centerType,
      candidateNumber,
      sessionId,
      complementaryCertificationGroupedByCandidateIndex,
      databaseBuilder
    );
  }

  await databaseBuilder.commit();
  await databaseBuilder.fixSequences();
  const results = await _getResults(sessionId);
  logger.info({ results });
}

async function _updateDatabaseBuilderSequenceNumber() {
  // need to update databaseBuffer to avoid uniq ids conflicts
  const maxSequenceId = await _getMaxSequenceId();
  databaseBuffer.nextId = maxSequenceId + 1;
}

async function _getMaxSequenceId() {
  const sequences = await knex('information_schema.sequences').pluck('sequence_name');
  const maxValues = await bluebird.map(sequences, (sequence: $TSFixMe) => knex(sequence).select('last_value').first());
  const { last_value: max } = maxBy(maxValues, 'last_value');
  return max;
}

async function _updateCertificationCenterSupervisorPortalAccess(id: $TSFixMe) {
  await knex('certification-centers').update({ isSupervisorAccessEnabled: true }).where({ id });
}

async function _createComplementaryCertificationHabilitations(
  complementaryCertificationIds: $TSFixMe,
  certificationCenterId: $TSFixMe,
  databaseBuilder: $TSFixMe
) {
  return bluebird.mapSeries(complementaryCertificationIds, async (complementaryCertificationId: $TSFixMe) => {
    databaseBuilder.factory.buildComplementaryCertificationHabilitation({
      certificationCenterId,
      complementaryCertificationId,
      databaseBuilder,
    });
  });
}

async function _createSessionAndReturnId(certificationCenterId: $TSFixMe, databaseBuilder: $TSFixMe) {
  const sessionCode = await getNewSessionCode();
  const { id } = databaseBuilder.factory.buildSession({
    certificationCenterId,
    accessCode: sessionCode,
    address: 'via le script de génération',
    createdAt: new Date(),
  });
  return id;
}

async function _createNonScoCertificationCandidates(
  centerType: $TSFixMe,
  candidateNumber: $TSFixMe,
  sessionId: $TSFixMe,
  complementaryCertificationGroupedByCandidateIndex: $TSFixMe,
  databaseBuilder: $TSFixMe
) {
  let maxUserId = await _getMaxUserId();

  for (let i = 0; i < candidateNumber; i++) {
    maxUserId++;
    const firstName = `${centerType}${maxUserId}`.toLowerCase();
    const lastName = firstName;
    const birthdate = new Date('2000-01-01');
    const email = `${firstName}@example.net`;
    const { id: userId } = await _createUser({ firstName, lastName, birthdate, email }, databaseBuilder);
    const { id: candidateId } = databaseBuilder.factory.buildCertificationCandidate({
      firstName,
      lastName,
      birthdate,
      sessionId,
      email,
      userId: null,
      createdAt: new Date(),
      authorizedToStart: true,
    });

    if (complementaryCertificationGroupedByCandidateIndex && complementaryCertificationGroupedByCandidateIndex[i + 1]) {
      const complementaryCertifications = complementaryCertificationGroupedByCandidateIndex[i + 1];

      await _createComplementaryCertificationHability(
        complementaryCertifications,
        candidateId,
        userId,
        databaseBuilder
      );
    }
  }
}

async function _getMaxUserId() {
  const { max } = await knex('users').max('id').first();
  return max;
}

async function _createScoCertificationCandidates(certificationCenterId: $TSFixMe, candidateNumber: $TSFixMe, sessionId: $TSFixMe, databaseBuilder: $TSFixMe) {
  const organizationLearner = await knex('organization-learners')
    .select('organization-learners.*')
    .innerJoin('organizations', 'organizations.id', 'organization-learners.organizationId')
    .innerJoin('certification-centers', 'certification-centers.externalId', 'organizations.externalId')
    .where('certification-centers.id', certificationCenterId)
    .first();

  const centerType = 'SCO';
  let maxUserId = await _getMaxUserId();

  for (let i = 0; i < candidateNumber; i++) {
    maxUserId++;
    const firstName = `${centerType}${maxUserId}`.toLowerCase();
    const lastName = firstName;
    const birthdate = new Date('2000-01-01');
    const email = `${firstName}@example.net`;

    const { id: userId } = await _createUser({ firstName, lastName, birthdate, email }, databaseBuilder);

    const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
      ...organizationLearner,
      firstName,
      lastName,
      birthdate,
      email,
      nationalStudentId: firstName,
      studentNumber: maxUserId,
      userId,
      id: undefined,
    });

    databaseBuilder.factory.buildCertificationCandidate({
      firstName,
      lastName,
      birthdate,
      sessionId,
      email,
      userId: null,
      organizationLearnerId,
      createdAt: new Date(),
      authorizedToStart: true,
    });
  }
}

async function _createComplementaryCertificationHability(
  complementaryCertifications: $TSFixMe,
  certificationCandidateId: $TSFixMe,
  userId: $TSFixMe,
  databaseBuilder: $TSFixMe
) {
  return bluebird.mapSeries(complementaryCertifications, async (key: $TSFixMe) => {
    const { id: complementaryCertificationId } = await knex('complementary-certifications').where({ key }).first();

    databaseBuilder.factory.buildComplementaryCertificationSubscription({
      complementaryCertificationId,
      certificationCandidateId,
    });

    if (_isDroit(complementaryCertificationId)) {
      const { id: badgeId } = await knex('badges')
        .where({ key: COMPLEMENTARY_CERTIFICATION_BADGES_BY_NAME[PIXDROIT] })
        .first();
      databaseBuilder.factory.buildBadgeAcquisition({ badgeId, userId });
      await makeUserPixDroitCertifiable({
        userId,
        databaseBuilder,
      });
    } else if (_isClea(complementaryCertificationId)) {
      const { id: badgeId } = await knex('badges')
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        .where({ key: COMPLEMENTARY_CERTIFICATION_BADGES_BY_NAME[CLEA] })
        .first();
      databaseBuilder.factory.buildBadgeAcquisition({ badgeId, userId });
      await makeUserCleaCertifiable({ userId, databaseBuilder });
    } else if (_isEdu1erDegre(complementaryCertificationId)) {
      const { id: badgeId } = await knex('badges')
        .where({ key: COMPLEMENTARY_CERTIFICATION_BADGES_BY_NAME[PIXEDU1ERDEGRE] })
        .first();
      databaseBuilder.factory.buildBadgeAcquisition({ badgeId, userId });
      await makeUserPixEduCertifiable({ userId, databaseBuilder });
    } else if (_isEdu2ndDegre(complementaryCertificationId)) {
      const { id: badgeId } = await knex('badges')
        .where({ key: COMPLEMENTARY_CERTIFICATION_BADGES_BY_NAME[PIXEDU2NDDEGRE] })
        .first();
      databaseBuilder.factory.buildBadgeAcquisition({ badgeId, userId });
      await makeUserPixEduCertifiable({ userId, databaseBuilder });
    }
  });
}

function _isDroit(complementaryCertificationId: $TSFixMe) {
  return complementaryCertificationId === COMPLEMENTARY_CERTIFICATION_IDS_BY_KEY[PIXDROIT];
}
function _isClea(complementaryCertificationId: $TSFixMe) {
  return complementaryCertificationId === COMPLEMENTARY_CERTIFICATION_IDS_BY_KEY[PIXCLEA];
}
function _isEdu1erDegre(complementaryCertificationId: $TSFixMe) {
  return complementaryCertificationId === COMPLEMENTARY_CERTIFICATION_IDS_BY_KEY[PIXEDU1ERDEGRE];
}
function _isEdu2ndDegre(complementaryCertificationId: $TSFixMe) {
  return complementaryCertificationId === COMPLEMENTARY_CERTIFICATION_IDS_BY_KEY[PIXEDU2NDDEGRE];
}

async function _getResults(sessionId: $TSFixMe) {
  return knex('sessions')
    .select({
      sessionId: 'sessions.id',
      accessCode: 'sessions.accessCode',
      firstName: 'certification-candidates.firstName',
      lastName: 'certification-candidates.lastName',
      email: 'certification-candidates.email',
      birthdate: 'certification-candidates.birthdate',
      complementaryCertifications: knex.raw('json_agg("complementary-certifications"."label")'),
    })
    .join('certification-candidates', 'certification-candidates.sessionId', 'sessions.id')
    .leftJoin(
      'complementary-certification-subscriptions',
      'complementary-certification-subscriptions.certificationCandidateId',
      'certification-candidates.id'
    )
    .leftJoin(
      'complementary-certifications',
      'complementary-certifications.id',
      'complementary-certification-subscriptions.complementaryCertificationId'
    )
    .where('sessions.id', sessionId)
    .groupBy('sessions.id', 'certification-candidates.id');
}

function _groupByCandidateIndex(complementaryCertifications: $TSFixMe) {
  return complementaryCertifications.reduce((acc: $TSFixMe, {
    candidateNumber,
    key
  }: $TSFixMe) => {
    acc[candidateNumber] = (acc[candidateNumber] || []).concat(key);
    return acc;
  }, {});
}

async function _createUser({
  firstName,
  lastName,
  birthdate,
  email
}: $TSFixMe, databaseBuilder: $TSFixMe) {
  const user = databaseBuilder.factory.buildUser.withRawPassword({
    firstName,
    lastName,
    birthdate,
    email,
    mustValidateTermsOfService: false,
  });

  await makeUserPixCertifiable({
    userId: user.id,
    databaseBuilder,
    countCertifiableCompetences: 16,
    levelOnEachCompetence: 6,
  });

  return user;
}

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
if (process.argv.length > 2 && process.env.NODE_ENV !== 'test') {
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const [centerType, candidateNumber, complementaryCertifications] = process.argv.slice(2);

  main({
    centerType,
    candidateNumber,
    complementaryCertifications: JSON.parse(complementaryCertifications),
  })
    .catch((error) => {
      logger.error(error);
      throw error;
    })
    .finally(_disconnect);
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} else if (require.main === module) {
  inquirer
    .prompt(questions)
    .then(async (answers: $TSFixMe) => {
      logger.info('\nDetails:');
      logger.info(JSON.stringify(answers, null, '  '));
      await main(answers);
    })
    .catch((error: $TSFixMe) => {
      logger.error(error);
      throw error;
    })
    .finally(_disconnect);
} else {
  // @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
  module.exports = {
    main,
    databaseBuilder,
  };
}

async function _disconnect() {
  logger.info('Closing connexions to PG...');
  await disconnect();
  logger.info('Closing connexions to cache...');
  cache.quit();
  logger.info('Exiting process gracefully...');
}
