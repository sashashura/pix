// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'yargs'.
const yargs = require('yargs');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceDatasource = require('../../lib/infrastructure/datasources/learning-content/competence-datasource');

const CERTIF_ERROR_RATE = 0.05;
const CERTIF_REJECTED_RATE = 0.15;
const COMPETENCE_MARK_PARTICIPATION_RATES = [0.05, 0.2, 0.5, 0.75];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('DEBUT');
    const commandLineArguments = yargs
      .option('organizationId', {
        description: "Id de l'organisation.",
        type: 'number',
      })
      .option('certificationCenterId', {
        description: 'Id du centre de certification.',
        type: 'number',
      })
      .help().argv;
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Validation des arguments...');
    // @ts-expect-error TS(2339): Property 'organizationId' does not exist on type '... Remove this comment to see the full error message
    const { organizationId, certificationCenterId } = _validateAndNormalizeArgs(commandLineArguments);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('OK');
    await _do({
      organizationId,
      certificationCenterId,
    });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('FIN');
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
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(
        '\n\n Pour que ce script fonctionne pré-requis :' +
          '- Une organisation SCO isManagingStudents contenant des organization learners' +
          '- Un centre de certif SCO'
      );
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(1);
    }
  );
}

function _validateAndNormalizeArgs({
  organizationId,
  certificationCenterId
}: $TSFixMe) {
  const finalOrganizationId = _validateAndNormalizeOrganizationId(organizationId);
  const finalCertificationCenterId = _validateAndNormalizeCertificationCenterId(certificationCenterId);

  return {
    organizationId: finalOrganizationId,
    certificationCenterId: finalCertificationCenterId,
  };
}

function _validateAndNormalizeOrganizationId(organizationId: $TSFixMe) {
  if (isNaN(organizationId)) {
    throw new Error(`organizationId doit être un nombre : valeur fournie ${organizationId}`);
  }

  return organizationId;
}

function _validateAndNormalizeCertificationCenterId(certificationCenterId: $TSFixMe) {
  if (isNaN(certificationCenterId)) {
    throw new Error(`certificationCenterId doit être un nombre : valeur fournie ${certificationCenterId}`);
  }

  return certificationCenterId;
}

