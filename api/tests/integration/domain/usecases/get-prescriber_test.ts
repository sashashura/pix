// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prescriber... Remove this comment to see the full error message
const prescriberRepository = require('../../../../lib/infrastructure/repositories/prescriber-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'membership... Remove this comment to see the full error message
const membershipRepository = require('../../../../lib/infrastructure/repositories/membership-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userOrgaSe... Remove this comment to see the full error message
const userOrgaSettingsRepository = require('../../../../lib/infrastructure/repositories/user-orga-settings-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getPrescri... Remove this comment to see the full error message
const getPrescriber = require('../../../../lib/domain/usecases/get-prescriber');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | get-prescriber', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When prescriber does not have a userOrgaSettings', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('user-orga-settings').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should create it with the first membership's organization", async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const firstMembership = databaseBuilder.factory.buildMembership({ userId });
      databaseBuilder.factory.buildMembership({ userId });
      await databaseBuilder.commit();

      // when
      const prescriber = await getPrescriber({
        userId,
        prescriberRepository,
        membershipRepository,
        userOrgaSettingsRepository,
      });

      // then
      const userOrgaSettingsInDB = await knex('user-orga-settings')
        .where({ userId, currentOrganizationId: firstMembership.organizationId })
        .select('*');
      expect(userOrgaSettingsInDB).to.exist;
      expect(prescriber.userOrgaSettings).to.exist;
      expect(prescriber.userOrgaSettings.currentOrganization.id).to.equal(firstMembership.organizationId);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When prescriber has a userOrgaSettings', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return the prescriber's userOrgaSettings", async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const membership = databaseBuilder.factory.buildMembership({ userId });
      const userOrgaSettings = databaseBuilder.factory.buildUserOrgaSettings({
        userId,
        currentOrganizationId: membership.organizationId,
      });
      await databaseBuilder.commit();

      // when
      const prescriber = await getPrescriber({
        userId,
        prescriberRepository,
        membershipRepository,
        userOrgaSettingsRepository,
      });

      // then
      expect(prescriber.userOrgaSettings).to.exist;
      expect(prescriber.userOrgaSettings.id).to.equal(userOrgaSettings.id);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("When the currentOrganization does not belong to prescriber's memberships anymore", function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should update the prescriber's userOrgaSettings with the organization of the first membership", async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const firstMembership = databaseBuilder.factory.buildMembership({ userId });
        databaseBuilder.factory.buildMembership({ userId });
        databaseBuilder.factory.buildUserOrgaSettings({ userId });
        await databaseBuilder.commit();

        // when
        const prescriber = await getPrescriber({
          userId,
          prescriberRepository,
          membershipRepository,
          userOrgaSettingsRepository,
        });

        // then
        const userOrgaSettingsInDB = await knex('user-orga-settings')
          .where({ userId, currentOrganizationId: firstMembership.organizationId })
          .select('*');
        expect(userOrgaSettingsInDB).to.exist;
        expect(prescriber.userOrgaSettings).to.exist;
        expect(prescriber.userOrgaSettings.currentOrganization.id).to.equal(firstMembership.organizationId);
      });
    });
  });
});
