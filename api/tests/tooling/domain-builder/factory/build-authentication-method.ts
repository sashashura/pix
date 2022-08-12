// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isUndefine... Remove this comment to see the full error message
const isUndefined = require('lodash/isUndefined');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encrypt'.
const encrypt = require('../../../../lib/domain/services/encryption-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../lib/domain/models/AuthenticationMethod');

function _buildUser() {
  return new User({
    id: 456,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.net',
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAuthe... Remove this comment to see the full error message
const buildAuthenticationMethod = {};

// @ts-expect-error TS(7022): 'id' implicitly has type 'any' because it does not... Remove this comment to see the full error message
(buildAuthenticationMethod as $TSFixMe).withGarAsIdentityProvider = function ({ id = 123, identityProvider = AuthenticationMethod.identityProviders.GAR, externalIdentifier = `externalId${id}`, userId = 456, userFirstName = 'Margotte', userLastName = 'Saint-James', createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-02-01'), } = {}) {
    userId = isUndefined(userId) ? _buildUser().id : userId;
    return new AuthenticationMethod({
        id,
        identityProvider,
        externalIdentifier,
        authenticationComplement: new AuthenticationMethod.GARAuthenticationComplement({
            firstName: userFirstName,
            lastName: userLastName,
        }),
        userId,
        createdAt,
        updatedAt,
    });
};

(buildAuthenticationMethod as $TSFixMe).withPixAsIdentityProviderAndRawPassword = function ({ id, rawPassword = 'pix123', shouldChangePassword = false, userId, createdAt, updatedAt }: $TSFixMe = {}) {
    // eslint-disable-next-line no-sync
    const password = encrypt.hashPasswordSync(rawPassword);
    userId = isUndefined(userId) ? _buildUser().id : userId;
    return new AuthenticationMethod({
        id,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
        authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
            password,
            shouldChangePassword,
        }),
        externalIdentifier: undefined,
        userId,
        createdAt,
        updatedAt,
    });
};

(buildAuthenticationMethod as $TSFixMe).withPixAsIdentityProviderAndHashedPassword = function ({ id, hashedPassword = 'hashedPassword', shouldChangePassword = false, userId, createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-02-01') }: $TSFixMe = {}) {
    const password = hashedPassword;
    userId = isUndefined(userId) ? _buildUser().id : userId;
    return new AuthenticationMethod({
        id,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
        authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
            password,
            shouldChangePassword,
        }),
        externalIdentifier: undefined,
        userId,
        createdAt,
        updatedAt,
    });
};

(buildAuthenticationMethod as $TSFixMe).withPoleEmploiAsIdentityProvider = function ({ id, externalIdentifier = `externalId${id}`, accessToken = 'ABC456789', refreshToken = 'ZFGEADZA789', expiredDate = new Date('2022-01-01'), userId, createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-02-01') }: $TSFixMe = {}) {
    userId = isUndefined(userId) ? _buildUser().id : userId;
    return new AuthenticationMethod({
        id,
        identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        authenticationComplement: new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken,
            refreshToken,
            expiredDate,
        }),
        externalIdentifier,
        userId,
        createdAt,
        updatedAt,
    });
};

(buildAuthenticationMethod as $TSFixMe).withIdentityProvider = function ({ id, identityProvider, externalIdentifier = `externalId${id}`, accessToken = 'ABC456789', refreshToken = 'ZFGEADZA789', expiredDate = new Date('2022-01-01'), userId, createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-02-01') }: $TSFixMe = {}) {
    userId = isUndefined(userId) ? _buildUser().id : userId;
    return new AuthenticationMethod({
        id,
        identityProvider,
        authenticationComplement: new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken,
            refreshToken,
            expiredDate,
        }),
        externalIdentifier,
        userId,
        createdAt,
        updatedAt,
    });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildAuthenticationMethod;
