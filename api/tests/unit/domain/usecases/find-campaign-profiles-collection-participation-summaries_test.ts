// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findCampaignProfilesCollectionParticipationSummaries = require('../../../../lib/domain/usecases/find-campaign-profiles-collection-participation-summaries');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionParticipationSummary = require('../../../../lib/domain/read-models/CampaignProfilesCollectionParticipationSummary');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-campaign-profiles-collection-participation-summaries', function () {
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const userId = Symbol('user id');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const campaignId = Symbol('campaign id');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const campaignRepository = { checkIfUserOrganizationHasAccessToCampaign: sinon.stub() };
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const campaignProfilesCollectionParticipationSummaryRepository = { findPaginatedByCampaignId: sinon.stub() };

  const campaignProfilesCollectionParticipationSummaries = [
    new CampaignProfilesCollectionParticipationSummary({
      campaignParticipationId: 1,
      firstName: 'Hello',
      lastName: 'World',
    }),
  ];

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('the user belongs to the organization of the campaign', function () {
    let participationSummaries;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.resolves(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve the campaign participations datas', async function () {
      const page = { number: 1 };
      const filters = { divisions: ['Barry White Classics'] };
      // given
      campaignProfilesCollectionParticipationSummaryRepository.findPaginatedByCampaignId
        .withArgs(campaignId, page, filters)
        .resolves(campaignProfilesCollectionParticipationSummaries);

      participationSummaries = await findCampaignProfilesCollectionParticipationSummaries({
        userId,
        campaignId,
        page,
        filters,
        campaignRepository,
        campaignProfilesCollectionParticipationSummaryRepository,
      });

      // then
      expect(participationSummaries).to.equal(campaignProfilesCollectionParticipationSummaries);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('the user does not belong to the organization of the campaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignRepository.checkIfUserOrganizationHasAccessToCampaign.resolves(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserNotAuthorizedToAccessEntityError error', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const requestErr = await catchErr(findCampaignProfilesCollectionParticipationSummaries)({
        userId,
        campaignId,
        campaignRepository,
        campaignProfilesCollectionParticipationSummaryRepository,
      });

      expect(requestErr).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
    });
  });
});
