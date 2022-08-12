// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findPaginatedParticipationsForCampaignManagement = require('../../../../lib/domain/usecases/find-paginated-participations-for-campaign-management');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | findPaginatedParticipationsForCampaignManagement', function () {
  const campaignId = 1;
  const page = { number: 1, size: 2 };
  const resolvedPagination = { page: 1, pageSize: 2, itemsCount: 3, pagesCount: 2 };
  let expectedParticipationsForCampaignManagement: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    expectedParticipationsForCampaignManagement = [
      domainBuilder.buildParticipationForCampaignManagement(),
      domainBuilder.buildParticipationForCampaignManagement(),
      domainBuilder.buildParticipationForCampaignManagement(),
    ];
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should fetch campaign participations matching campaign', async function () {
    const participationsForCampaignManagementRepository = {
      findPaginatedParticipationsForCampaignManagement: sinon.stub(),
    };
    participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement
      .withArgs({ campaignId, page })
      .resolves({ models: expectedParticipationsForCampaignManagement, pagination: resolvedPagination });

    const { models: foundParticipationsForCampaignManagement } = await findPaginatedParticipationsForCampaignManagement(
      {
        campaignId,
        page,
        participationsForCampaignManagementRepository,
      }
    );

    expect(foundParticipationsForCampaignManagement).to.deep.equal(expectedParticipationsForCampaignManagement);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return pagination', async function () {
    const participationsForCampaignManagementRepository = {
      findPaginatedParticipationsForCampaignManagement: sinon.stub(),
    };
    participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement
      .withArgs({ campaignId, page })
      .resolves({ models: expectedParticipationsForCampaignManagement, pagination: resolvedPagination });

    const { pagination } = await findPaginatedParticipationsForCampaignManagement({
      campaignId,
      page,
      participationsForCampaignManagementRepository,
    });

    expect(pagination).to.deep.equal(resolvedPagination);
  });
});
