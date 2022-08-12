// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'each'.
const each = require('lodash/each');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'map'.
const map = require('lodash/map');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'times'.
const times = require('lodash/times');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pick'.
const pick = require('lodash/pick');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, catchErr, sinon } = require('../../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingEntityError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
const UserDetailsForAdmin = require('../../../../lib/domain/models/UserDetailsForAdmin');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../../../lib/domain/models/CertificationCenter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenterMembership = require('../../../../lib/domain/models/CertificationCenterMembership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerForAdmin = require('../../../../lib/domain/read-models/OrganizationLearnerForAdmin');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

const expectedUserDetailsForAdminAttributes = [
  'id',
  'firstName',
  'lastName',
  'birthdate',
  'division',
  'group',
  'organizationId',
  'organizationName',
  'createdAt',
  'updatedAt',
  'isDisabled',
  'canBeDissociated',
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | UserRepository', function () {
  const userToInsert = {
    firstName: 'Jojo',
    lastName: 'LaFripouille',
    email: 'jojo@example.net',
    cgu: true,
  };

  let userInDB: $TSFixMe;
  let passwordAuthenticationMethodInDB: $TSFixMe;
  let organizationInDB: $TSFixMe, organizationRoleInDB;
  let membershipInDB: $TSFixMe;
  let certificationCenterInDB: $TSFixMe;

  function _insertUserWithOrganizationsAndCertificationCenterAccesses() {
    organizationInDB = databaseBuilder.factory.buildOrganization({
      type: 'PRO',
      name: 'Mon Entreprise',
      code: 'ABCD12',
    });

    userInDB = databaseBuilder.factory.buildUser(userToInsert);
    passwordAuthenticationMethodInDB =
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId: userInDB.id,
        hashedPassword: 'ABCDEF1234',
        shouldChangePassword: false,
      });

    organizationRoleInDB = Membership.roles.ADMIN;

    membershipInDB = databaseBuilder.factory.buildMembership({
      userId: userInDB.id,
      organizationRole: organizationRoleInDB,
      organizationId: organizationInDB.id,
    });

    certificationCenterInDB = databaseBuilder.factory.buildCertificationCenter();

    databaseBuilder.factory.buildCertificationCenterMembership({
      userId: userInDB.id,
      certificationCenterId: certificationCenterInDB.id,
    });

    return databaseBuilder.commit();
  }

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('find user', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#getByEmail', function () {
      let userInDb: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        userInDb = databaseBuilder.factory.buildUser(userToInsert);
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should handle a rejection, when user id is not found', async function () {
        // given
        const emailThatDoesNotExist = '10093';

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(userRepository.getByEmail)(emailThatDoesNotExist);

        // then
        expect(result).to.be.instanceOf(NotFoundError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a domain user when found', async function () {
        // when
        const user = await userRepository.getByEmail(userInDb.email);

        // then
        expect(user.email).to.equal(userInDb.email);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a domain user when email case insensitive found', async function () {
        // given
        const uppercaseEmailAlreadyInDb = userInDb.email.toUpperCase();

        // when
        const user = await userRepository.getByEmail(uppercaseEmailAlreadyInDb);

        // then
        expect(user.email).to.equal(userInDb.email);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a domain user when email match (case insensitive)', async function () {
        // given
        const mixCaseEmail = 'USER@example.net';
        databaseBuilder.factory.buildUser({ email: mixCaseEmail });
        await databaseBuilder.commit();

        // when
        const foundUser = await userRepository.getByEmail(mixCaseEmail.toLowerCase());

        // then
        expect(foundUser).to.exist;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#getBySamlId', function () {
      let userInDb: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        userInDb = databaseBuilder.factory.buildUser(userToInsert);
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'some-saml-id',
          userId: userInDb.id,
        });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user informations for the given SAML ID', async function () {
        // when
        const user = await userRepository.getBySamlId('some-saml-id');

        // then
        expect(user).to.be.an.instanceof(User);
        expect(user.id).to.equal(userInDb.id);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return undefined when no user was found with this SAML ID', async function () {
        // given
        const badSamlId = 'bad-saml-id';

        // when
        const user = await userRepository.getBySamlId(badSamlId);

        // then
        return expect(user).to.be.null;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#findByExternalIdentifier', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user informations for the given external identity id and identity provider', async function () {
        // given
        const externalIdentityId = 'external-identity-id';
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
          externalIdentifier: externalIdentityId,
          userId,
        });
        await databaseBuilder.commit();

        // when
        const foundUser = await userRepository.findByExternalIdentifier({
          externalIdentityId,
          identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        });

        // then
        expect(foundUser).to.be.an.instanceof(User);
        expect(foundUser.id).to.equal(userId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return undefined when no user was found with this external identity id', async function () {
        // given
        const badId = 'not-exist-external-identity-id';

        // when
        const foundUser = await userRepository.findByExternalIdentifier({
          externalIdentityId: badId,
          identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        });

        // then
        return expect(foundUser).to.be.null;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null when the identity provider provided is PIX', async function () {
        // given
        const externalIdentityId = 'external-identity-id';
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          userId,
        });
        await databaseBuilder.commit();

        // when
        const foundUser = await userRepository.findByExternalIdentifier({
          externalIdentityId,
          identityProvider: AuthenticationMethod.identityProviders.PIX,
        });

        // then
        expect(foundUser).to.be.null;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getForObfuscation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a domain user with authentication methods only when found', async function () {
      // given
      const userInDb = databaseBuilder.factory.buildUser(userToInsert);
      await databaseBuilder.commit();

      // when
      const user = await userRepository.getForObfuscation(userInDb.id);

      // then
      expect(user.username).to.equal(userInDb.username);
      expect(user.email).to.equal(userInDb.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when user not found', async function () {
      // given
      const userIdThatDoesNotExist = '99999';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(userRepository.getForObfuscation)(userIdThatDoesNotExist);

      // then
      expect(result).to.be.instanceOf(UserNotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get user', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#get', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the found user', async function () {
        // given
        const userInDb = databaseBuilder.factory.buildUser(userToInsert);
        await databaseBuilder.commit();

        // when
        const user = await userRepository.get(userInDb.id);

        // then
        expect(user).to.be.an.instanceOf(User);
        expect(user.id).to.equal(userInDb.id);
        expect(user.firstName).to.equal(userInDb.firstName);
        expect(user.lastName).to.equal(userInDb.lastName);
        expect(user.email).to.equal(userInDb.email);
        expect(user.cgu).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a UserNotFoundError if no user is found', async function () {
        // given
        const nonExistentUserId = 678;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(userRepository.get)(nonExistentUserId);

        // then
        expect(result).to.be.instanceOf(UserNotFoundError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#getById', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the found user', async function () {
        // given
        const user = databaseBuilder.factory.buildUser({
          id: 1092,
        });
        await databaseBuilder.commit();

        // when
        const result = await userRepository.getById(user.id);

        // then
        expect(result).to.be.an.instanceOf(User);
        expect(result.id).to.equal(1092);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a UserNotFoundError if no user is found', async function () {
        // given
        const nonExistentUserId = 678;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(userRepository.getById)(nonExistentUserId);

        // then
        expect(result).to.be.instanceOf(UserNotFoundError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#getByUsernameOrEmailWithRolesAndPassword', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        await _insertUserWithOrganizationsAndCertificationCenterAccesses();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user informations for the given email', async function () {
        // given
        const expectedUser = new User(userInDB);

        // when
        const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(userInDB.email);

        // then
        expect(foundUser).to.be.an.instanceof(User);
        expect(foundUser.id).to.equal(expectedUser.id);
        expect(foundUser.firstName).to.equal(expectedUser.firstName);
        expect(foundUser.lastName).to.equal(expectedUser.lastName);
        expect(foundUser.username).to.equal(expectedUser.username);
        expect(foundUser.email).to.equal(expectedUser.email);
        expect(foundUser.cgu).to.equal(expectedUser.cgu);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user informations for the given email (case insensitive)', async function () {
        // given
        const expectedUser = new User(userInDB);
        const uppercaseEmailAlreadyInDb = userInDB.email.toUpperCase();

        // when
        const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(uppercaseEmailAlreadyInDb);

        // then
        expect(foundUser).to.be.an.instanceof(User);
        expect(foundUser.id).to.equal(expectedUser.id);
        expect(foundUser.email).to.equal(expectedUser.email);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user informations for the given username', async function () {
        // given
        const expectedUser = new User(userInDB);

        // when
        const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(userInDB.username);

        // then
        expect(foundUser).to.be.an.instanceof(User);
        expect(foundUser.id).to.equal(expectedUser.id);
        expect(foundUser.firstName).to.equal(expectedUser.firstName);
        expect(foundUser.lastName).to.equal(expectedUser.lastName);
        expect(foundUser.username).to.equal(expectedUser.username);
        expect(foundUser.email).to.equal(expectedUser.email);
        expect(foundUser.cgu).to.equal(expectedUser.cgu);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return authenticationMethods associated to the user', async function () {
        // when
        const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(userInDB.email);

        // then
        expect(foundUser.authenticationMethods).to.be.an('array');
        expect(foundUser.authenticationMethods).to.have.lengthOf(1);

        const firstAuthenticationMethod = foundUser.authenticationMethods[0];
        expect(firstAuthenticationMethod.identityProvider).to.equal(passwordAuthenticationMethodInDB.identityProvider);
        expect(firstAuthenticationMethod.userId).to.equal(passwordAuthenticationMethodInDB.userId);
        expect(firstAuthenticationMethod.externalIdentifier).to.equal(
          passwordAuthenticationMethodInDB.externalIdentifier
        );
        expect(firstAuthenticationMethod.authenticationComplement).to.deep.equal(
          passwordAuthenticationMethodInDB.authenticationComplement
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should only return actives certification center membership associated to the user', async function () {
        // given
        const now = new Date();
        const email = 'lilou@example.net';
        const user = databaseBuilder.factory.buildUser({ email });
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
        const otherCertificationCenter = databaseBuilder.factory.buildCertificationCenter();
        const activeCertificationCenterMembership = databaseBuilder.factory.buildCertificationCenterMembership({
          userId: user.id,
          certificationCenterId: certificationCenter.id,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          userId: user.id,
          certificationCenterId: otherCertificationCenter.id,
          disabledAt: now,
        });
        await databaseBuilder.commit();

        // when
        const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(email);

        // then
        const certificationCenterMembership = foundUser.certificationCenterMemberships[0];
        expect(foundUser.certificationCenterMemberships).to.have.lengthOf(1);
        expect(certificationCenterMembership.id).to.equal(activeCertificationCenterMembership.id);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return membership associated to the user', async function () {
        // when
        const user = await userRepository.getByUsernameOrEmailWithRolesAndPassword(userInDB.email);

        // then
        expect(user.memberships).to.be.an('array');
        expect(user.memberships).to.have.lengthOf(1);

        const firstMembership = user.memberships[0];
        expect(firstMembership).to.be.an.instanceof(Membership);
        expect(firstMembership.id).to.equal(membershipInDB.id);

        const associatedOrganization = firstMembership.organization;
        expect(associatedOrganization).to.be.an.instanceof(Organization);
        expect(associatedOrganization.id).to.equal(organizationInDB.id);
        expect(associatedOrganization.code).to.equal(organizationInDB.code);
        expect(associatedOrganization.name).to.equal(organizationInDB.name);
        expect(associatedOrganization.type).to.equal(organizationInDB.type);

        expect(firstMembership.organizationRole).to.equal(membershipInDB.organizationRole);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the membership associated to the user has been disabled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not return the membership', async function () {
          // given
          const userInDB = databaseBuilder.factory.buildUser();
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({
            userId: userInDB.id,
            organizationId,
            disabledAt: new Date(),
          });
          await databaseBuilder.commit();

          // when
          const user = await userRepository.getByUsernameOrEmailWithRolesAndPassword(userInDB.email);

          // then
          expect(user.memberships).to.be.an('array');
          expect(user.memberships).to.be.empty;
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return certification center membership associated to the user', async function () {
        // when
        const user = await userRepository.getByUsernameOrEmailWithRolesAndPassword(userInDB.email);

        // then
        expect(user.certificationCenterMemberships).to.be.an('array');

        const firstMembership = user.certificationCenterMemberships[0];
        expect(firstMembership).to.be.an.instanceof(CertificationCenterMembership);
        expect(firstMembership.certificationCenter.id).to.equal(certificationCenterInDB.id);
        expect(firstMembership.certificationCenter.name).to.equal(certificationCenterInDB.name);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with a UserNotFound error when no user was found with this email', async function () {
        // given
        const unusedEmail = 'kikou@pix.fr';

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(userRepository.getByUsernameOrEmailWithRolesAndPassword)(unusedEmail);

        // then
        expect(result).to.be.instanceOf(UserNotFoundError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with a UserNotFound error when no user was found with this username', async function () {
        // given
        const unusedUsername = 'john.doe0909';

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(userRepository.getByUsernameOrEmailWithRolesAndPassword)(unusedUsername);

        // then
        expect(result).to.be.instanceOf(UserNotFoundError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#getWithMemberships', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        await _insertUserWithOrganizationsAndCertificationCenterAccesses();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user for the given id', async function () {
        // given
        const expectedUser = new User(userInDB);

        // when
        const user = await userRepository.getWithMemberships(userInDB.id);

        // then
        expect(user).to.be.an.instanceof(User);
        expect(user.id).to.equal(expectedUser.id);
        expect(user.firstName).to.equal(expectedUser.firstName);
        expect(user.lastName).to.equal(expectedUser.lastName);
        expect(user.email).to.equal(expectedUser.email);
        expect(user.password).to.equal((expectedUser as $TSFixMe).password);
        expect(user.cgu).to.equal(expectedUser.cgu);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return membership associated to the user', async function () {
        // when
        const user = await userRepository.getWithMemberships(userInDB.id);

        // then
        expect(user.memberships).to.be.an('array');
        expect(user.memberships).to.have.lengthOf(1);

        const membership = user.memberships[0];
        expect(membership).to.be.an.instanceof(Membership);
        expect(membership.id).to.equal(membershipInDB.id);

        const associatedOrganization = membership.organization;
        expect(associatedOrganization).to.be.an.instanceof(Organization);
        expect(associatedOrganization.id).to.equal(organizationInDB.id);
        expect(associatedOrganization.code).to.equal(organizationInDB.code);
        expect(associatedOrganization.name).to.equal(organizationInDB.name);
        expect(associatedOrganization.type).to.equal(organizationInDB.type);

        expect(membership.organizationRole).to.equal(membershipInDB.organizationRole);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the membership associated to the user has been disabled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not return the membership', async function () {
          // given
          const userId = databaseBuilder.factory.buildUser().id;
          const organizationId = databaseBuilder.factory.buildOrganization().id;
          databaseBuilder.factory.buildMembership({
            userId,
            organizationId,
            disabledAt: new Date(),
          });
          await databaseBuilder.commit();

          // when
          const user = await userRepository.getWithMemberships(userId);

          // then
          expect(user.memberships).to.be.an('array');
          expect(user.memberships).to.be.empty;
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with a UserNotFound error when no user was found with the given id', async function () {
        // given
        const unknownUserId = 666;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(userRepository.getWithMemberships)(unknownUserId);

        // then
        expect(result).to.be.instanceOf(UserNotFoundError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#getWithCertificationCenterMemberships', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return user for the given id', async function () {
        // given
        await _insertUserWithOrganizationsAndCertificationCenterAccesses();
        const expectedUser = new User(userInDB);

        // when
        const user = await userRepository.getWithCertificationCenterMemberships(userInDB.id);

        // then
        expect(user).to.be.an.instanceof(User);
        expect(user.id).to.equal(expectedUser.id);
        expect(user.firstName).to.equal(expectedUser.firstName);
        expect(user.lastName).to.equal(expectedUser.lastName);
        expect(user.email).to.equal(expectedUser.email);
        expect(user.password).to.equal((expectedUser as $TSFixMe).password);
        expect(user.cgu).to.equal(expectedUser.cgu);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return actives certification center membership associated to the user', async function () {
        // when
        const userInDB = databaseBuilder.factory.buildUser(userToInsert);
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
        const otherCertificationCenter = databaseBuilder.factory.buildCertificationCenter();
        const certificationCenterMembership = databaseBuilder.factory.buildCertificationCenterMembership({
          userId: userInDB.id,
          certificationCenterId: certificationCenter.id,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          userId: userInDB.id,
          certificationCenterId: otherCertificationCenter.id,
          disabledAt: new Date(),
        });

        await databaseBuilder.commit();

        // when
        const user = await userRepository.getWithCertificationCenterMemberships(userInDB.id);

        // then
        expect(user.certificationCenterMemberships.length).to.equal(1);

        const foundCertificationCenterMembership = user.certificationCenterMemberships[0];
        expect(foundCertificationCenterMembership).to.be.an.instanceof(CertificationCenterMembership);
        expect(foundCertificationCenterMembership.id).to.equal(certificationCenterMembership.id);

        const associatedCertificationCenter = foundCertificationCenterMembership.certificationCenter;
        expect(associatedCertificationCenter).to.be.an.instanceof(CertificationCenter);
        expect(associatedCertificationCenter.id).to.equal(certificationCenter.id);
        expect(associatedCertificationCenter.name).to.equal(certificationCenter.name);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with a UserNotFound error when no user was found with the given id', async function () {
        // given
        await _insertUserWithOrganizationsAndCertificationCenterAccesses();
        const unknownUserId = 666;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(userRepository.getWithCertificationCenterMemberships)(unknownUserId);

        // then
        expect(result).to.be.instanceOf(UserNotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getUserDetailsForAdmin', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the found user', async function () {
      // given
      const emailConfirmedAt = new Date('2022-01-01');
      const lastTermsOfServiceValidatedAt = new Date('2022-01-02');
      const lastPixOrgaTermsOfServiceValidatedAt = new Date('2022-01-03');
      const lastLoggedAt = new Date('2022-01-04');
      const now = new Date();
      const userInDB = databaseBuilder.factory.buildUser({
        firstName: 'Henri',
        lastName: 'Cochet',
        email: 'henri-cochet@example.net',
        cgu: true,
        lang: 'en',
        createdAt: now,
        lastTermsOfServiceValidatedAt,
        lastPixOrgaTermsOfServiceValidatedAt,
        lastPixCertifTermsOfServiceValidatedAt: lastLoggedAt,
        lastLoggedAt,
        emailConfirmedAt,
      });
      await databaseBuilder.commit();

      // when
      const userDetailsForAdmin = await userRepository.getUserDetailsForAdmin(userInDB.id);

      // then
      expect(userDetailsForAdmin).to.be.an.instanceOf(UserDetailsForAdmin);
      expect(userDetailsForAdmin.id).to.equal(userInDB.id);
      expect(userDetailsForAdmin.firstName).to.equal('Henri');
      expect(userDetailsForAdmin.lastName).to.equal('Cochet');
      expect(userDetailsForAdmin.email).to.equal('henri-cochet@example.net');
      expect(userDetailsForAdmin.cgu).to.be.true;
      expect(userDetailsForAdmin.createdAt).to.deep.equal(now);
      expect(userDetailsForAdmin.lang).to.equal('en');
      expect(userDetailsForAdmin.lastTermsOfServiceValidatedAt).to.deep.equal(lastTermsOfServiceValidatedAt);
      expect(userDetailsForAdmin.lastPixOrgaTermsOfServiceValidatedAt).to.deep.equal(
        lastPixOrgaTermsOfServiceValidatedAt
      );
      expect(userDetailsForAdmin.lastPixCertifTermsOfServiceValidatedAt).to.deep.equal(lastLoggedAt);
      expect(userDetailsForAdmin.lastLoggedAt).to.deep.equal(lastLoggedAt);
      expect(userDetailsForAdmin.emailConfirmedAt).to.deep.equal(emailConfirmedAt);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a UserNotFoundError if no user is found', async function () {
      // given
      const nonExistentUserId = 678;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(userRepository.getUserDetailsForAdmin)(nonExistentUserId);

      // then
      expect(result).to.be.instanceOf(UserNotFoundError);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has organizationLearners', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the user with his organizationLearner', async function () {
        // given
        const userInDB = databaseBuilder.factory.buildUser(userToInsert);
        const firstOrganizationInDB = databaseBuilder.factory.buildOrganization();
        const firstOrganizationLearnerInDB = databaseBuilder.factory.buildOrganizationLearner({
          id: 1,
          userId: userInDB.id,
          organizationId: firstOrganizationInDB.id,
        });
        const secondOrganizationInDB = databaseBuilder.factory.buildOrganization();
        const secondOrganizationLearnerInDB = databaseBuilder.factory.buildOrganizationLearner({
          id: 2,
          userId: userInDB.id,
          organizationId: secondOrganizationInDB.id,
        });
        await databaseBuilder.commit();

        // when
        const userDetailsForAdmin = await userRepository.getUserDetailsForAdmin(userInDB.id);

        // then
        expect(userDetailsForAdmin.organizationLearners.length).to.equal(2);
        const organizationLearners = userDetailsForAdmin.organizationLearners;
        expect(organizationLearners[0]).to.be.instanceOf(OrganizationLearnerForAdmin);

        const expectedOrganizationLearners = [
          {
            ...firstOrganizationLearnerInDB,
            organizationName: firstOrganizationInDB.name,
            canBeDissociated: firstOrganizationInDB.isManagingStudents,
          },
          {
            ...secondOrganizationLearnerInDB,
            organizationName: secondOrganizationInDB.name,
            canBeDissociated: secondOrganizationInDB.isManagingStudents,
          },
        ].map((organizationLearner) => pick(organizationLearner, expectedUserDetailsForAdminAttributes));
        expect(organizationLearners).to.deep.equal(expectedOrganizationLearners);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has authentication methods', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the user with his authentication methods', async function () {
        // given
        const userInDB = databaseBuilder.factory.buildUser(userToInsert);
        databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          userId: userInDB.id,
        });
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({ userId: userInDB.id });
        await databaseBuilder.commit();

        // when
        const userDetailsForAdmin = await userRepository.getUserDetailsForAdmin(userInDB.id);

        // then
        expect(userDetailsForAdmin.authenticationMethods.length).to.equal(2);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkIfEmailIsAvailable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the email when the email is not registered', async function () {
      // when
      const email = await userRepository.checkIfEmailIsAvailable('email@example.net');

      // then
      expect(email).to.equal('email@example.net');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an AlreadyRegisteredEmailError when it already exists', async function () {
      // given
      const userInDb = databaseBuilder.factory.buildUser(userToInsert);
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(userRepository.checkIfEmailIsAvailable)(userInDb.email);

      // then
      expect(result).to.be.instanceOf(AlreadyRegisteredEmailError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an AlreadyRegisteredEmailError when email case insensitive already exists', async function () {
      // given
      const upperCaseEmail = 'TEST@example.net';
      const lowerCaseEmail = 'test@example.net';
      databaseBuilder.factory.buildUser({ email: upperCaseEmail });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(userRepository.checkIfEmailIsAvailable)(lowerCaseEmail);

      // then
      expect(result).to.be.instanceOf(AlreadyRegisteredEmailError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateEmail', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the user email', async function () {
      // given
      const newEmail = 'new_email@example.net';
      const userInDb = databaseBuilder.factory.buildUser({ ...userToInsert, email: 'old_email@example.net' });
      await databaseBuilder.commit();

      // when
      const updatedUser = await userRepository.updateEmail({ id: userInDb.id, email: newEmail });

      // then
      expect(updatedUser).to.be.an.instanceOf(User);
      expect(updatedUser.email).to.equal(newEmail);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateWithEmailConfirmed', function () {
    let userInDb: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userInDb = databaseBuilder.factory.buildUser({ ...userToInsert, email: 'old_email@example.net', cgu: false });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the user email', async function () {
      // given
      const newEmail = 'new_email@example.net';
      const userAttributes = {
        cgu: true,
        email: newEmail,
        emailConfirmedAt: new Date('2020-12-15T00:00:00Z'),
      };

      // when
      await userRepository.updateWithEmailConfirmed({ id: userInDb.id, userAttributes });

      // then
      const [updatedUser] = await knex('users').where({ id: userInDb.id });
      expect(updatedUser.emailConfirmedAt.toString()).to.equal(userAttributes.emailConfirmedAt.toString());
      expect(updatedUser.email).to.equal(userAttributes.email);
      expect(updatedUser.cgu).to.equal(userAttributes.cgu);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should rollback the user email in case of error in transaction', async function () {
      // given
      const newEmail = 'new_email@example.net';
      const userAttributes = {
        cgu: true,
        email: newEmail,
        emailConfirmedAt: new Date('2020-12-15T00:00:00Z'),
      };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async () => {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await userRepository.updateWithEmailConfirmed({ id: userInDb.id, userAttributes }, domainTransaction);
          throw new Error('Error occurs in transaction');
        });
      });

      // then
      const [updatedUser] = await knex('users').where({ id: userInDb.id });
      expect(updatedUser.emailConfirmedAt).to.be.null;
      expect(updatedUser.email).to.equal(userInDb.email);
      expect(updatedUser.cgu).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateUserAttributes', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update lang of the user', async function () {
      // given
      const userInDb = databaseBuilder.factory.buildUser(userToInsert);
      await databaseBuilder.commit();

      const userAttributes = {
        lang: 'en',
      };

      // when
      const updatedUser = await userRepository.updateUserAttributes(userInDb.id, userAttributes);

      // then
      expect(updatedUser).to.be.an.instanceOf(User);
      expect(updatedUser.lang).to.equal(userAttributes.lang);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotFoundError when user id not found', async function () {
      // given
      const wrongUserId = 0;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(userRepository.updateUserAttributes)(wrongUserId, { lang: 'en' });

      // then
      expect(error).to.be.instanceOf(UserNotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateUserDetailsForAdministration', function () {
    let userInDb: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userInDb = databaseBuilder.factory.buildUser(userToInsert);
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        externalIdentifier: 'samlId',
        userId: userInDb.id,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update firstName,lastName,email of the user', async function () {
      // given
      const patchUserFirstNameLastNameEmail = {
        id: userInDb.id,
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'firstname.lastname@example.net',
      };

      // when
      const updatedUser = await userRepository.updateUserDetailsForAdministration(
        userInDb.id,
        patchUserFirstNameLastNameEmail
      );

      // then
      expect(updatedUser).to.be.an.instanceOf(UserDetailsForAdmin);
      expect(updatedUser.firstName).to.equal(patchUserFirstNameLastNameEmail.firstName);
      expect(updatedUser.lastName).to.equal(patchUserFirstNameLastNameEmail.lastName);
      expect(updatedUser.email).to.equal(patchUserFirstNameLastNameEmail.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update email of the user', async function () {
      // given
      const patchUserFirstNameLastNameEmail = {
        id: userInDb.id,
        email: 'partielupdate@hotmail.com',
      };

      // when
      const updatedUser = await userRepository.updateUserDetailsForAdministration(
        userInDb.id,
        patchUserFirstNameLastNameEmail
      );

      // then
      expect(updatedUser).to.be.an.instanceOf(UserDetailsForAdmin);
      expect(updatedUser.email).to.equal(patchUserFirstNameLastNameEmail.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update username of the user', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({
        email: null,
        username: 'current.username',
      }).id;
      await databaseBuilder.commit();

      const userPropertiesToUpdate = {
        username: 'username.updated',
      };

      // when
      const updatedUser = await userRepository.updateUserDetailsForAdministration(userId, userPropertiesToUpdate);

      // then
      expect(updatedUser).to.be.an.instanceOf(UserDetailsForAdmin);
      expect(updatedUser.username).to.equal(userPropertiesToUpdate.username);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AlreadyExistingEntityError when username is already used', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({
        email: null,
        username: 'current.username',
      }).id;
      databaseBuilder.factory.buildUser({
        email: null,
        username: 'already.exist.username',
      });
      await databaseBuilder.commit();

      const userPropertiesToUpdate = {
        username: 'already.exist.username',
      };
      const expectedErrorMessage = 'Cette adresse e-mail ou cet identifiant est déjà utilisé(e).';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(userRepository.updateUserDetailsForAdministration)(userId, userPropertiesToUpdate);

      // then
      expect(error).to.be.instanceOf(AlreadyExistingEntityError);
      expect((error as $TSFixMe).message).to.equal(expectedErrorMessage);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotFoundError when user id not found', async function () {
      // given
      const wrongUserId = 0;
      const patchUserFirstNameLastNameEmail = {
        email: 'partielupdate@hotmail.com',
      };

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(userRepository.updateUserDetailsForAdministration)(
        wrongUserId,
        patchUserFirstNameLastNameEmail
      );

      // then
      expect(error).to.be.instanceOf(UserNotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateUsername', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the username', async function () {
      // given
      const username = 'blue.carter0701';
      const userId = databaseBuilder.factory.buildUser(userToInsert).id;
      await databaseBuilder.commit();

      // when
      const updatedUser = await userRepository.updateUsername({
        id: userId,
        username,
      });

      // then
      expect(updatedUser).to.be.an.instanceOf(User);
      expect(updatedUser.username).to.equal(username);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw UserNotFoundError when user id not found', async function () {
      // given
      const wrongUserId = 0;
      const username = 'blue.carter0701';

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(userRepository.updateUsername)({
        id: wrongUserId,
        username,
      });

      // then
      expect(error).to.be.instanceOf(UserNotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isUserExistingByEmail', function () {
    const email = 'shi@fu.fr';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      databaseBuilder.factory.buildUser({ email });
      databaseBuilder.factory.buildUser();
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the user exists by email', async function () {
      const userExists = await userRepository.isUserExistingByEmail(email);
      expect(userExists).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the user exists by email (case insensitive)', async function () {
      // given
      const uppercaseEmailAlreadyInDb = email.toUpperCase();

      // when
      const userExists = await userRepository.isUserExistingByEmail(uppercaseEmailAlreadyInDb);

      // then
      expect(userExists).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when the user does not exist by email', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(userRepository.isUserExistingByEmail)('none');
      expect(err).to.be.instanceOf(NotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedFiltered', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are users in the database', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an array of users', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };
        times(3, databaseBuilder.factory.buildUser);
        await databaseBuilder.commit();

        // when
        const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(matchingUsers).to.exist;
        expect(matchingUsers).to.have.lengthOf(3);
        expect(matchingUsers[0]).to.be.an.instanceOf(User);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lots of users (> 10) in the database', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated matching users', async function () {
        // given
        const filter = {};
        const page = { number: 1, size: 3 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 4, rowCount: 12 };
        times(12, databaseBuilder.factory.buildUser);
        await databaseBuilder.commit();

        // when
        const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(matchingUsers).to.have.lengthOf(3);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple users matching the same "first name" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildUser({ firstName: 'Son Gohan' });
        databaseBuilder.factory.buildUser({ firstName: 'Son Goku' });
        databaseBuilder.factory.buildUser({ firstName: 'Son Goten' });
        databaseBuilder.factory.buildUser({ firstName: 'Vegeta' });
        databaseBuilder.factory.buildUser({ firstName: 'Piccolo' });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only users matching "first name" if given in filter', async function () {
        // given
        const filter = { firstName: 'Go' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

        // when
        const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(map(matchingUsers, 'firstName')).to.have.members(['Son Gohan', 'Son Goku', 'Son Goten']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple users matching the same "last name" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        each(
          [
            { firstName: 'Anakin', lastName: 'Skywalker' },
            { firstName: 'Luke', lastName: 'Skywalker' },
            { firstName: 'Leia', lastName: 'Skywalker' },
            { firstName: 'Han', lastName: 'Solo' },
            { firstName: 'Ben', lastName: 'Solo' },
          ],
          (user: $TSFixMe) => {
            databaseBuilder.factory.buildUser(user);
          }
        );

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only users matching "last name" if given in filter', async function () {
        // given
        const filter = { lastName: 'walk' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

        // when
        const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(map(matchingUsers, 'firstName')).to.have.members(['Anakin', 'Luke', 'Leia']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple users matching the same "email" search pattern', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        each(
          [
            { email: 'playpus@pix.fr' },
            { email: 'panda@pix.fr' },
            { email: 'otter@pix.fr' },
            { email: 'playpus@example.net' },
            { email: 'panda@example.net' },
            { email: 'PANDA@example.net' },
            { email: 'PANDA@PIX.be' },
          ],
          (user: $TSFixMe) => {
            databaseBuilder.factory.buildUser(user);
          }
        );

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only users matching "email" if given in filter even if it is in uppercase in database', async function () {
        // given
        const filter = { email: 'panda' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 4 };

        // when
        const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(map(matchingUsers, 'email')).to.have.members([
          'panda@pix.fr',
          'panda@example.net',
          'panda@example.net',
          'panda@pix.be',
        ]);
        expect(pagination).to.deep.equal(expectedPagination);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only users matching "email" if given in filter', async function () {
        // given
        const filter = { email: 'pix.fr' };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

        // when
        const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(map(matchingUsers, 'email')).to.have.members(['playpus@pix.fr', 'panda@pix.fr', 'otter@pix.fr']);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are multiple users matching the same "username" search pattern', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only users matching "username" if given in filter', async function () {
        // given
        each(
          [
            { username: 'alex.ception1011' },
            { username: 'alex.terieur1011' },
            { username: 'ella.danloss0101' },
            { username: 'ella.bienhu1011' },
            { username: 'ella.bienhu2312' },
          ],
          (user: $TSFixMe) => {
            databaseBuilder.factory.buildUser(user);
          }
        );
        await databaseBuilder.commit();
        const filter = { username: '1011' };
        const page = { number: 1, size: 10 };

        // when
        const { models: matchingUsers } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(map(matchingUsers, 'username')).to.have.members([
          'alex.ception1011',
          'alex.terieur1011',
          'ella.bienhu1011',
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when there are multiple users matching the fields "first name", "last name" and "email" search pattern',
      function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          each(
            [
              // Matching users
              { firstName: 'fn_ok_1', lastName: 'ln_ok_1', email: 'email_ok_1@mail.com', username: 'username_ok0210' },
              { firstName: 'fn_ok_2', lastName: 'ln_ok_2', email: 'email_ok_2@mail.com', username: 'username_ok1214' },
              { firstName: 'fn_ok_3', lastName: 'ln_ok_3', email: 'email_ok_3@mail.com', username: 'username_ok1010' },

              // Unmatching users
              { firstName: 'fn_ko_4', lastName: 'ln_ok_4', email: 'email_ok_4@mail.com', username: 'username_ko1309' },
              { firstName: 'fn_ok_5', lastName: 'ln_ko_5', email: 'email_ok_5@mail.com', username: 'username_ok1911' },
              { firstName: 'fn_ok_6', lastName: 'ln_ok_6', email: 'email_ko_6@mail.com', username: 'username_ok2010' },
            ],
            (user: $TSFixMe) => {
              databaseBuilder.factory.buildUser(user);
            }
          );

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return only users matching "first name" AND "last name" AND "email" AND "username" if given in filter', async function () {
          // given
          const filter = { firstName: 'fn_ok', lastName: 'ln_ok', email: 'email_ok', username: 'username_ok' };
          const page = { number: 1, size: 10 };
          const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 3 };

          // when
          const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

          // then
          expect(map(matchingUsers, 'firstName')).to.have.members(['fn_ok_1', 'fn_ok_2', 'fn_ok_3']);
          expect(map(matchingUsers, 'lastName')).to.have.members(['ln_ok_1', 'ln_ok_2', 'ln_ok_3']);
          expect(map(matchingUsers, 'email')).to.have.members([
            'email_ok_1@mail.com',
            'email_ok_2@mail.com',
            'email_ok_3@mail.com',
          ]);
          expect(map(matchingUsers, 'username')).to.have.members([
            'username_ok0210',
            'username_ok1214',
            'username_ok1010',
          ]);
          expect(pagination).to.deep.equal(expectedPagination);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are filter that should be ignored', function () {
      let firstUserId: $TSFixMe;
      let secondUserId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        firstUserId = databaseBuilder.factory.buildUser().id;
        secondUserId = databaseBuilder.factory.buildUser().id;

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should ignore the filter and retrieve all users', async function () {
        // given
        const filter = { id: firstUserId };
        const page = { number: 1, size: 10 };
        const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

        // when
        const { models: matchingUsers, pagination } = await userRepository.findPaginatedFiltered({ filter, page });

        // then
        expect(map(matchingUsers, 'id')).to.have.members([firstUserId, secondUserId]);
        expect(pagination).to.deep.equal(expectedPagination);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateHasSeenAssessmentInstructionsToTrue', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the model with hasSeenAssessmentInstructions flag updated to true', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({ hasSeenAssessmentInstructions: false }).id;
      await databaseBuilder.commit();

      // when
      const actualUser = await userRepository.updateHasSeenAssessmentInstructionsToTrue(userId);

      // then
      expect(actualUser.hasSeenAssessmentInstructions).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#acceptPixLastTermsOfService', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should validate the last terms of service and save the date of acceptance ', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({
        mustValidateTermsOfService: true,
        lastTermsOfServiceValidatedAt: null,
      }).id;
      await databaseBuilder.commit();

      // when
      const actualUser = await userRepository.acceptPixLastTermsOfService(userId);

      // then
      expect(actualUser.lastTermsOfServiceValidatedAt).to.be.exist;
      expect(actualUser.lastTermsOfServiceValidatedAt).to.be.a('Date');
      expect(actualUser.mustValidateTermsOfService).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updatePixOrgaTermsOfServiceAcceptedToTrue', function () {
    let clock: $TSFixMe;
    const now = new Date('2021-01-02');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(now);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the model with pixOrgaTermsOfServiceAccepted flag updated to true', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({ pixOrgaTermsOfServiceAccepted: false }).id;
      await databaseBuilder.commit();

      // when
      const result = await userRepository.updatePixOrgaTermsOfServiceAcceptedToTrue(userId);

      // then
      expect(result).to.be.an.instanceof(User);
      expect(result.pixOrgaTermsOfServiceAccepted).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the lastPixOrgaTermsOfServiceValidatedAt', async function () {
      // given
      const user = databaseBuilder.factory.buildUser({
        pixOrgaTermsOfServiceAccepted: true,
        lastPixOrgaTermsOfServiceValidatedAt: new Date('2020-01-01T00:00:00Z'),
      });
      await databaseBuilder.commit();

      // when
      const result = await userRepository.updatePixOrgaTermsOfServiceAcceptedToTrue(user.id);

      // then
      expect(result.lastPixOrgaTermsOfServiceValidatedAt).to.deep.equal(now);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updatePixCertifTermsOfServiceAcceptedToTrue', function () {
    let clock: $TSFixMe;
    const now = new Date('2021-01-02');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(now);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the model with pixCertifTermsOfServiceAccepted flag updated to true', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({ pixCertifTermsOfServiceAccepted: false }).id;
      await databaseBuilder.commit();

      // when
      const actualUser = await userRepository.updatePixCertifTermsOfServiceAcceptedToTrue(userId);

      // then
      expect(actualUser).to.be.an.instanceof(User);
      expect(actualUser.pixCertifTermsOfServiceAccepted).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the pixCertifTermsOfServiceValidatedAt', async function () {
      // given
      const user = databaseBuilder.factory.buildUser({
        pixCertifTermsOfServiceAccepted: true,
        lastPixCertifTermsOfServiceValidatedAt: new Date('2020-01-01T00:00:00Z'),
      });
      await databaseBuilder.commit();

      // when
      const actualUser = await userRepository.updatePixCertifTermsOfServiceAcceptedToTrue(user.id);

      // then
      expect(actualUser.lastPixCertifTermsOfServiceValidatedAt).to.deep.equal(now);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isUsernameAvailable', function () {
    const username = 'abc.def0101';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return username when it doesn't exist", async function () {
      // when
      const result = await userRepository.isUsernameAvailable(username);

      // then
      expect(result).to.equal(username);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AlreadyRegisteredUsernameError when username already exist', async function () {
      // given
      databaseBuilder.factory.buildUser({
        username,
      });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(userRepository.isUsernameAvailable)(username);

      // then
      expect(error).to.be.instanceOf(AlreadyRegisteredUsernameError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateHasSeenNewDashboardInfoToTrue', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the model with hasSeenNewDashboardInfo flag updated to true', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser({ hasSeenNewDashboardInfo: false }).id;
      await databaseBuilder.commit();

      // when
      const actualUser = await userRepository.updateHasSeenNewDashboardInfoToTrue(userId);

      // then
      expect(actualUser.hasSeenNewDashboardInfo).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateHasSeenChallengeTooltip', function () {
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser({
        hasSeenFocusedChallengeTooltip: false,
        hasSeenOtherChallengesTooltip: false,
      }).id;
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the model with hasSeenFocusedChallengeTooltip flag updated to true', async function () {
      // when
      const challengeType = 'focused';
      const actualUser = await userRepository.updateHasSeenChallengeTooltip({ userId, challengeType });

      // then
      expect(actualUser.hasSeenFocusedChallengeTooltip).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the model with hasSeenOtherChallengesTooltip flag updated to true', async function () {
      // when
      const challengeType = 'other';
      const actualUser = await userRepository.updateHasSeenChallengeTooltip({ userId, challengeType });

      // then
      expect(actualUser.hasSeenOtherChallengesTooltip).to.be.true;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAnotherUserByEmail', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of a single user if email already used', async function () {
      // given
      const currentUser = databaseBuilder.factory.buildUser({
        email: 'current.user@example.net',
      });
      const anotherUser = databaseBuilder.factory.buildUser({
        email: 'another.user@example.net',
      });
      await databaseBuilder.commit();

      // when
      const foundUsers = await userRepository.findAnotherUserByEmail(currentUser.id, anotherUser.email);

      // then
      expect(foundUsers).to.be.an('array').that.have.lengthOf(1);
      expect(foundUsers[0]).to.be.an.instanceof(User);
      expect(foundUsers[0].email).to.equal(anotherUser.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of a single user if email case insensitive already used', async function () {
      // given
      const currentUser = databaseBuilder.factory.buildUser({
        email: 'current.user@example.net',
      });
      const anotherUser = databaseBuilder.factory.buildUser({
        email: 'another.user@example.net',
      });
      await databaseBuilder.commit();

      // when
      const foundUsers = await userRepository.findAnotherUserByEmail(currentUser.id, anotherUser.email.toUpperCase());

      // then
      expect(foundUsers).to.be.an('array').that.have.lengthOf(1);
      expect(foundUsers[0]).to.be.an.instanceof(User);
      expect(foundUsers[0].email).to.equal(anotherUser.email);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty list if email is not used', async function () {
      // given
      const currentUser = databaseBuilder.factory.buildUser({
        email: 'current.user@example.net',
      });
      const email = 'not.used@example.net';

      // when
      const foundUsers = await userRepository.findAnotherUserByEmail(currentUser.id, email);

      // then
      expect(foundUsers).to.be.an('array').that.is.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findAnotherUserByUsername', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of a single user if username already used', async function () {
      // given
      const currentUser = databaseBuilder.factory.buildUser({
        username: 'current.user.name',
      });
      const anotherUser = databaseBuilder.factory.buildUser({
        username: 'another.user.name',
      });
      await databaseBuilder.commit();

      // when
      const foundUsers = await userRepository.findAnotherUserByUsername(currentUser.id, anotherUser.username);

      // then
      expect(foundUsers).to.be.an('array').that.have.lengthOf(1);
      expect(foundUsers[0]).to.be.an.instanceof(User);
      expect(foundUsers[0].username).to.equal(anotherUser.username);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty list if username is not used', async function () {
      // given
      const currentUser = databaseBuilder.factory.buildUser({
        username: 'current.user.name',
      });
      const username = 'not.user.name';

      // when
      const foundUsers = await userRepository.findAnotherUserByUsername(currentUser.id, username);

      // then
      expect(foundUsers).to.be.an('array').that.is.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateLastLoggedAt', function () {
    let clock: $TSFixMe;
    const now = new Date('2020-01-02');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(now);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the last login date to now', async function () {
      // given
      const user = databaseBuilder.factory.buildUser();
      const userId = user.id;
      await databaseBuilder.commit();

      // when
      await userRepository.updateLastLoggedAt({ userId });

      // then
      const userUpdated = await knex('users').select().where({ id: userId }).first();
      expect(userUpdated.lastLoggedAt).to.deep.equal(now);
    });
  });
});
