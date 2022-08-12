// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignFo... Remove this comment to see the full error message
const CampaignForCreation = require('../../../../lib/domain/models/CampaignForCreation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignForCreation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign type is ASSESSEMENT', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the every required field is present', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('creates the campaign', function () {
          const attributes = {
            name: 'CampaignName',
            type: CampaignTypes.ASSESSMENT,
            targetProfileId: 1,
            creatorId: 2,
            ownerId: 2,
            organizationId: 3,
          };

          expect(() => new CampaignForCreation(attributes)).to.not.throw();
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when attributes are invalid', function () {
        let attributes: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          attributes = {
            name: 'CampaignName',
            type: CampaignTypes.ASSESSMENT,
            targetProfileId: 1,
            creatorId: 2,
            ownerId: 2,
            organizationId: 3,
          };
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('name is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.name = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'name', message: '"name" is required' }]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('creatorId is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.creatorId = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'creatorId', message: 'MISSING_CREATOR' }]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('ownerId is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.ownerId = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'ownerId', message: 'MISSING_OWNER' }]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('organizationId is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.organizationId = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([
    { attribute: 'organizationId', message: 'MISSING_ORGANIZATION' },
]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('targetProfileId is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.targetProfileId = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([
    { attribute: 'targetProfileId', message: 'TARGET_PROFILE_IS_REQUIRED' },
]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('customLandingPageText max length over 5000 character', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            // given
            attributes.customLandingPageText = 'Godzilla vs Kong'.repeat(335);

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([
    { attribute: 'customLandingPageText', message: 'CUSTOM_LANDING_PAGE_TEXT_IS_TOO_LONG' },
]);
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign type is PROFILES_COLLECTION', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the every required field is present', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create the campaign', function () {
          const attributes = {
            name: 'CampaignName',
            type: CampaignTypes.PROFILES_COLLECTION,
            creatorId: 2,
            ownerId: 2,
            organizationId: 3,
          };

          expect(() => new CampaignForCreation(attributes)).to.not.throw();
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when attributes are invalid', function () {
        let attributes: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          attributes = {
            name: 'CampaignName',
            type: CampaignTypes.PROFILES_COLLECTION,
            creatorId: 2,
            ownerId: 2,
            organizationId: 3,
          };
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('name is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.name = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'name', message: '"name" is required' }]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('creatorId is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.creatorId = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'creatorId', message: 'MISSING_CREATOR' }]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('ownerId is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.ownerId = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'ownerId', message: 'MISSING_OWNER' }]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('organizationId is missing', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.organizationId = undefined;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([
    { attribute: 'organizationId', message: 'MISSING_ORGANIZATION' },
]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('targetProfileId is provided', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.targetProfileId = 1;

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([
    { attribute: 'targetProfileId', message: 'TARGET_PROFILE_NOT_ALLOWED_FOR_PROFILES_COLLECTION_CAMPAIGN' },
]);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('title is provided', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error', async function () {
            attributes.title = 'Title';

            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(() => new CampaignForCreation(attributes))();
            expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
            expect((error as $TSFixMe).invalidAttributes).to.deep.equal([
    {
        attribute: 'title',
        message: 'TITLE_OF_PERSONALISED_TEST_IS_NOT_ALLOWED_FOR_PROFILES_COLLECTION_CAMPAIGN',
    },
]);
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign type is something else', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        const attributes = {
          name: 'CampaignName',
          type: 'BAD TYPE',
          creatorId: 2,
          ownerId: 2,
          organizationId: 3,
        };

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(() => new CampaignForCreation(attributes))();
        expect((error as $TSFixMe).message).to.equal("Échec de validation de l'entité.");
        expect((error as $TSFixMe).invalidAttributes).to.deep.equal([{ attribute: 'type', message: 'CAMPAIGN_PURPOSE_IS_REQUIRED' }]);
      });
    });
  });
});
