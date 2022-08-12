// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedFilteredOrganizationCampaigns = require('../../../../lib/domain/usecases/find-paginated-filtered-organization-campaigns');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | find-paginated-filtered-organization-campaigns', function () {
  const campaignReportRepository = { findPaginatedFilteredByOrganizationId: () => undefined };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaignReportRepository.findPaginatedFilteredByOrganizationId = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFilteredOrganizationCampaigns', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaigns of the given organization', function () {
      // given
      const organizationId = 251;
      const foundCampaign = domainBuilder.buildCampaign({ organizationId });
      const foundCampaigns = [foundCampaign];
      (campaignReportRepository.findPaginatedFilteredByOrganizationId as $TSFixMe).resolves(foundCampaigns);
      const page = { number: 1, size: 3 };

      // when
      const promise = findPaginatedFilteredOrganizationCampaigns({ organizationId, page, campaignReportRepository });

      // then
      return promise.then((campaigns: $TSFixMe) => {
        expect(campaigns).to.have.lengthOf(1);
        expect(campaigns).to.contains(foundCampaign);
      });
    });
  });
});
