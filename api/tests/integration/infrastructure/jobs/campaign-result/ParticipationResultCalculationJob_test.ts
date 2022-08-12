// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationResultCalculationJob = require('../../../../../lib/infrastructure/jobs/campaign-result/ParticipationResultCalculationJob');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Jobs | CampaignResult | ParticipationResultCalculation', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('pgboss.job').where({ name: 'ParticipationResultCalculationJob' }).delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handle', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('creates the results calculation job', async function () {
      const handler = new ParticipationResultCalculationJob(knex);

      await handler.schedule({ params: 1 });

      const job = await knex('pgboss.job').where({ name: 'ParticipationResultCalculationJob' }).first();

      expect(job.retrylimit).to.equal(3);
      expect(job.data).to.deep.equal({ params: 1 });
    });
  });
});
