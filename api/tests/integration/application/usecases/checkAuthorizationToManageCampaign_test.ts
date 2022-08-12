// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkAutho... Remove this comment to see the full error message
const checkAuthorizationToManageCampaign = require('../../../../lib/application/usecases/checkAuthorizationToManageCampaign');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | API | checkAuthorizationToManageCampaign', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the user is member in organization and owner of the campaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();
      const user = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildMembership({ userId: user.id, organizationId: organization.id });
      const campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id, ownerId: user.id });
      await databaseBuilder.commit();

      // when
const hasAccess = await (checkAuthorizationToManageCampaign as $TSFixMe).execute({ campaignId: campaign.id, userId: user.id });

      // then
      expect(hasAccess).to.be.true;
    });
  });
});
