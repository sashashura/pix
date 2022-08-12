// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignToJoinRepository = require('../../../../lib/infrastructure/repositories/campaign-to-join-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
const CampaignToJoin = require('../../../../lib/domain/read-models/CampaignToJoin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | CampaignToJoin', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the CampaignToJoin', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const organization = databaseBuilder.factory.buildOrganization();
      const expectedCampaign = databaseBuilder.factory.buildCampaign({
        organizationId: organization.id,
        targetProfileId: targetProfile.id,
      });
      databaseBuilder.factory.buildCampaign();
      await databaseBuilder.commit();

      // when
      const actualCampaign = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        return campaignToJoinRepository.get(expectedCampaign.id, domainTransaction);
      });

      // then
      expect(actualCampaign).to.be.instanceOf(CampaignToJoin);
      expect(actualCampaign.id).to.equal(expectedCampaign.id);
      expect(actualCampaign.code).to.equal(expectedCampaign.code);
      expect(actualCampaign.title).to.equal(expectedCampaign.title);
      expect(actualCampaign.idPixLabel).to.equal(expectedCampaign.idPixLabel);
      expect(actualCampaign.customLandingPageText).to.equal(expectedCampaign.customLandingPageText);
      expect(actualCampaign.externalIdHelpImageUrl).to.equal(expectedCampaign.externalIdHelpImageUrl);
      expect(actualCampaign.alternativeTextToExternalIdHelpImage).to.equal(
        expectedCampaign.alternativeTextToExternalIdHelpImage
      );
      expect(actualCampaign.archivedAt).to.equal(expectedCampaign.archivedAt);
      expect(actualCampaign.type).to.equal(expectedCampaign.type);
      expect(actualCampaign.organizationId).to.equal(organization.id);
      expect(actualCampaign.organizationName).to.equal(organization.name);
      expect(actualCampaign.organizationType).to.equal(organization.type);
      expect(actualCampaign.organizationLogoUrl).to.equal(organization.logoUrl);
      expect(actualCampaign.organizationShowNPS).to.equal(organization.showNPS);
      expect(actualCampaign.organizationFormNPSUrl).to.equal(organization.formNPSUrl);
      expect(actualCampaign.isRestricted).to.equal(organization.isManagingStudents);
      expect(actualCampaign.targetProfileName).to.equal(targetProfile.name);
      expect(actualCampaign.targetProfileImageUrl).to.equal(targetProfile.imageUrl);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFoundError when no campaign exists with given id', async function () {
      // given
      let error;
      const existingId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();

      // when

      await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        error = await catchErr(campaignToJoinRepository.get)(existingId + 1000, domainTransaction);
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCode', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the CampaignToJoin by its code', async function () {
      // given
      const code = 'LAURA123';
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const organization = databaseBuilder.factory.buildOrganization({
        identityProviderForCampaigns: constants.IDENTITY_PROVIDER.POLE_EMPLOI,
      });
      const expectedCampaign = databaseBuilder.factory.buildCampaign({
        code,
        organizationId: organization.id,
        targetProfileId: targetProfile.id,
      });
      databaseBuilder.factory.buildCampaign();
      await databaseBuilder.commit();

      // when
      const actualCampaign = await campaignToJoinRepository.getByCode(code);

      // then
      expect(actualCampaign).to.be.instanceOf(CampaignToJoin);
      expect(actualCampaign.id).to.equal(expectedCampaign.id);
      expect(actualCampaign.code).to.equal(expectedCampaign.code);
      expect(actualCampaign.title).to.equal(expectedCampaign.title);
      expect(actualCampaign.idPixLabel).to.equal(expectedCampaign.idPixLabel);
      expect(actualCampaign.customLandingPageText).to.equal(expectedCampaign.customLandingPageText);
      expect(actualCampaign.externalIdHelpImageUrl).to.equal(expectedCampaign.externalIdHelpImageUrl);
      expect(actualCampaign.alternativeTextToExternalIdHelpImage).to.equal(
        expectedCampaign.alternativeTextToExternalIdHelpImage
      );
      expect(actualCampaign.archivedAt).to.equal(expectedCampaign.archivedAt);
      expect(actualCampaign.type).to.equal(expectedCampaign.type);
      expect(actualCampaign.organizationId).to.equal(organization.id);
      expect(actualCampaign.organizationName).to.equal(organization.name);
      expect(actualCampaign.organizationType).to.equal(organization.type);
      expect(actualCampaign.organizationLogoUrl).to.equal(organization.logoUrl);
      expect(actualCampaign.organizationShowNPS).to.equal(organization.showNPS);
      expect(actualCampaign.organizationFormNPSUrl).to.equal(organization.formNPSUrl);
      expect(actualCampaign.isRestricted).to.equal(organization.isManagingStudents);
      expect(actualCampaign.targetProfileName).to.equal(targetProfile.name);
      expect(actualCampaign.targetProfileImageUrl).to.equal(targetProfile.imageUrl);
      expect(actualCampaign.isSimplifiedAccess).to.equal(targetProfile.isSimplifiedAccess);
      expect(actualCampaign.identityProvider).to.equal(constants.IDENTITY_PROVIDER.POLE_EMPLOI);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFoundError when no campaign exists with given code', async function () {
      // given
      const code = 'LAURA123';
      databaseBuilder.factory.buildCampaign({ code });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(campaignToJoinRepository.getByCode)('LAURA456');

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
