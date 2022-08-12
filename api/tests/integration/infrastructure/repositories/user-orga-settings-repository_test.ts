// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, knex, databaseBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
const UserOrgaSettings = require('../../../../lib/domain/models/UserOrgaSettings');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUserOrgaSettings = require('../../../../lib/infrastructure/orm-models/UserOrgaSettings');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
const { UserOrgaSettingsCreationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userOrgaSe... Remove this comment to see the full error message
const userOrgaSettingsRepository = require('../../../../lib/infrastructure/repositories/user-orga-settings-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | UserOrgaSettings', function () {
  const USER_PICKED_PROPERTIES = [
    'id',
    'firstName',
    'lastName',
    'email',
    'username',
    'cgu',
    'pixOrgaTermsOfServiceAccepted',
    'pixCertifTermsOfServiceAccepted',
  ];

  const ORGANIZATION_OMITTED_PROPERTIES = [
    'memberships',
    'organizationInvitations',
    'students',
    'targetProfileShares',
    'email',
    'tags',
    'createdAt',
    'updatedAt',
    'createdBy',
    'archivedAt',
    'archivedBy',
    'identityProviderForCampaigns',
  ];

  let user: $TSFixMe;
  let organization: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    user = databaseBuilder.factory.buildUser();
    organization = databaseBuilder.factory.buildOrganization();
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('user-orga-settings').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an UserOrgaSettings domain object', async function () {
      // when
      const userOrgaSettingsSaved = await userOrgaSettingsRepository.create(user.id, organization.id);

      // then
      expect(userOrgaSettingsSaved).to.be.an.instanceof(UserOrgaSettings);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add a row in the table "user-orga-settings"', async function () {
      // given
      const nbBeforeCreation = await BookshelfUserOrgaSettings.count();

      // when
      await userOrgaSettingsRepository.create(user.id, organization.id);

      // then
      const nbAfterCreation = await BookshelfUserOrgaSettings.count();
      expect(nbAfterCreation).to.equal(nbBeforeCreation + 1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save model properties', async function () {
      // when
      const userOrgaSettingsSaved = await userOrgaSettingsRepository.create(user.id, organization.id);

      // then
      expect(userOrgaSettingsSaved.id).to.not.be.undefined;
      expect(_.pick(userOrgaSettingsSaved.user, USER_PICKED_PROPERTIES)).to.deep.equal(
        _.pick(user, USER_PICKED_PROPERTIES)
      );
      expect(_.omit(userOrgaSettingsSaved.currentOrganization, ORGANIZATION_OMITTED_PROPERTIES)).to.deep.equal(
        _.omit(organization, ORGANIZATION_OMITTED_PROPERTIES)
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a UserOrgaSettingsCreationError when userOrgaSettings already exist', async function () {
      // given
      databaseBuilder.factory.buildUserOrgaSettings({ userId: user.id, currentOrganizationId: organization.id });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(userOrgaSettingsRepository.create)(user.id, organization.id);

      // then
      expect(error).to.be.instanceOf(UserOrgaSettingsCreationError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    let userOrgaSettingsId: $TSFixMe;
    let expectedOrganization: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userOrgaSettingsId = databaseBuilder.factory.buildUserOrgaSettings({
        userId: user.id,
        currentOrganizationId: organization.id,
      }).id;
      expectedOrganization = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated userOrgaSettings', async function () {
      // when
      const updatedUserOrgaSettings = await userOrgaSettingsRepository.update(user.id, expectedOrganization.id);

      // then
      expect(updatedUserOrgaSettings.id).to.deep.equal(userOrgaSettingsId);
      expect(_.pick(updatedUserOrgaSettings.user, USER_PICKED_PROPERTIES)).to.deep.equal(
        _.pick(user, USER_PICKED_PROPERTIES)
      );
      expect(_.omit(updatedUserOrgaSettings.currentOrganization, ORGANIZATION_OMITTED_PROPERTIES)).to.deep.equal(
        _.omit(expectedOrganization, ORGANIZATION_OMITTED_PROPERTIES)
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOneByUserId', function () {
    let userOrgaSettingsId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userOrgaSettingsId = databaseBuilder.factory.buildUserOrgaSettings({
        userId: user.id,
        currentOrganizationId: organization.id,
      }).id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an UserOrgaSettings domain object', async function () {
      // when
      const foundUserOrgaSettings = await userOrgaSettingsRepository.findOneByUserId(user.id);

      // then
      expect(foundUserOrgaSettings).to.be.an.instanceof(UserOrgaSettings);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the userOrgaSettings belonging to user', async function () {
      // when
      const foundUserOrgaSettings = await userOrgaSettingsRepository.findOneByUserId(user.id);

      // then
      expect(foundUserOrgaSettings.id).to.deep.equal(userOrgaSettingsId);
      expect(_.pick(foundUserOrgaSettings.user, USER_PICKED_PROPERTIES)).to.deep.equal(
        _.pick(user, USER_PICKED_PROPERTIES)
      );
      expect(_.omit(foundUserOrgaSettings.currentOrganization, ORGANIZATION_OMITTED_PROPERTIES)).to.deep.equal(
        _.omit(organization, ORGANIZATION_OMITTED_PROPERTIES)
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return empty object when user-orga-settings doesn't exists", async function () {
      // when
      const foundUserOrgaSettings = await userOrgaSettingsRepository.findOneByUserId(user.id + 1);

      // then
      expect(foundUserOrgaSettings).to.deep.equal({});
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrUpdate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when user orga setting does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an UserOrgaSettings domain object', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        await databaseBuilder.commit();

        // when
        const userOrgaSettingsSaved = await userOrgaSettingsRepository.createOrUpdate({ userId, organizationId });

        // then
        expect(userOrgaSettingsSaved).to.be.an.instanceof(UserOrgaSettings);
        expect(userOrgaSettingsSaved.id).to.not.be.undefined;
        expect(userOrgaSettingsSaved.user.id).to.be.equal(userId);
        expect(userOrgaSettingsSaved.currentOrganization.id).to.be.equal(organizationId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should add a row in the table "user-orga-settings"', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        await databaseBuilder.commit();
        const nbBeforeCreation = await BookshelfUserOrgaSettings.count();

        // when
        await userOrgaSettingsRepository.createOrUpdate({ userId, organizationId });

        // then
        const nbAfterCreation = await BookshelfUserOrgaSettings.count();
        expect(nbAfterCreation).to.equal(nbBeforeCreation + 1);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when user orga setting does already exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the UserOrgaSettings updated', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const newOrganizationId = databaseBuilder.factory.buildOrganization().id;
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildUserOrgaSettings({ userId, currentOrganizationId: otherOrganizationId });
        await databaseBuilder.commit();

        // when
        const userOrgaSettingsSaved = await userOrgaSettingsRepository.createOrUpdate({
          userId,
          organizationId: newOrganizationId,
        });

        // then
        expect(userOrgaSettingsSaved).to.be.an.instanceof(UserOrgaSettings);
        expect(userOrgaSettingsSaved.user.id).to.be.equal(userId);
        expect(userOrgaSettingsSaved.currentOrganization.id).to.be.equal(newOrganizationId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not add a row in the table "user-orga-settings"', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildUserOrgaSettings({ userId, currentOrganizationId: organizationId });
        await databaseBuilder.commit();
        const nbBeforeUpdate = await BookshelfUserOrgaSettings.count();

        // when
        await userOrgaSettingsRepository.createOrUpdate({ userId, organizationId });

        // then
        const nbAfterUpdate = await BookshelfUserOrgaSettings.count();
        expect(nbAfterUpdate).to.equal(nbBeforeUpdate);
      });
    });
  });
});
