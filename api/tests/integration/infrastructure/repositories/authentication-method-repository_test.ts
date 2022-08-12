// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, databaseBuilder, domainBuilder, expect, knex, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError, AuthenticationMethodNotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../../../lib/infrastructure/repositories/authentication-method-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | AuthenticationMethod', function () {
  const hashedPassword = 'ABCDEF1234';
  const newHashedPassword = '1234ABCDEF';

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('authentication-methods').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when creating a AuthenticationMethod containing an external identifier', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an AuthenticationMethod', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();

        const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'externalIdentifier',
          userId,
        });
        delete authenticationMethod.id;

        // when
        const savedAuthenticationMethod = await authenticationMethodRepository.create({ authenticationMethod });

        // then
        expect(savedAuthenticationMethod).to.deepEqualInstanceOmitting(authenticationMethod, [
          'id',
          'createdAt',
          'updatedAt',
        ]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save an AuthenticationMethod in database', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();

        const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'externalIdentifier',
          userId,
        });
        delete authenticationMethod.id;

        // when
        const savedAuthenticationMethod = await authenticationMethodRepository.create({ authenticationMethod });

        // then
        const [authenticationMethodId] = await knex('authentication-methods')
          .pluck('id')
          .where({ externalIdentifier: 'externalIdentifier' });
        expect(authenticationMethodId).to.equal(savedAuthenticationMethod.id);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when an AuthenticationMethod already exists for an identity provider and an external identifier',
      function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an AlreadyExistingEntityError', async function () {
          // given
          const userIdA = databaseBuilder.factory.buildUser().id;
          const userIdB = databaseBuilder.factory.buildUser().id;
          const authenticationMethodA = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: 'alreadyExistingExternalIdentifier',
            userId: userIdA,
          });
          delete authenticationMethodA.id;
          databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(authenticationMethodA);
          await databaseBuilder.commit();
          const authenticationMethodB = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
            externalIdentifier: 'alreadyExistingExternalIdentifier',
            userId: userIdB,
          });
          delete authenticationMethodB.id;

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(authenticationMethodRepository.create)({
            authenticationMethod: authenticationMethodB,
          });

          // then
          expect(error).to.be.instanceOf(AlreadyExistingEntityError);
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an AuthenticationMethod already exists for an identity provider and a userId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an AlreadyExistingEntityError', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const authenticationMethodA = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'someIdentifierA',
          userId,
        });
        delete authenticationMethodA.id;
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(authenticationMethodA);
        await databaseBuilder.commit();
        const authenticationMethodB = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'someIdentifierB',
          userId,
        });
        delete authenticationMethodB.id;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticationMethodRepository.create)({
          authenticationMethod: authenticationMethodB,
        });

        // then
        expect(error).to.be.instanceOf(AlreadyExistingEntityError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be DomainTransaction compliant', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        externalIdentifier: 'externalIdentifier',
        userId,
      });
      delete authenticationMethod.id;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async function () {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await authenticationMethodRepository.create({ authenticationMethod, domainTransaction });
          throw new Error('Error occurs in transaction');
        });
      })();

      // then
      const results = await knex('authentication-methods').where({ externalIdentifier: 'externalIdentifier' });
      expect(results).to.be.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateChangedPassword', function () {
    let userId: $TSFixMe;
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      clock = sinon.useFakeTimers(new Date('2020-01-02'));
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the password in database', async function () {
      // given
      const authenticationMethodId =
        databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          userId,
          hashedPassword,
        }).id;
      await databaseBuilder.commit();

      // when
      await authenticationMethodRepository.updateChangedPassword({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      const [authenticationComplement] = await knex('authentication-methods')
        .pluck('authenticationComplement')
        .where({ id: authenticationMethodId });
      expect(authenticationComplement.password).to.equal(newHashedPassword);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated AuthenticationMethod', async function () {
      // given
      const originalAuthenticationMethod =
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          id: 123,
          userId,
          hashedPassword,
        });
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword(
        originalAuthenticationMethod
      );
      await databaseBuilder.commit();

      // when
      const updatedAuthenticationMethod = await authenticationMethodRepository.updateChangedPassword({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      const expectedAuthenticationMethod =
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          id: 123,
          userId,
          hashedPassword: newHashedPassword,
          updatedAt: new Date(),
        });
      expect(updatedAuthenticationMethod).to.deepEqualInstance(expectedAuthenticationMethod);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should disable changing password', async function () {
      // given
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId,
        hashedPassword,
        shouldChangePassword: true,
      });
      await databaseBuilder.commit();

      // when
      const updatedAuthenticationMethod = await authenticationMethodRepository.updateChangedPassword({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      expect(updatedAuthenticationMethod.authenticationComplement.shouldChangePassword).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AuthenticationMethodNotFoundError when user id not found', async function () {
      // given
      const wrongUserId = 0;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticationMethodRepository.updateChangedPassword)({
        userId: wrongUserId,
        hashedPassword,
      });

      // then
      expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be DomainTransaction compliant', async function () {
      // given
      const authenticationMethod =
        databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          userId,
          hashedPassword,
        });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async function () {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await authenticationMethodRepository.updateChangedPassword(
            { userId, hashedPassword: 'coucou' },
            domainTransaction
          );
          throw new Error('Error occurs in transaction');
        });
      })();

      // then
      const [authenticationComplement] = await knex('authentication-methods')
        .pluck('authenticationComplement')
        .where({ id: authenticationMethod.id });
      expect(authenticationComplement.password).to.be.equal(hashedPassword);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOneByUserIdAndIdentityProvider', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the AuthenticationMethod associated to a user for a given identity provider', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId,
      });
      const garAuthenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        id: 123,
        userId,
      });
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(garAuthenticationMethod);
      await databaseBuilder.commit();

      // when
      const authenticationMethodsByUserIdAndIdentityProvider =
        await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
          userId,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
        });

      // then
      expect(authenticationMethodsByUserIdAndIdentityProvider).to.deepEqualInstance(garAuthenticationMethod);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no AuthenticationMethod for the given user and identity provider', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({ userId });
      await databaseBuilder.commit();

      // when
      const authenticationMethodsByUserIdAndIdentityProvider =
        await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
          userId,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
        });

      // then
      expect(authenticationMethodsByUserIdAndIdentityProvider).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when Pix is the authentication provider', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('brings along a Pix authentication complement', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          userId: user.id,
          hashedPassword: 'H4SHED',
          shouldChangePassword: false,
        });
        await databaseBuilder.commit();

        // when
        const pixAuthenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.PIX,
        });

        // then
        expect(pixAuthenticationMethod.authenticationComplement).to.deep.equal(
          new AuthenticationMethod.PixAuthenticationComplement({
            password: 'H4SHED',
            shouldChangePassword: false,
          })
        );
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when Pole Emploi is the authentication provider', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('brings along a Pole Emploi authentication complement', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
          userId: user.id,
          accessToken: 'AGENCENATIONALEPOURLEMPLOI',
          refreshToken: 'FRANCETRAVAIL',
          expiredDate: new Date('2021-01-01'),
        });
        await databaseBuilder.commit();

        // when
        const pixAuthenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        });

        // then
        expect(pixAuthenticationMethod.authenticationComplement).to.deep.equal(
          new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken: 'AGENCENATIONALEPOURLEMPLOI',
            refreshToken: 'FRANCETRAVAIL',
            expiredDate: '2021-01-01T00:00:00.000Z',
          })
        );
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when GAR is the authentication provider', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('brings along a GAR authentication complement', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
          userId: user.id,
          userFirstName: 'Katie',
          userLastName: 'McGuffin',
        });
        await databaseBuilder.commit();

        // when
        const garAuthenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
          userId: user.id,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
        });

        // then
        expect(garAuthenticationMethod.authenticationComplement).to.deep.equal(
          new AuthenticationMethod.GARAuthenticationComplement({
            firstName: 'Katie',
            lastName: 'McGuffin',
          })
        );
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOneByExternalIdentifierAndIdentityProvider', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the AuthenticationMethod for a given external identifier and identity provider', async function () {
      // given
      const externalIdentifier = 'samlId';
      const userId = databaseBuilder.factory.buildUser().id;
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        id: 123,
        externalIdentifier,
        userId,
      });
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(authenticationMethod);
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        externalIdentifier: 'another_sub',
      });
      await databaseBuilder.commit();

      // when
      const authenticationMethodsByTypeAndValue =
        await authenticationMethodRepository.findOneByExternalIdentifierAndIdentityProvider({
          externalIdentifier,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
        });

      // then
      expect(authenticationMethodsByTypeAndValue).to.deepEqualInstance(authenticationMethod);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no AuthenticationMethods for the given external identifier and identity provider', async function () {
      // given & when
      const authenticationMethodsByTypeAndValue =
        await authenticationMethodRepository.findOneByExternalIdentifierAndIdentityProvider({
          externalIdentifier: 'samlId',
          identityProvider: AuthenticationMethod.identityProviders.GAR,
        });

      // then
      expect(authenticationMethodsByTypeAndValue).to.be.null;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateExternalIdentifierByUserIdAndIdentityProvider', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When authentication method exists', function () {
      let clock: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        clock = sinon.useFakeTimers(new Date('2020-01-02'));
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        clock.restore();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update external identifier by userId and identity provider', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'old_value',
          userId,
        });
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(authenticationMethod);
        await databaseBuilder.commit();

        // when
        await authenticationMethodRepository.updateExternalIdentifierByUserIdAndIdentityProvider({
          userId,
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          externalIdentifier: 'new_value',
        });

        // then
        const [externalIdentifier] = await knex('authentication-methods')
          .pluck('externalIdentifier')
          .where({ id: authenticationMethod.id });
        expect(externalIdentifier).to.equal('new_value');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the updated AuthenticationMethod', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const authenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'old_value',
          userId,
        });
        databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(authenticationMethod);
        await databaseBuilder.commit();

        // when
        const updatedAuthenticationMethod =
          await authenticationMethodRepository.updateExternalIdentifierByUserIdAndIdentityProvider({
            userId,
            identityProvider: AuthenticationMethod.identityProviders.GAR,
            externalIdentifier: 'new_value',
          });

        // then
        authenticationMethod.externalIdentifier = 'new_value';
        authenticationMethod.updatedAt = new Date();
        expect(updatedAuthenticationMethod).to.deepEqualInstance(authenticationMethod);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When authentication method does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an AuthenticationMethodNotFoundError', async function () {
        // given
        const userId = 12345;
        const identityProvider = AuthenticationMethod.identityProviders.GAR;
        const externalIdentifier = 'new_saml_id';

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(
          authenticationMethodRepository.updateExternalIdentifierByUserIdAndIdentityProvider
        )({ externalIdentifier, userId, identityProvider });

        // then
        expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updatePasswordThatShouldBeChanged', function () {
    let userId: $TSFixMe;
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      clock = sinon.useFakeTimers(new Date('2020-01-02'));
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update password in database and set shouldChangePassword to true', async function () {
      // given
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        id: 123,
        userId,
        hashedPassword,
        shouldChangePassword: false,
      });
      await databaseBuilder.commit();

      // when
      await authenticationMethodRepository.updatePasswordThatShouldBeChanged({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      const [authenticationComplement] = await knex('authentication-methods')
        .pluck('authenticationComplement')
        .where({ id: 123 });
      expect(authenticationComplement.password).to.equal(newHashedPassword);
      expect(authenticationComplement.shouldChangePassword).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an updated AuthenticationMethod', async function () {
      // given
      const originalAuthenticationMethod =
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          id: 123,
          userId,
          hashedPassword,
          shouldChangePassword: false,
        });
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(originalAuthenticationMethod);
      await databaseBuilder.commit();

      // when
      const updatedAuthenticationMethod = await authenticationMethodRepository.updatePasswordThatShouldBeChanged({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      const expectedAuthenticationMethod =
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          id: 123,
          userId,
          hashedPassword: newHashedPassword,
          shouldChangePassword: true,
          updatedAt: new Date(),
        });
      expect(updatedAuthenticationMethod).to.deepEqualInstance(expectedAuthenticationMethod);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AuthenticationMethodNotFoundError when user id not found', async function () {
      // given
      const wrongUserId = 0;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticationMethodRepository.updatePasswordThatShouldBeChanged)({
        userId: wrongUserId,
        hashedPassword,
      });

      // then
      expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be DomainTransaction compliant', async function () {
      // given
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        id: 123,
        userId,
        hashedPassword,
        shouldChangePassword: false,
      });
      await databaseBuilder.commit();

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async function () {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await authenticationMethodRepository.updatePasswordThatShouldBeChanged({
            userId,
            hashedPassword: newHashedPassword,
            domainTransaction,
          });
          throw new Error('Error occurs in transaction');
        });
      })();

      // then
      const [authenticationComplement] = await knex('authentication-methods')
        .pluck('authenticationComplement')
        .where({ id: 123 });
      expect(authenticationComplement.password).to.equal(hashedPassword);
      expect(authenticationComplement.shouldChangePassword).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createPasswordThatShouldBeChanged', function () {
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('authentication-methods').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create and return a Pix authentication method with given password in database and set shouldChangePassword to true', async function () {
      // when
      const createdAuthenticationMethod = await authenticationMethodRepository.createPasswordThatShouldBeChanged({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      const expectedAuthenticationMethod = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
        userId,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      });
      expect(createdAuthenticationMethod).to.deepEqualInstance(expectedAuthenticationMethod);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not replace an existing authenticationMethod with a different identity provider', async function () {
      // given
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({ userId });
      await databaseBuilder.commit();
      await authenticationMethodRepository.createPasswordThatShouldBeChanged({
        userId,
        hashedPassword: newHashedPassword,
      });

      // when
      const foundAuthenticationMethodPIX = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
        userId,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      });
      const foundAuthenticationMethodGAR = await authenticationMethodRepository.findOneByUserIdAndIdentityProvider({
        userId,
        identityProvider: AuthenticationMethod.identityProviders.GAR,
      });

      // then
      expect(foundAuthenticationMethodPIX).to.exist;
      expect(foundAuthenticationMethodGAR).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an AlreadyExistingEntityError when authentication method with PIX identity provider already exists for user', async function () {
      // given
      await authenticationMethodRepository.createPasswordThatShouldBeChanged({
        userId,
        hashedPassword: newHashedPassword,
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticationMethodRepository.createPasswordThatShouldBeChanged)({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      expect(error).to.be.instanceOf(AlreadyExistingEntityError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be DomainTransaction compliant', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      await catchErr(async function () {
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await authenticationMethodRepository.createPasswordThatShouldBeChanged({
            userId,
            hashedPassword: newHashedPassword,
            domainTransaction,
          });
          throw new Error('Error occurs in transaction');
        });
      })();

      // then
      const nonExistingAuthenticationMethod = await knex('authentication-methods').where({ userId }).first();
      expect(nonExistingAuthenticationMethod).to.not.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateExpiredPassword', function () {
    let userId: $TSFixMe;
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      clock = sinon.useFakeTimers(new Date('2020-01-02'));
      userId = databaseBuilder.factory.buildUser({ shouldChangePassword: true }).id;
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        id: 123,
        userId,
        hashedPassword,
        shouldChangePassword: true,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the password in database and set shouldChangePassword to false', async function () {
      // when
      await authenticationMethodRepository.updateExpiredPassword({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      const [authenticationComplement] = await knex('authentication-methods')
        .pluck('authenticationComplement')
        .where({ id: 123 });
      expect(authenticationComplement.password).to.equal(newHashedPassword);
      expect(authenticationComplement.shouldChangePassword).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated AuthenticationMethod', async function () {
      // given
      const expectedAuthenticationMethod =
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          id: 123,
          userId,
          hashedPassword: newHashedPassword,
          shouldChangePassword: false,
          updatedAt: new Date(),
        });

      // when
      const updatedAuthenticationMethod = await authenticationMethodRepository.updateExpiredPassword({
        userId,
        hashedPassword: newHashedPassword,
      });

      // then
      expect(updatedAuthenticationMethod).to.deepEqualInstance(expectedAuthenticationMethod);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw AuthenticationMethodNotFoundError when user id is not found', async function () {
      // given
      const wrongUserId = 0;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(authenticationMethodRepository.updateExpiredPassword)({
        userId: wrongUserId,
        hashedPassword,
      });

      // then
      expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateAuthenticationComplementByUserIdAndIdentityProvider', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When authentication method exists', function () {
      let authenticationMethod: $TSFixMe;
      let clock: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        clock = sinon.useFakeTimers(new Date('2020-01-02'));
        const userId = databaseBuilder.factory.buildUser().id;
        authenticationMethod = databaseBuilder.factory.buildAuthenticationMethod.withIdentityProvider({
          id: 123,
          identityProvider: 'POLE_EMPLOI',
          externalIdentifier: 'identifier',
          accessToken: 'to_be_updated',
          refreshToken: 'to_be_updated',
          expiredDate: Date.now(),
          userId,
        });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        clock.restore();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the authentication complement in database', async function () {
        // given
        const userId = authenticationMethod.userId;
        const expiredDate = Date.now();
        const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token',
          expiredDate,
        });

        // when
        await authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider({
          authenticationComplement,
          userId,
          identityProvider: 'POLE_EMPLOI',
        });

        // then
        const [updatedAuthenticationComplement] = await knex('authentication-methods')
          .pluck('authenticationComplement')
          .where({ id: 123 });
        expect(updatedAuthenticationComplement.accessToken).to.equal('new_access_token');
        expect(updatedAuthenticationComplement.refreshToken).to.equal('new_refresh_token');
        expect(updatedAuthenticationComplement.expiredDate).to.deep.equal(expiredDate);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the updated AuthenticationMethod', async function () {
        // given
        const userId = authenticationMethod.userId;
        const expiredDate = Date.now();
        const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token',
          expiredDate,
        });

        // when
        const updatedAuthenticationMethod =
          await authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider({
            authenticationComplement,
            userId,
            identityProvider: 'POLE_EMPLOI',
          });

        // then
        const expectedAuthenticationMethod = domainBuilder.buildAuthenticationMethod.withPoleEmploiAsIdentityProvider({
          id: 123,
          externalIdentifier: 'identifier',
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token',
          expiredDate,
          userId,
          updatedAt: new Date(),
        });
        expect(updatedAuthenticationMethod).to.deepEqualInstance(expectedAuthenticationMethod);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When authentication method does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a AuthenticationMethodNotFoundError', async function () {
        // given
        const userId = 12345;
        const authenticationComplement = {};

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(
          authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
        )({
          authenticationComplement,
          userId,
          identityProvider: 'POLE_EMPLOI',
        });

        // then
        expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasIdentityProviderPIX', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if user have an authenticationMethod with an IdentityProvider PIX ', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId,
      });
      await databaseBuilder.commit();

      // when
      const result = await authenticationMethodRepository.hasIdentityProviderPIX({
        userId,
      });

      // then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if user have no authenticationMethod with an IdentityProvider PIX ', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({ userId });
      await databaseBuilder.commit();

      // when
      const result = await authenticationMethodRepository.hasIdentityProviderPIX({
        userId,
      });

      // then
      expect(result).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#removeByUserIdAndIdentityProvider', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete from database the authentication method by userId and identityProvider', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        externalIdentifier: 'externalIdentifier',
        userId,
      });
      await databaseBuilder.commit();

      // when
      await authenticationMethodRepository.removeByUserIdAndIdentityProvider({
        userId,
        identityProvider: AuthenticationMethod.identityProviders.GAR,
      });

      // then
      const result = await knex('authentication-methods').where({ id: userId }).first();
      expect(result).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#removeAllAuthenticationMethodsByUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete from database all the authentication methods by userId', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        externalIdentifier: 'externalIdentifier',
        userId,
      });
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndPassword({
        userId,
      });
      await databaseBuilder.commit();

      // when
      await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({
        userId,
      });

      // then
      const result = await knex('authentication-methods');
      expect(result).to.be.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return the user's authentication methods", async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const secondAuthenticationMethod = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
        id: 456,
        externalIdentifier: 'externalIdentifier',
        userId,
      });
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider(secondAuthenticationMethod);
      const firstAuthenticationMethod =
        domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
          id: 123,
          userId,
          hashedPassword: 'Hello',
        });
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        ...firstAuthenticationMethod,
        hashedPassword: 'Hello',
      });
      await databaseBuilder.commit();

      // when
      const authenticationMethods = await authenticationMethodRepository.findByUserId({ userId });

      // then
      expect(authenticationMethods).to.deepEqualArray([firstAuthenticationMethod, secondAuthenticationMethod]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array if user has no authentication methods', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      const authenticationMethods = await authenticationMethodRepository.findByUserId({ userId });

      // then
      expect(authenticationMethods).to.be.empty;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByIdAndUserId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("should return the user's authentication method", async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const otherUserId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId: otherUserId,
        externalIdentifier: 'abcde123',
      });
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId,
      });
      const garAuthenticationMethodId = databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId,
        externalIdentifier: 'fghij456',
      }).id;
      await databaseBuilder.commit();

      // when
      const result = await authenticationMethodRepository.getByIdAndUserId({
        id: garAuthenticationMethodId,
        userId,
      });

      // then
      expect(result).to.be.instanceOf(AuthenticationMethod);
      expect(result.id).to.be.equal(garAuthenticationMethodId);
      expect(result.userId).to.be.equal(userId);
      expect(result.identityProvider).to.be.equal(AuthenticationMethod.identityProviders.GAR);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when authentication method belongs to another user', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an AuthenticationMethodNotFoundError', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const otherUserId = databaseBuilder.factory.buildUser().id;
        domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'alreadyExistingExternalIdentifier',
          userId,
        });
        const wrongAuthenticationMethodId = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          externalIdentifier: 'alreadyExistingExternalIdentifier',
          userId: otherUserId,
        }).id;
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticationMethodRepository.getByIdAndUserId)({
          id: wrongAuthenticationMethodId,
          userId,
        });

        // then
        expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when authentication method id does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an AuthenticationMethodNotFoundError', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const authenticationMethodId = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({ userId }).id;
        const wrongAuthenticationMethodId = authenticationMethodId + 1;
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticationMethodRepository.getByIdAndUserId)({
          id: wrongAuthenticationMethodId,
          userId,
        });

        // then
        expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when user id does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an AuthenticationMethodNotFoundError', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const wrongUserId = userId + 1;
        const authenticationMethodId = domainBuilder.buildAuthenticationMethod.withGarAsIdentityProvider({
          userId,
        }).id;
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(authenticationMethodRepository.getByIdAndUserId)({
          id: authenticationMethodId,
          userId: wrongUserId,
        });

        // then
        expect(error).to.be.instanceOf(AuthenticationMethodNotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateAuthenticationMethodUserId', function () {
    let clock: $TSFixMe;
    const now = new Date('2022-02-16');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      clock = sinon.useFakeTimers(now);
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update authentication method user id', async function () {
      // given
      const originUserId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({ userId: originUserId });

      const targetUserId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      await authenticationMethodRepository.updateAuthenticationMethodUserId({
        originUserId,
        identityProvider: AuthenticationMethod.identityProviders.GAR,
        targetUserId,
      });

      // then
      const authenticationMethodUpdated = await knex('authentication-methods').select();
      expect(authenticationMethodUpdated[0].userId).to.equal(targetUserId);
      expect(authenticationMethodUpdated[0].updatedAt).to.deep.equal(now);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    let clock: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update authentication method complement', async function () {
      // given
      const now = new Date('2022-03-15');
      clock = sinon.useFakeTimers(now);

      const userId = databaseBuilder.factory.buildUser().id;
      const authenticationMethod = databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
        userId,
        updatedAt: new Date('2018-01-01'),
      });
      const otherAuthenticationMethod =
        databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndPassword({
          userId,
          updatedAt: new Date('2018-01-01'),
        });
      await databaseBuilder.commit();

      authenticationMethod.authenticationComplement = new AuthenticationMethod.GARAuthenticationComplement({
        firstName: 'Saml',
        lastName: 'Jackson',
      });

      // when
      await authenticationMethodRepository.update(authenticationMethod);

      // then
      const updatedAuthenticationMethod = await knex('authentication-methods')
        .select()
        .where({ id: authenticationMethod.id })
        .first();
      expect(updatedAuthenticationMethod.authenticationComplement.firstName).to.equal('Saml');
      expect(updatedAuthenticationMethod.authenticationComplement.lastName).to.equal('Jackson');
      expect(updatedAuthenticationMethod.updatedAt).to.deep.equal(new Date('2022-03-15'));
      const untouchedAuthenticationMethod = await knex('authentication-methods')
        .select()
        .where({ id: otherAuthenticationMethod.id })
        .first();
      expect(untouchedAuthenticationMethod.updatedAt).to.deep.equal(new Date('2018-01-01'));
    });
  });
});
