// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | get-campaign-participations-activity-by-day', function () {
  let organizationId;
  let campaignId: $TSFixMe;
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    organizationId = databaseBuilder.factory.buildOrganization().id;
    userId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildMembership({ organizationId, userId });
    campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when requesting user is not allowed to access campaign informations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotAuthorizedToAccessEntityError error', async function () {
      const user2 = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(usecases.getCampaignParticipationsActivityByDay)({
        userId: user2.id,
        campaignId,
      });

      // then
      expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
      expect((error as $TSFixMe).message).to.equal('User does not belong to the organization that owns the campaign');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when requesting user is allowed to access campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return participations activity', async function () {
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, createdAt: '2021-06-01', status: STARTED });
      await databaseBuilder.commit();

      // when
      const result = await usecases.getCampaignParticipationsActivityByDay({ userId, campaignId });

      // then
      expect(result.startedParticipations).to.deep.equal([{ day: '2021-06-01', count: 1 }]);
      expect(result.sharedParticipations).to.deep.equal([]);
    });
  });
});
