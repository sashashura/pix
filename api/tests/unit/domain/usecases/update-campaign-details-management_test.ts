// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'updateCamp... Remove this comment to see the full error message
const updateCampaignDetailsManagement = require('../../../../lib/domain/usecases/update-campaign-details-management');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignVa... Remove this comment to see the full error message
const campaignValidator = require('../../../../lib/domain/validators/campaign-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const sinon = require('sinon');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | update-campaign-details-management', function () {
  let campaignManagementRepository: $TSFixMe;
  let campaign: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    campaign = domainBuilder.buildCampaign();

    campaignManagementRepository = {
      update: sinon.stub(),
      get: sinon.stub().resolves(campaign),
    };

    sinon.stub(campaignValidator, 'validate');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update the campaign', async function () {
    const campaignId = campaign.id;
    const campaignAttributes = {
      name: 'new Name',
      title: 'new title',
      customLandingPageText: 'new landing text',
      customResultPageText: 'new result text',
      customResultPageButtonText: 'new result button text',
      customResultPageButtonUrl: 'new result button url',
      multipleSendings: false,
    };

    await updateCampaignDetailsManagement({ campaignId, ...campaignAttributes, campaignManagementRepository });

    expect(campaignManagementRepository.update).to.have.been.calledOnceWith({ campaignId, campaignAttributes });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when you update campaign but validation is wrong', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      const campaignId = campaign.id;
      campaignValidator.validate.throws(new EntityValidationError({ invalidAttributes: [] }));

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(updateCampaignDetailsManagement)({
        campaignId,
        campaignManagementRepository,
      });

      expect(error).to.be.an.instanceOf(EntityValidationError);
    });
  });
});
