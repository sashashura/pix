// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ASSESSMENT... Remove this comment to see the full error message
const ASSESSMENT_COUNT = parseInt(process.env.ASSESSMENT_COUNT) || 100;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoringCer... Remove this comment to see the full error message
const scoringCertificationService = require('../../lib/domain/services/scoring/scoring-certification-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAssessmentRepository = require('../../lib/infrastructure/repositories/certification-assessment-repository');

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _retrieveLastScoredAssessmentIds() {
  const result = await knex.raw(
    `
    SELECT ass.id FROM "certification-courses" AS cc
    JOIN "assessments" AS ass ON ass."certificationCourseId" = cc."id"
    JOIN "assessment-results" AS assr ON assr."assessmentId" = ass."id"
    WHERE cc."completedAt" IS NOT NULL
    ORDER BY cc."updatedAt" DESC LIMIT ??;
  `,
    ASSESSMENT_COUNT
  );
  return result.rows.map((row: $TSFixMe) => row.id);
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _computeScore(assessmentIds: $TSFixMe) {
  const scores = await bluebird.map(
    assessmentIds,
    async (assessmentId: $TSFixMe) => {
      try {
        const certificationAssessment = await certificationAssessmentRepository.get(assessmentId);
        const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore(
          certificationAssessment
        );
        return certificationAssessmentScore;
      } catch (err) {
        const message = `Erreur de génération pour l'assessment : ${assessmentId}`;
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.error(message);
        return { message };
      }
    },
    // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
    { concurrency: ~~process.env.CONCURRENCY || 10 }
  );
  return scores;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  try {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.error(`Récupération de ${ASSESSMENT_COUNT} assessments...`);
    const assessmentIds = await _retrieveLastScoredAssessmentIds();
    const scores = await _computeScore(assessmentIds);
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    scores.forEach((score: $TSFixMe) => console.log(score));
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
