// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserToCrea... Remove this comment to see the full error message
const UserToCreate = require('../models/UserToCreate');

function _buildPasswordAuthenticationMethod({
  userId,
  hashedPassword
}: $TSFixMe) {
  return new AuthenticationMethod({
    userId,
    identityProvider: AuthenticationMethod.identityProviders.PIX,
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword: false,
    }),
  });
}

function _buildGARAuthenticationMethod({
  externalIdentifier,
  user
}: $TSFixMe) {
  return new AuthenticationMethod({
    externalIdentifier,
    identityProvider: AuthenticationMethod.identityProviders.GAR,
    userId: user.id,
    authenticationComplement: new AuthenticationMethod.GARAuthenticationComplement({
      firstName: user.firstName,
      lastName: user.lastName,
    }),
  });
}

async function createUserWithPassword({
  user,
  hashedPassword,
  userToCreateRepository,
  authenticationMethodRepository
}: $TSFixMe) {
  let savedUser;
  const userToAdd = UserToCreate.create(user);

  await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
    savedUser = await userToCreateRepository.create({ user: userToAdd, domainTransaction });

    const authenticationMethod = _buildPasswordAuthenticationMethod({
      userId: savedUser.id,
      hashedPassword,
    });

    await authenticationMethodRepository.create({
      authenticationMethod,
      domainTransaction,
    });
  });

  return savedUser;
}

async function updateUsernameAndAddPassword({
  userId,
  username,
  hashedPassword,
  authenticationMethodRepository,
  userRepository
}: $TSFixMe) {
  return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
    await userRepository.updateUsername({ id: userId, username, domainTransaction });
    return authenticationMethodRepository.createPasswordThatShouldBeChanged({
      userId,
      hashedPassword,
      domainTransaction,
    });
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createAndR... Remove this comment to see the full error message
async function createAndReconcileUserToOrganizationLearner({
  hashedPassword,
  samlId,
  organizationLearnerId,
  user,
  authenticationMethodRepository,
  organizationLearnerRepository,
  userToCreateRepository
}: $TSFixMe) {
  const userToAdd = UserToCreate.create(user);

  return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
    let authenticationMethod;

    const createdUser = await userToCreateRepository.create({
      user: userToAdd,
      domainTransaction,
    });

    if (samlId) {
      authenticationMethod = _buildGARAuthenticationMethod({
        externalIdentifier: samlId,
        user: createdUser,
      });
    } else {
      authenticationMethod = _buildPasswordAuthenticationMethod({
        hashedPassword,
        userId: createdUser.id,
      });
    }

    await authenticationMethodRepository.create({
      authenticationMethod,
      domainTransaction,
    });

    await organizationLearnerRepository.updateUserIdWhereNull({
      organizationLearnerId,
      userId: createdUser.id,
      domainTransaction,
    });

    return createdUser.id;
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createAndReconcileUserToOrganizationLearner,
  createUserWithPassword,
  updateUsernameAndAddPassword,
};
