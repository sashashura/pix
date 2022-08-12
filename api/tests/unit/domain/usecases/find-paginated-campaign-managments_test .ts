// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedCampaignManagements = require('../../../../lib/domain/usecases/find-paginated-campaign-managements');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | find-paginated-campaign-managments', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedCampaignManagement', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaigns of the given organization', async function () {
      const campaignManagementRepository = { findPaginatedCampaignManagements: sinon.stub() };

      // given
      const organizationId = 251;
      const campaignsManagementExpected = Symbol('campaign managment');
      const page = { number: 1, size: 3 };
      campaignManagementRepository.findPaginatedCampaignManagements
        .withArgs({ organizationId, page })
        .resolves(campaignsManagementExpected);

      // when
      const campaignManagements = await findPaginatedCampaignManagements({
        organizationId,
        page,
        campaignManagementRepository,
      });

      // then
      expect(campaignManagements).to.equals(campaignsManagementExpected);
    });
  });
});
