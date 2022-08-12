// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases/');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | startCampaignParticipation', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('assessments').delete();
    await knex('campaign-participations').delete();
    await knex('organization-learners').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('start a new participation', async function () {
    const { id: campaignId } = databaseBuilder.factory.buildCampaign({ type: 'PROFILES_COLLECTION', idPixLabel: null });
    const { id: userId } = databaseBuilder.factory.buildUser();
    mockLearningContent({
      skills: [],
    });
    await databaseBuilder.commit();
    const campaignParticipation = { campaignId };

    const { campaignParticipation: startedParticipation } = await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
      return usecases.startCampaignParticipation({
        userId,
        campaignParticipation,
        domainTransaction,
      });
    });

    expect(startedParticipation).to.deep.include({ userId, campaignId, status: 'TO_SHARE' });
  });
});
