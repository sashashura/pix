#! /usr/bin/env node
/* eslint no-console: ["off"] */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PgClient'.
const PgClient = require('./PgClient');

// @ts-expect-error TS(2393): Duplicate function implementation.
async function initialize() {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const client = await PgClient.getClient(process.env.DATABASE_URL);

  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const assessment_id = process.argv[2];
  return { client, assessment_id };
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function terminate(client: $TSFixMe) {
  await client.end();
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('END');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  // @ts-expect-error TS(2339): Property 'assessment_id' does not exist on type '{... Remove this comment to see the full error message
  const { client, assessment_id } = await initialize();

  const queryBuilder = new ScriptQueryBuilder();
  const userEraser = new AssessmentEraser(client, queryBuilder, assessment_id);

  Promise.resolve()
    .then(() => client.query_and_log('BEGIN'))
    .then(() => userEraser.delete_dependent_data_from_assessment_id())
    .then(() => userEraser.delete_assessment_from_id())
    .then(() => client.query_and_log('COMMIT'))
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    .then(() => console.log('FINISHED'))
    .catch((err) => {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(`ERROR: ${err}\nRollback...`);
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      return client.query_and_log('ROLLBACK').then(() => console.log('Rollback finished'));
    })
    // finally
    .then(() => terminate(client))
    .catch(() => terminate(client));
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentEraser {
  assessment_id: $TSFixMe;
  client: $TSFixMe;
  queryBuilder: $TSFixMe;
  constructor(client: $TSFixMe, queryBuilder: $TSFixMe, assessment_id: $TSFixMe) {
    Object.assign(this, { client, queryBuilder, assessment_id });
  }

  delete_dependent_data_from_assessment_id() {
    if (!this.assessment_id) {
      return Promise.reject(new Error('Missing argument : an assessment id should be provided'));
    }

    return Promise.resolve()
      .then(() => [
        this.queryBuilder.delete_feedbacks_from_assessment_ids(this.assessment_id),
        this.queryBuilder.delete_answers_from_assessment_ids(this.assessment_id),
        this.queryBuilder.delete_competence_marks_from_assessment_ids(this.assessment_id),
      ])
      .then((queries) => Promise.all(queries.map((query) => this.client.query_and_log(query))))
      .then(() => this.queryBuilder.delete_assessment_results_from_assessment_ids(this.assessment_id))
      .then((query) => this.client.query_and_log(query));
  }

  delete_assessment_from_id() {
    return Promise.resolve()
      .then(() => this.queryBuilder.delete_assessment_from_id(this.assessment_id))
      .then((query) => this.client.query_and_log(query));
  }
}

// @ts-expect-error TS(2300): Duplicate identifier 'ScriptQueryBuilder'.
class ScriptQueryBuilder {
  delete_answers_from_assessment_ids(assessment_id: $TSFixMe) {
    return `DELETE FROM answers WHERE "assessmentId" = ${assessment_id}`;
  }

  delete_feedbacks_from_assessment_ids(assessment_id: $TSFixMe) {
    return `DELETE FROM feedbacks WHERE "assessmentId" = ${assessment_id}`;
  }

  delete_competence_marks_from_assessment_ids(assessment_id: $TSFixMe) {
    return `DELETE FROM "competence-marks" WHERE "assessmentResultId" IN ( SELECT id from "assessment-results" WHERE "assessmentId" = ${assessment_id} )`;
  }

  delete_assessment_results_from_assessment_ids(assessment_id: $TSFixMe) {
    return `DELETE FROM "assessment-results" WHERE "assessmentId" = ${assessment_id}`;
  }

  delete_assessment_from_id(id: $TSFixMe) {
    return `DELETE FROM assessments WHERE id = '${id}'`;
  }
}

/*=================== tests =============================*/

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
if (require.main === module) {
  main();
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  ScriptQueryBuilder,
  AssessmentEraser,
};
