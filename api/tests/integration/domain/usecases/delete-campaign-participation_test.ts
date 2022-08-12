// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'deleteCamp... Remove this comment to see the full error message
const deleteCampaignParticipation = require('../../../../lib/domain/usecases/delete-campaign-participation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | delete-campaign-participation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should delete all campaignParticipations', async function () {
    // given
    const adminUserId = databaseBuilder.factory.buildUser().id;
    const campaignId = databaseBuilder.factory.buildCampaign().id;
    const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
    databaseBuilder.factory.buildCampaignParticipation({
      isImproved: true,
      organizationLearnerId,
      campaignId,
    });
    const campaignParticipationToDelete = databaseBuilder.factory.buildCampaignParticipation({
      isImproved: false,
      organizationLearnerId,
      campaignId,
    });

    await databaseBuilder.commit();

    // when
    await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
      return deleteCampaignParticipation({
        userId: adminUserId,
        campaignId,
        campaignParticipationId: campaignParticipationToDelete.id,
        campaignParticipationRepository,
        domainTransaction,
      });
    });

    // then
    const results = await knex('campaign-participations').where({ organizationLearnerId });

    expect(results.length).to.equal(2);
    results.forEach((campaignParticipaton: $TSFixMe) => {
      expect(campaignParticipaton.deletedAt).not.to.equal(null);
      expect(campaignParticipaton.deletedBy).to.equal(adminUserId);
    });
  });
});
