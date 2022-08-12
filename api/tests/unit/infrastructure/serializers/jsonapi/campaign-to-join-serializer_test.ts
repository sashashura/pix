// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignTo... Remove this comment to see the full error message
const campaignToJoinSerializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-to-join-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-to-join-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a CampaignToJoin model object into JSON API data', function () {
      // given
      const campaignToJoin = domainBuilder.buildCampaignToJoin({ identityProvider: 'SUPER_IDP' });

      // when
      const jsonApi = campaignToJoinSerializer.serialize(campaignToJoin);

      // then
      expect(jsonApi).to.deep.equal({
        data: {
          type: 'campaigns',
          id: campaignToJoin.id.toString(),
          attributes: {
            code: campaignToJoin.code,
            title: campaignToJoin.title,
            type: campaignToJoin.type,
            'id-pix-label': campaignToJoin.idPixLabel,
            'custom-landing-page-text': campaignToJoin.customLandingPageText,
            'external-id-help-image-url': campaignToJoin.externalIdHelpImageUrl,
            'alternative-text-to-external-id-help-image': campaignToJoin.alternativeTextToExternalIdHelpImage,
            'is-archived': campaignToJoin.isArchived,
            'is-restricted': campaignToJoin.isRestricted,
            'is-simplified-access': campaignToJoin.isSimplifiedAccess,
            'is-for-absolute-novice': campaignToJoin.isForAbsoluteNovice,
            'identity-provider': campaignToJoin.identityProvider,
            'organization-name': campaignToJoin.organizationName,
            'organization-type': campaignToJoin.organizationType,
            'organization-logo-url': campaignToJoin.organizationLogoUrl,
            'organization-show-nps': campaignToJoin.organizationShowNPS,
            'organization-form-nps-url': campaignToJoin.organizationFormNPSUrl,
            'target-profile-name': campaignToJoin.targetProfileName,
            'target-profile-image-url': campaignToJoin.targetProfileImageUrl,
            'custom-result-page-text': campaignToJoin.customResultPageText,
            'custom-result-page-button-text': campaignToJoin.customResultPageButtonText,
            'custom-result-page-button-url': campaignToJoin.customResultPageButtonUrl,
            'multiple-sendings': campaignToJoin.multipleSendings,
            'is-flash': campaignToJoin.isFlash,
          },
        },
      });
    });
  });
});
