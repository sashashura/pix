// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userServic... Remove this comment to see the full error message
const userService = require('../../../../lib/domain/services/user-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | user-service', function () {
  let domainTransaction: $TSFixMe;
  const hashedPassword = 'ABCD1234';

  let user: $TSFixMe;
  let authenticationMethod;
  let transactionToBeExecuted: $TSFixMe;

  let authenticationMethodRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;
  let userRepository: $TSFixMe;
  let userToCreateRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    domainTransaction = Symbol('domain transaction');

    userRepository = {
      updateUsername: sinon.stub(),
    };
    userToCreateRepository = {
      create: sinon.stub(),
    };
    authenticationMethodRepository = {
      create: sinon.stub(),
      updatePasswordThatShouldBeChanged: sinon.stub(),
      createPasswordThatShouldBeChanged: sinon.stub(),
    };
    organizationLearnerRepository = {
      updateUserIdWhereNull: sinon.stub(),
    };

    authenticationMethodRepository.create.resolves();
    organizationLearnerRepository.updateUserIdWhereNull.resolves();
    userToCreateRepository.create.resolves();

    sinon.stub(DomainTransaction, 'execute').callsFake((lambda: $TSFixMe) => {
      transactionToBeExecuted = lambda;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createUserWithPassword', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call user and authenticationMethod create functions ', async function () {
      // given
      const user = domainBuilder.buildUser();
      const authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId: user.id,
        hashedPassword,
      });
      userToCreateRepository.create.resolves(user);
      const expectedAuthenticationMethod = omit(authenticationMethod, ['id', 'createdAt', 'updatedAt']);

      //when
      await userService.createUserWithPassword({
        user,
        hashedPassword,
        userRepository,
        userToCreateRepository,
        authenticationMethodRepository,
      });
      await transactionToBeExecuted(domainTransaction);

      // then
      expect(userToCreateRepository.create).to.have.been.calledOnce;
      expect(authenticationMethodRepository.create).to.have.been.calledWithMatch({
        authenticationMethod: expectedAuthenticationMethod,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateUsernameAndAddPassword', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      user = domainBuilder.buildUser();
      authenticationMethod = domainBuilder.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({
        userId: user.id,
        hashedPassword,
      });
      user.authenticationMethods = [authenticationMethod];
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call user and authenticationMethod update functions', async function () {
      const userId = user.id;
      const username = 'newUsername';
      const newHashedPassword = '1234ABCD';

      //when
      await userService.updateUsernameAndAddPassword({
        userId: user.id,
        username,
        hashedPassword: newHashedPassword,
        userRepository,
        authenticationMethodRepository,
      });
      await transactionToBeExecuted(domainTransaction);

      // then
      expect(userRepository.updateUsername).to.have.been.calledWithMatch({
        id: userId,
        username,
      });
      expect(authenticationMethodRepository.createPasswordThatShouldBeChanged).to.have.been.calledWithMatch({
        userId,
        hashedPassword: newHashedPassword,
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAndReconcileUserToOrganizationLearner', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call user and authenticationMethod create and function, and organizationLearner update function', async function () {
      // given
      const user = domainBuilder.buildUser({
        firstName: 'Mnémosyne',
        lastName: 'Pachidermata',
      });
      const organizationLearnerId = 1;
      userToCreateRepository.create.resolves(user);

      // when
      await userService.createAndReconcileUserToOrganizationLearner({
        samlId: 'SAML_ID',
        organizationLearnerId,
        user,
        authenticationMethodRepository,
        userToCreateRepository,
        organizationLearnerRepository,
      });
      await transactionToBeExecuted(domainTransaction);

      // then
      expect(userToCreateRepository.create).to.have.been.calledOnce;
      expect(authenticationMethodRepository.create).to.have.been.calledWithMatch({
        authenticationMethod: {
          externalIdentifier: 'SAML_ID',
          userId: user.id,
          authenticationComplement: {
            firstName: 'Mnémosyne',
            lastName: 'Pachidermata',
          },
        },
      });
      expect(organizationLearnerRepository.updateUserIdWhereNull).to.have.been.calledWithMatch({
        organizationLearnerId,
        userId: user.id,
      });
    });
  });
});
