// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCr... Remove this comment to see the full error message
const campaignCreatorRepository = require('../../../../lib/infrastructure/repositories/campaign-creator-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToCreateCampaignError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | CampaignCreatorRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the creator for the given organization', async function () {
      const { id: userId } = databaseBuilder.factory.buildUser();
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      const { id: otherOrganizationId } = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildMembership({ organizationId, userId });
      databaseBuilder.factory.buildMembership({ organizationId: otherOrganizationId, userId });
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile({
        ownerOrganizationId: organizationId,
      });
      await databaseBuilder.commit();

      const creator = await campaignCreatorRepository.get({ userId, organizationId, ownerId: userId });

      expect(creator.availableTargetProfileIds).to.deep.equal([targetProfileId]);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are target profiles', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when target profiles are public', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns the public target profiles', async function () {
          const { id: userId } = databaseBuilder.factory.buildUser();
          const { id: organizationId } = databaseBuilder.factory.buildOrganization();
          databaseBuilder.factory.buildMembership({ organizationId, userId });

          const { id: targetProfilePublicId } = databaseBuilder.factory.buildTargetProfile({
            isPublic: true,
            outdated: false,
          });

          await databaseBuilder.commit();

          const creator = await campaignCreatorRepository.get({ userId, organizationId, ownerId: userId });
          expect(creator.availableTargetProfileIds).to.exactlyContain([targetProfilePublicId]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the target profiles are private', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns the shared target profiles', async function () {
          const { id: userId } = databaseBuilder.factory.buildUser();
          const { id: organizationId } = databaseBuilder.factory.buildOrganization();
          databaseBuilder.factory.buildMembership({ organizationId, userId });

          const { id: targetProfileSharedId } = databaseBuilder.factory.buildTargetProfile({
            isPublic: false,
            outdated: false,
          });
          databaseBuilder.factory.buildTargetProfileShare({ targetProfileId: targetProfileSharedId, organizationId });
          databaseBuilder.factory.buildTargetProfile({
            isPublic: false,
            outdated: false,
          });

          await databaseBuilder.commit();

          const creator = await campaignCreatorRepository.get({ userId, organizationId, ownerId: userId });
          expect(creator.availableTargetProfileIds).to.exactlyContain([targetProfileSharedId]);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('returns the target profiles is owned by the organization', async function () {
          const { id: userId } = databaseBuilder.factory.buildUser();
          const { id: organizationId } = databaseBuilder.factory.buildOrganization();
          databaseBuilder.factory.buildMembership({ organizationId, userId });

          const { id: organizationTargetProfileId } = databaseBuilder.factory.buildTargetProfile({
            isPublic: false,
            outdated: false,
            ownerOrganizationId: organizationId,
          });

          await databaseBuilder.commit();

          const creator = await campaignCreatorRepository.get({ userId, organizationId, ownerId: userId });
          expect(creator.availableTargetProfileIds).to.exactlyContain([organizationTargetProfileId]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when target profiles are outdated', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not return target profiles', async function () {
          const { id: userId } = databaseBuilder.factory.buildUser();
          const { id: organizationId } = databaseBuilder.factory.buildOrganization();
          databaseBuilder.factory.buildMembership({ organizationId, userId });

          databaseBuilder.factory.buildTargetProfile({
            isPublic: true,
            outdated: true,
          });
          databaseBuilder.factory.buildTargetProfile({
            isPublic: false,
            outdated: true,
            ownerOrganizationId: organizationId,
          });
          const { id: targetProfileSharedId } = databaseBuilder.factory.buildTargetProfile({
            isPublic: false,
            outdated: true,
          });
          databaseBuilder.factory.buildTargetProfileShare({ targetProfileId: targetProfileSharedId, organizationId });

          await databaseBuilder.commit();

          const creator = await campaignCreatorRepository.get({ userId, organizationId, ownerId: userId });
          expect(creator.availableTargetProfileIds).to.be.empty;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the user is not a member of the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        const { id: userId } = databaseBuilder.factory.buildUser();
        const { id: organizationMemberId } = databaseBuilder.factory.buildUser();
        const { id: organizationId } = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildMembership({ organizationId, userId: organizationMemberId });

        await databaseBuilder.commit();

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(campaignCreatorRepository.get)({
          userId,
          organizationId,
          ownerId: organizationMemberId,
        });

        expect(error).to.be.instanceOf(UserNotAuthorizedToCreateCampaignError);
        expect((error as $TSFixMe).message).to.equal(`User does not have an access to the organization ${organizationId}`);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the owner is not a member of the organization', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const ownerId = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildMembership({ organizationId, userId });

        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(campaignCreatorRepository.get)({ userId, organizationId, ownerId });

        // then
        expect(error).to.be.instanceOf(UserNotAuthorizedToCreateCampaignError);
        expect((error as $TSFixMe).message).to.equal(`Owner does not have an access to the organization ${organizationId}`);
      });
    });
  });
});
