// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, databaseBuilder, knex, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationsToAttachToTargetProfileRepository = require('../../../../lib/infrastructure/repositories/organizations-to-attach-to-target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Organizations-to-attach-to-target-profile', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#attachOrganizations', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('target-profile-shares').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return attachedIds', async function () {
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const organization1 = databaseBuilder.factory.buildOrganization();
      const organization2 = databaseBuilder.factory.buildOrganization();

      await databaseBuilder.commit();

      const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({
        id: targetProfileId,
      });

      targetProfileOrganizations.attach([organization1.id, organization2.id]);

      const results = await organizationsToAttachToTargetProfileRepository.attachOrganizations(
        targetProfileOrganizations
      );

      expect(results).to.deep.equal({ duplicatedIds: [], attachedIds: [organization1.id, organization2.id] });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('add organization to the target profile', async function () {
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      const organization1 = databaseBuilder.factory.buildOrganization();
      const organization2 = databaseBuilder.factory.buildOrganization();

      await databaseBuilder.commit();

      const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({
        id: targetProfileId,
      });

      targetProfileOrganizations.attach([organization1.id, organization2.id]);

      await organizationsToAttachToTargetProfileRepository.attachOrganizations(targetProfileOrganizations);

      const rows = await knex('target-profile-shares')
        .select('organizationId')
        .where({ targetProfileId: targetProfileOrganizations.id });
      const organizationIds = rows.map(({
        organizationId
      }: $TSFixMe) => organizationId);

      expect(organizationIds).to.exactlyContain([organization1.id, organization2.id]);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const unknownOrganizationId = 99999;

        await databaseBuilder.commit();

        const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({
          id: targetProfileId,
        });

        targetProfileOrganizations.attach([unknownOrganizationId, organizationId]);

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(organizationsToAttachToTargetProfileRepository.attachOrganizations)(
          targetProfileOrganizations
        );

        expect(error).to.be.an.instanceOf(NotFoundError);
        expect((error as $TSFixMe).message).to.have.string(`L'organization avec l'id ${unknownOrganizationId} n'existe pas`);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the organization is already attached', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return inserted organizationId', async function () {
        const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
        const firstOrganization = databaseBuilder.factory.buildOrganization();
        const secondOrganization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildTargetProfileShare({
          targetProfileId: targetProfileId,
          organizationId: firstOrganization.id,
        });

        await databaseBuilder.commit();

        const targetProfileOrganizations = domainBuilder.buildOrganizationsToAttachToTargetProfile({
          id: targetProfileId,
        });

        targetProfileOrganizations.attach([firstOrganization.id, secondOrganization.id]);

        const result = await organizationsToAttachToTargetProfileRepository.attachOrganizations(
          targetProfileOrganizations
        );

        expect(result).to.deep.equal({ duplicatedIds: [firstOrganization.id], attachedIds: [secondOrganization.id] });
      });
    });
  });
});
