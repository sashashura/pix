// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bcrypt'.
const bcrypt = require('bcrypt');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess, UserNotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prescriber... Remove this comment to see the full error message
const prescriberRepository = require('../../../../lib/infrastructure/repositories/prescriber-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Prescriber... Remove this comment to see the full error message
const Prescriber = require('../../../../lib/domain/read-models/Prescriber');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
const UserOrgaSettings = require('../../../../lib/domain/models/UserOrgaSettings');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('../../../../lib/domain/models/Tag');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | Prescriber', function () {
  const userToInsert = {
    firstName: 'estelle',
    lastName: 'popopo',
    email: 'estelle.popopo@example.net',
    lang: 'someSuperCoolLanguage',
    /* eslint-disable-next-line no-sync, mocha/no-setup-in-describe */
    password: bcrypt.hashSync('A124B2C3#!', 1),
    cgu: true,
    samlId: 'some-saml-id',
    shouldChangePassword: false,
  };

  let user: $TSFixMe;
  let organization: $TSFixMe;
  let membership: $TSFixMe;
  let userOrgaSettings: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getPrescriber', function () {
    let expectedPrescriber: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not a prescriber', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a ForbiddenAccess error', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(prescriberRepository.getPrescriber)(userId);

        // then
        expect(error).to.be.an.instanceOf(ForbiddenAccess);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is a prescriber', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        user = databaseBuilder.factory.buildUser(userToInsert);
        organization = databaseBuilder.factory.buildOrganization();
        membership = databaseBuilder.factory.buildMembership({
          id: 3000001,
          userId: user.id,
          organizationId: organization.id,
        });
        userOrgaSettings = databaseBuilder.factory.buildUserOrgaSettings({
          userId: user.id,
          currentOrganizationId: organization.id,
        });

        await databaseBuilder.commit();

        expectedPrescriber = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          pixOrgaTermsOfServiceAccepted: user.pixOrgaTermsOfServiceAccepted,
          lang: user.lang,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the found prescriber', async function () {
        // when
        const foundPrescriber = await prescriberRepository.getPrescriber(user.id);

        // then
        expect(foundPrescriber).to.be.an.instanceOf(Prescriber);
        expect(foundPrescriber.id).to.equal(expectedPrescriber.id);
        expect(foundPrescriber.firstName).to.equal(expectedPrescriber.firstName);
        expect(foundPrescriber.lastName).to.equal(expectedPrescriber.lastName);
        expect(foundPrescriber.pixOrgaTermsOfServiceAccepted).to.equal(
          expectedPrescriber.pixOrgaTermsOfServiceAccepted
        );
        expect(foundPrescriber.lang).to.equal(expectedPrescriber.lang);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a UserNotFoundError if no user is found', async function () {
        // given
        const nonExistentUserId = 678;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(prescriberRepository.getPrescriber)(nonExistentUserId);

        // then
        expect(result).to.be.instanceOf(UserNotFoundError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return memberships associated to the prescriber', async function () {
        // given
        expectedPrescriber.memberships = [membership];

        // when
        const foundPrescriber = await prescriberRepository.getPrescriber(user.id);

        // then
        const firstMembership = foundPrescriber.memberships[0];
        expect(firstMembership).to.be.an.instanceof(Membership);
        expect(firstMembership.id).to.equal(expectedPrescriber.memberships[0].id);

        const associatedOrganization = firstMembership.organization;
        expect(associatedOrganization).to.be.an.instanceof(Organization);
        expect(associatedOrganization.id).to.equal(organization.id);
        expect(associatedOrganization.code).to.equal(organization.code);
        expect(associatedOrganization.credit).to.equal(organization.credit);
        expect(associatedOrganization.name).to.equal(organization.name);
        expect(associatedOrganization.type).to.equal(organization.type);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return memberships ordered by id', async function () {
        // given
        const anotherMembership = databaseBuilder.factory.buildMembership({ id: 3000000, userId: user.id });
        expectedPrescriber.memberships = [membership, anotherMembership];
        await databaseBuilder.commit();

        // when
        const foundPrescriber = await prescriberRepository.getPrescriber(user.id);

        // then
        expect(foundPrescriber.memberships[0].id).to.equal(3000000);
        expect(foundPrescriber.memberships[1].id).to.equal(3000001);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user-orga-settings associated to the prescriber', async function () {
        // given
        expectedPrescriber.userOrgaSettings = userOrgaSettings;

        // when
        const foundUser = await prescriberRepository.getPrescriber(user.id);

        // then
        expect(foundUser.userOrgaSettings).to.be.an.instanceOf(UserOrgaSettings);
        expect(foundUser.userOrgaSettings.id).to.equal(expectedPrescriber.userOrgaSettings.id);
        expect(foundUser.userOrgaSettings.currentOrganization.id).to.equal(
          expectedPrescriber.userOrgaSettings.currentOrganizationId
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return prescriber despite that user-orga-settings does not exists', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        databaseBuilder.factory.buildMembership({ userId, organizationId });

        await databaseBuilder.commit();

        // when
        const foundPrescriber = await prescriberRepository.getPrescriber(userId);

        // then
        expect(foundPrescriber).to.be.an.instanceOf(Prescriber);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when current organization defined in user-orga-settings has tags', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a list of tags', async function () {
          // given
          const tag1 = databaseBuilder.factory.buildTag({ name: 'AGRICULTURE' });
          databaseBuilder.factory.buildOrganizationTag({ organizationId: organization.id, tagId: tag1.id });
          const tag2 = databaseBuilder.factory.buildTag({ name: 'OTHER' });
          databaseBuilder.factory.buildOrganizationTag({ organizationId: organization.id, tagId: tag2.id });

          await databaseBuilder.commit();

          // when
          const foundPrescriber = await prescriberRepository.getPrescriber(user.id);

          // then
          expect(foundPrescriber.userOrgaSettings.currentOrganization.tags.map((tag: $TSFixMe) => tag.name)).to.have.members([
            'OTHER',
            'AGRICULTURE',
          ]);
          expect(foundPrescriber.userOrgaSettings.currentOrganization.tags[0]).to.be.instanceOf(Tag);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when newYearOrganizationLearnersImportDate is defined in the env.', function () {
        let originalEnvValue: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          originalEnvValue = settings.features.newYearOrganizationLearnersImportDate;
          settings.features.newYearOrganizationLearnersImportDate = '2020-08-15T00:00:00Z';
        });

        // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
        afterEach(function () {
          settings.features.newYearOrganizationLearnersImportDate = originalEnvValue;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return areNewYearOrganizationLearnersImported as true if there is at least one organization-learners created after the date in the env. for the organization', async function () {
          // given
          const userId = databaseBuilder.factory.buildUser().id;
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({ userId, organizationId });
          databaseBuilder.factory.buildUserOrgaSettings({ userId, currentOrganizationId: organizationId });
          databaseBuilder.factory.buildOrganizationLearner({ organizationId, createdAt: new Date('2020-08-17') });
          await databaseBuilder.commit();

          // when
          const foundPrescriber = await prescriberRepository.getPrescriber(userId);

          // then
          expect(foundPrescriber.areNewYearOrganizationLearnersImported).to.be.true;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when newYearOrganizationLearnersImportDate is not defined in the env.', function () {
        let originalEnvValue: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          originalEnvValue = settings.features.newYearOrganizationLearnersImportDate;
          settings.features.newYearOrganizationLearnersImportDate = null;
        });

        // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
        afterEach(function () {
          settings.features.newYearOrganizationLearnersImportDate = originalEnvValue;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return areNewYearOrganizationLearnersImported as true if there is at least one organization-learners created for the organization', async function () {
          // given
          const userId = databaseBuilder.factory.buildUser().id;
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({ userId, organizationId });
          databaseBuilder.factory.buildUserOrgaSettings({ userId, currentOrganizationId: organizationId });
          databaseBuilder.factory.buildOrganizationLearner({ organizationId });
          await databaseBuilder.commit();

          // when
          const foundPrescriber = await prescriberRepository.getPrescriber(userId);

          // then
          expect(foundPrescriber.areNewYearOrganizationLearnersImported).to.be.true;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when prescriber has a user-orga-settings', function () {
        let originalEnvValue: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          originalEnvValue = settings.features.newYearOrganizationLearnersImportDate;
          settings.features.newYearOrganizationLearnersImportDate = '2020-08-15T00:00:00Z';
        });

        // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
        afterEach(function () {
          settings.features.newYearOrganizationLearnersImportDate = originalEnvValue;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return areNewYearOrganizationLearnersImported as true if there is at least one organization-learners created for the organization of the user-orga-settings', async function () {
          // given
          const userId = databaseBuilder.factory.buildUser().id;
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({ userId, organizationId });
          databaseBuilder.factory.buildUserOrgaSettings({ userId, currentOrganizationId: organizationId });
          databaseBuilder.factory.buildOrganizationLearner({ organizationId, createdAt: new Date('2020-08-17') });
          await databaseBuilder.commit();

          // when
          const foundPrescriber = await prescriberRepository.getPrescriber(userId);

          // then
          expect(foundPrescriber.areNewYearOrganizationLearnersImported).to.be.true;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return areNewYearOrganizationLearnersImported as false if there is no organization-learners created for the organization of the user-orga-settings', async function () {
          // given
          const userId = databaseBuilder.factory.buildUser().id;
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({ userId, organizationId });
          databaseBuilder.factory.buildUserOrgaSettings({ userId, currentOrganizationId: organizationId });
          databaseBuilder.factory.buildOrganizationLearner({ organizationId, createdAt: new Date('2020-07-17') });
          await databaseBuilder.commit();

          // when
          const foundPrescriber = await prescriberRepository.getPrescriber(userId);

          // then
          expect(foundPrescriber.areNewYearOrganizationLearnersImported).to.be.false;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when prescriber does not have a user-orga-settings', function () {
        let originalEnvValue: $TSFixMe;
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          originalEnvValue = settings.features.newYearOrganizationLearnersImportDate;
          settings.features.newYearOrganizationLearnersImportDate = '2020-08-15T00:00:00Z';
        });

        // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
        afterEach(function () {
          settings.features.newYearOrganizationLearnersImportDate = originalEnvValue;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return areNewYearOrganizationLearnersImported as true if there is at least one organization-learners created for the organization of the first membership', async function () {
          // given
          const userId = databaseBuilder.factory.buildUser().id;
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({ userId, organizationId });
          databaseBuilder.factory.buildOrganizationLearner({ organizationId, createdAt: new Date('2020-08-17') });
          await databaseBuilder.commit();

          // when
          const foundPrescriber = await prescriberRepository.getPrescriber(userId);

          // then
          expect(foundPrescriber.areNewYearOrganizationLearnersImported).to.be.true;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return areNewYearOrganizationLearnersImported as false if there is no organization-learners created for the organization of the first membership', async function () {
          // given
          const userId = databaseBuilder.factory.buildUser().id;
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({ userId, organizationId });
          databaseBuilder.factory.buildOrganizationLearner({ organizationId, createdAt: new Date('2020-07-17') });
          await databaseBuilder.commit();

          // when
          const foundPrescriber = await prescriberRepository.getPrescriber(userId);

          // then
          expect(foundPrescriber.areNewYearOrganizationLearnersImported).to.be.false;
        });
      });
    });
  });
});
