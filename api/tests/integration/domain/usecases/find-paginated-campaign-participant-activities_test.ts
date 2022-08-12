// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCases'.
const useCases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | find-paginated-campaign-participants-activities', function () {
  let organizationId: $TSFixMe;
  let campaignId: $TSFixMe;
  let userId: $TSFixMe;
  const page = { number: 1 };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    organizationId = databaseBuilder.factory.buildOrganization().id;
    userId = databaseBuilder.factory.buildUser().id;
    campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when requesting user is not allowed to access campaign informations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotAuthorizedToAccessEntityError error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(useCases.findPaginatedCampaignParticipantsActivities)({
        userId,
        campaignId,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
      expect((error as $TSFixMe).message).to.equal('User does not belong to an organization that owns the campaign');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when requesting user is allowed to access campaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      databaseBuilder.factory.buildMembership({ organizationId, userId });
      databaseBuilder.factory.buildCampaignParticipation({
        participantExternalId: 'Ashitaka',
        campaignId,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the campaignParticipantsActivites of the participants of the campaign', async function () {
      const { campaignParticipantsActivities } = await useCases.findPaginatedCampaignParticipantsActivities({
        userId,
        campaignId,
        page,
      });
      expect(campaignParticipantsActivities[0].participantExternalId).to.equal('Ashitaka');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are filters', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      databaseBuilder.factory.buildMembership({ organizationId, userId });

      const participation1 = { participantExternalId: 'Yubaba', campaignId };
      const participant1 = { firstName: 'Chihiro', lastName: 'Ogino', division: '6eme' };
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(participant1, participation1);
      databaseBuilder.factory.buildOrganizationLearner({ userId: (participant1 as $TSFixMe).id, organizationId });

      const participation2 = { participantExternalId: 'Meï', campaignId };
      const participant2 = { firstName: 'Tonari', lastName: 'No Totoro', division: '5eme' };
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(participant2, participation2);

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the campaignParticipantsActivities for the participants for the division', async function () {
      const { campaignParticipantsActivities } = await useCases.findPaginatedCampaignParticipantsActivities({
        userId,
        campaignId,
        filters: { divisions: ['6eme'] },
      });

      expect(campaignParticipantsActivities[0].participantExternalId).to.equal('Yubaba');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the campaignParticipantsActivities filtered by the search', async function () {
      const { campaignParticipantsActivities } = await useCases.findPaginatedCampaignParticipantsActivities({
        userId,
        campaignId,
        filters: { search: 'Tonari N' },
      });

      expect(campaignParticipantsActivities.length).to.equal(1);
    });
  });
});
