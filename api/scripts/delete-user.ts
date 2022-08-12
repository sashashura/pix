#! /usr/bin/env node
/* eslint no-console: ["off"] */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PgClient'.
const PgClient = require('./PgClient');

async function initialize() {
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const client = await PgClient.getClient(process.env.DATABASE_URL);

  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  const user_email = process.argv[2];
  return { client, user_email };
}

async function terminate(client: $TSFixMe) {
  await client.end();
  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
  console.log('END');
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'main'.
async function main() {
  const { client, user_email } = await initialize();
  const queryBuilder = new ScriptQueryBuilder();
  const clientQueryAdapter = new ClientQueryAdapter();
  const userEraser = new UserEraser(client, queryBuilder, clientQueryAdapter);

  Promise.resolve()
    .then(() => client.query_and_log('BEGIN'))
    .then(() => userEraser.fetch_user_id_from_email(user_email))
    .then(() => userEraser.check_no_certification_done())
    .then(() => userEraser.find_assessment_ids_from_fetched_user_id())
    .then(() => userEraser.delete_dependent_data_from_fetched_assessment_ids())
    .then(() => userEraser.delete_assessments_from_fetched_user_id())
    .then(() => userEraser.delete_user_from_fetched_user_id())

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

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserEraser... Remove this comment to see the full error message
class UserEraser {
  assessmentIds: $TSFixMe;
  client: $TSFixMe;
  clientQueryAdapter: $TSFixMe;
  queryBuilder: $TSFixMe;
  userId: $TSFixMe;
  constructor(client: $TSFixMe, queryBuilder: $TSFixMe, clientQueryAdapter: $TSFixMe) {
    Object.assign(this, { client, queryBuilder, clientQueryAdapter });
  }

  fetch_user_id_from_email(userEmail: $TSFixMe) {
    return Promise.resolve()
      .then(() => this.queryBuilder.get_user_id_from_email(userEmail))
      .then((query) => this.client.query_and_log(query))
      .then((result) => (this.userId = this.clientQueryAdapter.unpack_user_id(result)));
  }

  find_assessment_ids_from_fetched_user_id() {
    return Promise.resolve()
      .then(() => this.queryBuilder.find_assessment_ids_from_user_id(this.userId))
      .then((query) => this.client.query_and_log(query))
      .then((result) => (this.assessmentIds = this.clientQueryAdapter.unpack_assessment_ids(result)));
  }

  delete_dependent_data_from_fetched_assessment_ids() {
    if (this.assessmentIds.length === 0) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log(
        'No assessment found: skipping deletion of feedbacks, answers, competence-marks and assessment-results'
      );
      return Promise.resolve();
    }

    return Promise.resolve()
      .then(() => [
        this.queryBuilder.delete_feedbacks_from_assessment_ids(this.assessmentIds),
        this.queryBuilder.delete_answers_from_assessment_ids(this.assessmentIds),
        this.queryBuilder.delete_competence_marks_from_assessment_ids(this.assessmentIds),
      ])
      .then((queries) => Promise.all(queries.map((query) => this.client.query_and_log(query))))
      .then(() => this.queryBuilder.delete_assessment_results_from_assessment_ids(this.assessmentIds))
      .then((query) => this.client.query_and_log(query));
  }

  delete_assessments_from_fetched_user_id() {
    return Promise.resolve()
      .then(() => this.queryBuilder.delete_assessments_from_user_id(this.userId))
      .then((query) => this.client.query_and_log(query));
  }

  delete_user_from_fetched_user_id() {
    return Promise.resolve()
      .then(() => this.queryBuilder.delete_user_from_user_id(this.userId))
      .then((query) => this.client.query_and_log(query));
  }

  check_no_certification_done() {
    return Promise.resolve()
      .then(() => this.queryBuilder.count_certifications_from_user_id(this.userId))
      .then((query) => this.client.query_and_log(query))
      .then((result) => {
        if (this.clientQueryAdapter.count(result) > 0)
          return Promise.reject('The user has been certified, deletion impossible');
      });
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ClientQuer... Remove this comment to see the full error message
class ClientQueryAdapter {
  unpack_user_id(result: $TSFixMe) {
    return result.rows[0].id;
  }

  unpack_assessment_ids(result: $TSFixMe) {
    return result.rows.map(({
      id
    }: $TSFixMe) => id);
  }

  count(result: $TSFixMe) {
    return result.rows[0].count;
  }
}

// @ts-expect-error TS(2300): Duplicate identifier 'ScriptQueryBuilder'.
class ScriptQueryBuilder {
  get_user_id_from_email(email: $TSFixMe) {
    return `SELECT id FROM users WHERE email = '${email}'`;
  }

  count_certifications_from_user_id(id: $TSFixMe) {
    return `SELECT COUNT(*) FROM "certification-courses" WHERE "userId" = '${id}'`;
  }

  find_assessment_ids_from_user_id(user_id: $TSFixMe) {
    return `SELECT id FROM assessments WHERE "userId" = '${user_id}'`;
  }

  delete_answers_from_assessment_ids(assessment_ids: $TSFixMe) {
    this._precondition_array_must_not_be_empty(assessment_ids);
    return `DELETE FROM answers WHERE "assessmentId" IN (${assessment_ids.join(',')})`;
  }

  delete_feedbacks_from_assessment_ids(assessment_ids: $TSFixMe) {
    this._precondition_array_must_not_be_empty(assessment_ids);
    return `DELETE FROM feedbacks WHERE "assessmentId" IN (${assessment_ids.join(',')})`;
  }

  delete_competence_marks_from_assessment_ids(assessment_ids: $TSFixMe) {
    this._precondition_array_must_not_be_empty(assessment_ids);
    return `DELETE FROM "competence-marks" WHERE "assessmentResultId" IN ( SELECT id from "assessment-results" WHERE "assessmentId" IN (${assessment_ids.join(
      ','
    )}) )`;
  }

  delete_assessment_results_from_assessment_ids(assessment_ids: $TSFixMe) {
    this._precondition_array_must_not_be_empty(assessment_ids);
    return `DELETE FROM "assessment-results" WHERE "assessmentId" IN (${assessment_ids.join(',')})`;
  }

  delete_assessments_from_user_id(user_id: $TSFixMe) {
    return `DELETE FROM assessments WHERE "userId" = '${user_id}'`;
  }

  delete_user_from_user_id(user_id: $TSFixMe) {
    return `DELETE FROM users WHERE "id" = '${user_id}'`;
  }

  _precondition_array_must_not_be_empty(assessment_ids: $TSFixMe) {
    if (assessment_ids.length === 0) {
      throw new Error('asssessment_ids array must not be empty');
    }
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
  ClientQueryAdapter,
  UserEraser,
};
