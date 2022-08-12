// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCr... Remove this comment to see the full error message
const CampaignCreator = require('../../../../lib/domain/models/CampaignCreator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignFo... Remove this comment to see the full error message
const CampaignForCreation = require('../../../../lib/domain/models/CampaignForCreation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToCreateCampaignError, EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignCreator', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createCampaign', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the creator is allowed to create the campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('creates the campaign', function () {
        const availableTargetProfileIds = [1, 2];
        const creator = new CampaignCreator(availableTargetProfileIds);
        const campaignData = {
          name: 'campagne utilisateur',
          type: CampaignTypes.ASSESSMENT,
          creatorId: 1,
          ownerId: 1,
          organizationId: 2,
          targetProfileId: 2,
        };
        const expectedCampaignForCreation = new CampaignForCreation(campaignData);

        const campaignForCreation = creator.createCampaign(campaignData);

        expect(campaignForCreation).to.deep.equal(expectedCampaignForCreation);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the campaign to create is an assessment campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the creator cannot use the targetProfileId', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          const availableTargetProfileIds = [1, 2];
          const creator = new CampaignCreator(availableTargetProfileIds);
          const campaignData = {
            name: 'campagne utilisateur',
            type: CampaignTypes.ASSESSMENT,
            creatorId: 1,
            ownerId: 1,
            organizationId: 2,
            targetProfileId: 5,
          };
          const error = await catchErr(creator.createCampaign, creator)(campaignData);

          expect(error).to.be.instanceOf(UserNotAuthorizedToCreateCampaignError);
          expect((error as $TSFixMe).message).to.equal(`Organization does not have an access to the profile ${campaignData.targetProfileId}`);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the targetProfileId is not given', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          const availableTargetProfileIds = [1, 2];
          const creator = new CampaignCreator(availableTargetProfileIds);
          const campaignData = {
            name: 'campagne utilisateur',
            type: CampaignTypes.ASSESSMENT,
            creatorId: 1,
            ownerId: 1,
            organizationId: 2,
            targetProfileId: null,
          };
          const error = await catchErr(creator.createCampaign, creator)(campaignData);

          expect(error).to.be.an.instanceof(EntityValidationError);
          expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
          expect((error as $TSFixMe).invalidAttributes).to.deep.equal([
    { attribute: 'targetProfileId', message: 'TARGET_PROFILE_IS_REQUIRED' },
]);
        });
      });
    });
  });
});
