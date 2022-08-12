// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JobQueue'.
const JobQueue = require('../../../../lib/infrastructure/jobs/JobQueue');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Job'.
const Job = require('../../../../lib/infrastructure/jobs/JobPgBoss');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PgBoss'.
const PgBoss = require('pg-boss');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Jobs | JobQueue', function () {
  let dependenciesBuilder: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    dependenciesBuilder = { build: (handler: $TSFixMe) => handler };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('executes job when a job is added to the queue', async function () {
    const name = 'JobTest';
    const expectedParams = { jobParam: 1 };
    const job = new Job({ name }, knex);
    await job.schedule(expectedParams);
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const pgBoss = new PgBoss(process.env.TEST_DATABASE_URL);
    await pgBoss.start();

    const jobQueue = new JobQueue(pgBoss, dependenciesBuilder);

    const promise = new Promise((resolve, reject) => {
      const handler = {
        handle: (params: $TSFixMe) => {
          try {
            expect(params).to.deep.equal(expectedParams);
          } catch (err) {
            reject(err);
          }
          // @ts-expect-error TS(2794): Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
          resolve();
        },
      };

      jobQueue.performJob(name, handler);
    });

    return promise;
  });
});
