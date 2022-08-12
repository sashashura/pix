// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pick'.
const pick = require('lodash/pick');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, domainBuilder, databaseBuilder, expect, knex } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../../../lib/infrastructure/repositories/authentication-method-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerRepository = require('../../../../lib/infrastructure/repositories/organization-learner-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userToCrea... Remove this comment to see the full error message
const userToCreateRepository = require('../../../../lib/infrastructure/repositories/user-to-create-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationLearnerNotFound } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userServic... Remove this comment to see the full error message
const userService = require('../../../../lib/domain/services/user-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Domain | Services | user-service', function () {
  const hashedPassword = 'Abcdef1234';

  let user: $TSFixMe;
  let authenticationMethod: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createUserWithPassword', function () {
    const userPickedAttributes = ['firstName', 'lastName', 'email', 'username', 'cgu'];
    const authenticationMethodPickedAttributes = ['authenticationComplement', 'externalIdentifier', 'identityProvider'];

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      user = domainBuilder.buildUser({ username: null });
      authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        hashedPassword,
        userId: user.id,
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return saved user and authenticationMethod', async function () {
      // given
      const expectedUser = pick(user, userPickedAttributes);
      const expectedAuthenticationMethod = pick(authenticationMethod, authenticationMethodPickedAttributes);

      // when
      const foundUser = await userService.createUserWithPassword({
        user,
        hashedPassword,
        userRepository,
        userToCreateRepository,
        authenticationMethodRepository,
      });

      // then
      expect(pick(foundUser, userPickedAttributes)).to.deep.equal(expectedUser);

      const foundAuthenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
        userId: foundUser.id,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      });
      expect(pick(foundAuthenticationMethod, authenticationMethodPickedAttributes)).to.deep.equal(
        expectedAuthenticationMethod
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw Error if user already exists', async function () {
      // given
      databaseBuilder.factory.buildUser(user);
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(userService.createUserWithPassword)({
        user,
        hashedPassword,
        userRepository,
        authenticationMethodRepository,
      });

      // then
      expect(error).to.be.instanceOf(Error);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateUsernameAndAddPassword', function () {
    const username = 'username.pix';

    const authenticationMethodPickedAttributes = ['userId', 'identityProvider', 'authenticationComplement'];
    const userPickedAttributes = ['id', 'firstName', 'lastName', 'email', 'username', 'cgu'];

    let user: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      user = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update user username and user authenticationMethod password', async function () {
      // given
      const userId = user.id;

      const expectedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username,
        cgu: user.cgu,
      };
      const expectedAuthenticationMethod = {
        userId,
        authenticationComplement: {
          password: hashedPassword,
          shouldChangePassword: true,
        },
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      };

      // when
      await userService.updateUsernameAndAddPassword({
        userId,
        username,
        hashedPassword,
        authenticationMethodRepository,
        userRepository,
      });

      // then
      const foundUser = await userRepository.getByUsernameOrEmailWithRolesAndPassword(username);
      expect(pick(foundUser, userPickedAttributes)).to.deep.equal(expectedUser);
      expect(pick(foundUser.authenticationMethods[0], authenticationMethodPickedAttributes)).to.deep.equal(
        expectedAuthenticationMethod
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAndReconcileUserToOrganizationLearner', function () {
    let organizationId: $TSFixMe;
    let samlId: $TSFixMe;
    let organizationLearnerId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      user = domainBuilder.buildUser();
      organizationId = databaseBuilder.factory.buildOrganization().id;
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
        userId: null,
      }).id;

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('organization-learners').delete();
      await knex('authentication-methods').delete();
      await knex('users').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all goes well', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create user', async function () {
        // when
        const updatedUserId = await userService.createAndReconcileUserToOrganizationLearner({
          hashedPassword,
          samlId,
          organizationLearnerId,
          user,
          authenticationMethodRepository,
          organizationLearnerRepository,
          userToCreateRepository,
        });

        // then
        const foundOrganizationLearner = await organizationLearnerRepository.get(organizationLearnerId);
        expect(updatedUserId).to.equal(foundOrganizationLearner.userId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update updatedAt column in organization-learner row', async function () {
        // given
        await knex('organization-learners')
          .update({ updatedAt: new Date('2019-01-01') })
          .where({ id: organizationLearnerId });
        const { updatedAt: beforeUpdatedAt } = await knex
          .select('updatedAt')
          .from('organization-learners')
          .where({ id: organizationLearnerId })
          .first();

        // when
        await userService.createAndReconcileUserToOrganizationLearner({
          hashedPassword,
          samlId,
          organizationLearnerId,
          user,
          authenticationMethodRepository,
          organizationLearnerRepository,
          userToCreateRepository,
        });

        // then
        const { updatedAt: afterUpdatedAt } = await knex
          .select('updatedAt')
          .from('organization-learners')
          .where({ id: organizationLearnerId })
          .first();
        expect(afterUpdatedAt).to.be.above(beforeUpdatedAt);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when an authentication method is provided', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create the authentication method for the created user', async function () {
          // given
          samlId = 'samlId';

          // when
          const result = await userService.createAndReconcileUserToOrganizationLearner({
            hashedPassword,
            samlId,
            organizationLearnerId,
            user,
            authenticationMethodRepository,
            organizationLearnerRepository,
            userToCreateRepository,
          });

          // then
          const foundAuthenticationMethod = await knex('authentication-methods').where({
            identityProvider: AuthenticationMethod.identityProviders.GAR,
            externalIdentifier: samlId,
          });
          expect(foundAuthenticationMethod).to.have.lengthOf(1);
          expect(result).to.equal(foundAuthenticationMethod[0].userId);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when creation succeeds and association fails', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should rollback after association fails', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
          userId,
          organizationId,
        }).id;
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(userService.createAndReconcileUserToOrganizationLearner)({
          hashedPassword,
          samlId,
          organizationLearnerId,
          user,
          authenticationMethodRepository,
          organizationLearnerRepository,
          userToCreateRepository,
        });

        // then
        expect(error).to.be.instanceOf(OrganizationLearnerNotFound);
        const foundOrganizationLearners = await knex('organization-learners').where('id', organizationLearnerId);
        expect(foundOrganizationLearners[0].userId).to.equal(userId);
        const foundUser = await knex('users').where({ email: user.email });
        expect(foundUser).to.have.lengthOf(0);
      });
    });
  });
});
