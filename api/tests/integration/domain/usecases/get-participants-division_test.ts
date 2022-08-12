// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { getParticipantsDivision } = require('../../../../lib/domain/usecases/index');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | get-participants-division', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the use has access to the campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the participants division', async function () {
      const division = '3emeA';
      const campaign = databaseBuilder.factory.buildCampaign();
      const user = databaseBuilder.factory.buildUser.withMembership({ organizationId: campaign.organizationId });
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
        { organizationId: campaign.organizationId, division: division },
        { campaignId: campaign.id }
      );
      await databaseBuilder.commit();

      const divisions = await getParticipantsDivision({ userId: user.id, campaignId: campaign.id });

      expect(divisions).to.deep.equal([{ name: '3emeA' }]);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the use has not access to the campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error', async function () {
      const division = '3emeA';
      const campaign = databaseBuilder.factory.buildCampaign();
      const user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
        { organizationId: campaign.organizationId, division: division },
        { campaignId: campaign.id }
      );
      await databaseBuilder.commit();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(getParticipantsDivision)({ userId: user.id, campaignId: campaign.id });

      expect(error).to.be.an.instanceOf(ForbiddenAccess);
    });
  });
});