async function _do({
  organizationId,
  certificationCenterId
}: $TSFixMe) {
  const transaction = await knex.transaction();
  try {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Vérification existence organisation et centre de certification...');
    await _checkOrgaAndCertifCenterExist({ organizationId, certificationCenterId, transaction });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('OK');
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("Récupération des prescrits réconciliés de l'organisation...");
    const organizationLearnersGroupedByDivision = await _getOrganizationLearnersGroupedByDivisions({
      organizationId,
      transaction,
    });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('OK');
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('Création des données de certification...');
    let allAssessmentIds: $TSFixMe = [];
    for (const [division, organizationLearners] of Object.entries(organizationLearnersGroupedByDivision)) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(`\tCréation des données de certification pour la classe ${division} contenant ${(organizationLearners as $TSFixMe).length} prescrits...`);
      const sessionId = await _createSessionsWithCandidates({
        certificationCenterId,
        organizationLearners,
        name: division,
        transaction,
      });
      const assessmentIds = await _createCertificationCoursesAndAssessments({
        organizationLearners,
        sessionId,
        transaction,
      });
      allAssessmentIds = [...allAssessmentIds, ...assessmentIds];
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log('\tOK');
    }

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(`Création de ${allAssessmentIds.length} résultats de certification...`);
    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    const errorCount = parseInt(allAssessmentIds.length * CERTIF_ERROR_RATE);
    const errorAssessmentIds = _.sampleSize(allAssessmentIds, errorCount);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(
      `\tCréation des résultats de certification pour les ${errorAssessmentIds.length} certifications en erreur...`
    );
    allAssessmentIds = _.difference(allAssessmentIds, errorAssessmentIds);
    await _createCertificationResultsInError({ assessmentIds: errorAssessmentIds, transaction });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\tOK');

    const competences = await competenceDatasource.list();
    const pixCompetences = competences.filter((competence: $TSFixMe) => competence.origin === 'Pix');
    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    const rejectedCount = parseInt(allAssessmentIds.length * CERTIF_REJECTED_RATE);
    const rejectedAssessmentIds = _.sampleSize(allAssessmentIds, rejectedCount);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(
      `\tCréation des résultats de certification pour les ${rejectedAssessmentIds.length} certifications rejetées...`
    );
    allAssessmentIds = _.difference(allAssessmentIds, rejectedAssessmentIds);
    await _createCertificationResultsWithMarks({
      assessmentIds: rejectedAssessmentIds,
      status: 'rejected',
      pixCompetences,
      transaction,
    });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\tOK');

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log(
      `\tCréation des résultats de certification pour les ${allAssessmentIds.length} certifications validées...`
    );
    await _createCertificationResultsWithMarks({
      assessmentIds: allAssessmentIds,
      status: 'validated',
      pixCompetences,
      transaction,
    });
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('\tOK');
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log('OK');
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

async function _checkOrgaAndCertifCenterExist({
  organizationId,
  certificationCenterId,
  transaction
}: $TSFixMe) {
  const doesOrganizationExist = await transaction('organizations').where({ id: organizationId }).first();
  if (!doesOrganizationExist) {
    throw new Error(`Organisation ${organizationId} n'existe pas.`);
  }
  const doesCertificationCenterExist = await transaction('certification-centers')
    .where({ id: certificationCenterId })
    .first();
  if (!doesCertificationCenterExist) {
    throw new Error(`Centre de certification ${certificationCenterId} n'existe pas.`);
  }
}

async function _getOrganizationLearnersGroupedByDivisions({
  organizationId,
  transaction
}: $TSFixMe) {
  const organizationLearnerData = await transaction
    .select({
      id: 'organization-learners.id',
      firstName: 'organization-learners.firstName',
      lastName: 'organization-learners.lastName',
      birthdate: 'organization-learners.birthdate',
      birthCity: 'organization-learners.birthCity',
      birthProvinceCode: 'organization-learners.birthProvinceCode',
      birthCountry: 'organization-learners.birthCountryCode',
      division: 'organization-learners.division',
      userId: 'organization-learners.userId',
    })
    .from('organization-learners')
    .where({ organizationId })
    .whereNotNull('userId');

  if (organizationLearnerData.length === 0) {
    throw new Error(`Aucun prescrit trouvé pour l'organisation ${organizationId}`);
  }

  return _.groupBy(organizationLearnerData, 'division');
}

async function _createSessionsWithCandidates({
  certificationCenterId,
  organizationLearners,
  name,
  transaction
}: $TSFixMe) {
  const [sessionId] = await transaction('sessions')
    .returning('id')
    .insert({
      certificationCenterId,
      description: `Session_${name}`,
      accessCode: `CODE_${name}`,
      time: '15:00:00',
      date: '2020-01-04',
      examiner: 'Jean-Pierre Pernaut',
      room: 'Salle B',
      address: '1 rue des églantines',
      certificationCenter: 'blablabla',
    });

  const certificationCandidatesData = [];
  for (const organizationLearner of organizationLearners) {
    certificationCandidatesData.push({
      sessionId,
      firstName: organizationLearner.firstName,
      lastName: organizationLearner.lastName,
      birthdate: organizationLearner.birthdate,
      birthCity: organizationLearner.birthCity,
      birthProvinceCode: organizationLearner.birthProvinceCode,
      birthCountry: organizationLearner.birthCountry,
      userId: organizationLearner.userId,
      organizationLearnerId: organizationLearner.id,
    });
  }
  const chunkSize = _getChunkSize(certificationCandidatesData[0]);
  await transaction.batchInsert('certification-candidates', certificationCandidatesData, chunkSize);
  return sessionId;
}

async function _createCertificationCoursesAndAssessments({
  organizationLearners,
  sessionId,
  transaction
}: $TSFixMe) {
  const certificationCoursesData = [];
  for (const organizationLearner of organizationLearners) {
    certificationCoursesData.push({
      sessionId,
      firstName: organizationLearner.firstName,
      lastName: organizationLearner.lastName,
      birthdate: organizationLearner.birthdate,
      birthplace: organizationLearner.birthCity,
      isV2Certification: true,
      userId: organizationLearner.userId,
      maxReachableLevelOnCertificationDate: 6,
    });
  }
  const certificationCoursesChunkSize = _getChunkSize(certificationCoursesData[0]);
  const certificationCoursesAndUserIds = await transaction
    .batchInsert('certification-courses', certificationCoursesData, certificationCoursesChunkSize)
    .returning(['id', 'userId']);

  const assessmentsData = [];
  for (const { id, userId } of certificationCoursesAndUserIds) {
    assessmentsData.push({
      certificationCourseId: id,
      userId,
      type: 'CERTIFICATION',
      state: 'completed',
    });
  }
  const assessmentsChunkSize = _getChunkSize(certificationCoursesData[0]);
  return transaction.batchInsert('assessments', assessmentsData, assessmentsChunkSize).returning('id');
}

async function _createCertificationResultsInError({
  assessmentIds,
  transaction
}: $TSFixMe) {
  const assessmentResultsData = [];
  for (const assessmentId of assessmentIds) {
    assessmentResultsData.push({
      assessmentId,
      level: null,
      pixScore: 0,
      emitter: 'PIX-ALGO',
      status: 'error',
    });
  }
  const assessmentResultsChunkSize = _getChunkSize(assessmentResultsData[0]);
  return transaction.batchInsert('assessment-results', assessmentResultsData, assessmentResultsChunkSize);
}

async function _createCertificationResultsWithMarks({
  assessmentIds,
  status,
  pixCompetences,
  transaction
}: $TSFixMe) {
  const assessmentResultsData = [];
  for (const assessmentId of assessmentIds) {
    assessmentResultsData.push({
      assessmentId,
      level: null,
      pixScore: 0,
      emitter: 'PIX-ALGO',
      status,
    });
  }
  const assessmentResultsChunkSize = _getChunkSize(assessmentResultsData[0]);
  const assessmentResultIds = await transaction
    .batchInsert('assessment-results', assessmentResultsData, assessmentResultsChunkSize)
    .returning('id');

  for (const competence of pixCompetences) {
    await _createCompetenceMarksForCompetence({ competence, assessmentResultIds, transaction });
  }

  await transaction.raw(
    `
  WITH sum_score AS (
    SELECT DISTINCT "assessmentResultId",
           SUM("score") OVER (PARTITION BY "assessmentResultId") AS final_score
    FROM "competence-marks"
    WHERE "assessmentResultId" = ANY(ARRAY[?])
  )
  UPDATE "assessment-results"
  SET "pixScore" = "sum_score"."final_score"
  FROM sum_score
  WHERE "assessment-results".id = sum_score."assessmentResultId"
  `,
    assessmentResultIds.join(',')
  );
}

async function _createCompetenceMarksForCompetence({
  competence,
  assessmentResultIds,
  transaction
}: $TSFixMe) {
  const chosenRate = _.sample(COMPETENCE_MARK_PARTICIPATION_RATES);
  // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
  const chosenCount = parseInt(assessmentResultIds.length * chosenRate);
  const chosenAssessmentResultIds = _.sampleSize(assessmentResultIds, chosenCount);
  const competenceMarksData = [];
  const possibleScoresAndLevels = [
    { level: -1, score: 0 },
    { level: 0, score: 0 },
    { level: 1, score: 8 },
    { level: 2, score: 16 },
    { level: 3, score: 24 },
    { level: 4, score: 32 },
    { level: 5, score: 40 },
    { level: 6, score: 48 },
  ];
  for (const assessmentResultId of chosenAssessmentResultIds) {
    const chosenScoreAndLevel = _.sample(possibleScoresAndLevels);
    competenceMarksData.push({
      assessmentResultId,
      level: chosenScoreAndLevel.level,
      score: chosenScoreAndLevel.score,
      area_code: competence.index[0],
      competence_code: competence.index,
      competenceId: competence.id,
    });
  }
  const competenceMarksChunkSize = _getChunkSize(competenceMarksData[0]);
  return transaction.batchInsert('competence-marks', competenceMarksData, competenceMarksChunkSize);
}

function _getChunkSize(objectToBeInserted: $TSFixMe) {
  // PostgreSQL autorise au maximum 65536 paramètres bindés dans les requêtes
  const MAX_BINDED_PG = 65536;
  if (objectToBeInserted) {
    return Math.floor(MAX_BINDED_PG / Object.keys(objectToBeInserted).length) - 1;
  }
  return MAX_BINDED_PG;
}
