// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCases'.
const useCases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | find-campaign-profiles-collection-participation-summaries', function () {
  let organizationId;
  let campaignId: $TSFixMe;
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;

    organizationId = databaseBuilder.factory.buildOrganization().id;
    userId = databaseBuilder.factory.buildUser().id;
    campaignId = databaseBuilder.factory.buildCampaign({ organizationId, targetProfileId }).id;

    databaseBuilder.factory.buildMembership({ organizationId, userId });

    mockLearningContent({ skills: [], tubes: [], competences: [], areas: [] });

    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are filters', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const participation1 = { participantExternalId: 'Yubaba', campaignId, status: 'SHARED' };
      const participant1 = { firstName: 'Chihiro', lastName: 'Ogino' };
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(participant1, participation1);

      const participation2 = { participantExternalId: 'Meï', campaignId, status: 'SHARED' };
      const participant2 = { firstName: 'Tonari', lastName: 'No Totoro' };
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(participant2, participation2);

      await databaseBuilder.commit();
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the list filtered by the search', async function () {
      const { data } = await useCases.findCampaignProfilesCollectionParticipationSummaries({
        userId,
        campaignId,
        filters: { search: 'Tonari N' },
      });
      expect(data.length).to.equal(1);
    });
  });
});
