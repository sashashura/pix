// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
  ForbiddenAccess,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingOrI... Remove this comment to see the full error message
  MissingOrInvalidCredentialsError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
  UserShouldChangePasswordError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'apps'.
const apps = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'endTestScr... Remove this comment to see the full error message
const endTestScreenRemovalService = require('../../domain/services/end-test-screen-removal-service');

async function _checkUserAccessScope(scope: $TSFixMe, user: $TSFixMe, adminMemberRepository: $TSFixMe) {
  if (scope === apps.PIX_ORGA.SCOPE && !user.isLinkedToOrganizations()) {
    throw new ForbiddenAccess(apps.PIX_ORGA.NOT_LINKED_ORGANIZATION_MSG);
  }

  if (scope === apps.PIX_ADMIN.SCOPE) {
    const adminMember = await adminMemberRepository.get({ userId: user.id });
    if (!adminMember?.hasAccessToAdminScope) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
  }

  if (scope === apps.PIX_CERTIF.SCOPE && !user.isLinkedToCertificationCenters()) {
    const isEndTestScreenRemovalEnabled =
      await endTestScreenRemovalService.isEndTestScreenRemovalEnabledForSomeCertificationCenter();
    if (!isEndTestScreenRemovalEnabled) {
      throw new ForbiddenAccess(apps.PIX_CERTIF.NOT_LINKED_CERTIFICATION_MSG);
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authenticateUser({
  password,
  scope,
  source,
  username,
  refreshTokenService,
  pixAuthenticationService,
  tokenService,
  userRepository,
  adminMemberRepository
}: $TSFixMe) {
  try {
    const foundUser = await pixAuthenticationService.getUserByUsernameAndPassword({
      username,
      password,
      userRepository,
    });

    const shouldChangePassword = get(
      foundUser,
      'authenticationMethods[0].authenticationComplement.shouldChangePassword'
    );

    if (shouldChangePassword) {
      const passwordResetToken = tokenService.createPasswordResetToken(foundUser.id);
      throw new UserShouldChangePasswordError(undefined, passwordResetToken);
    }

    await _checkUserAccessScope(scope, foundUser, adminMemberRepository);
    const refreshToken = await refreshTokenService.createRefreshTokenFromUserId({ userId: foundUser.id, source });
    const { accessToken, expirationDelaySeconds } = await refreshTokenService.createAccessTokenFromRefreshToken({
      refreshToken,
    });

    await userRepository.updateLastLoggedAt({ userId: foundUser.id });
    return { accessToken, refreshToken, expirationDelaySeconds };
  } catch (error) {
    if (error instanceof ForbiddenAccess || error instanceof UserShouldChangePasswordError) {
      throw error;
    }
    throw new MissingOrInvalidCredentialsError();
  }
};
