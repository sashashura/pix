// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isUndefine... Remove this comment to see the full error message
const isUndefined = require('lodash/isUndefined');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildUser'... Remove this comment to see the full error message
const buildUser = require('./build-user');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encrypt'.
const encrypt = require('../../../lib/domain/services/encryption-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildAuthe... Remove this comment to see the full error message
const buildAuthenticationMethod = {};

(buildAuthenticationMethod as $TSFixMe).withGarAsIdentityProvider = function ({ id = databaseBuffer.getNextId(), identityProvider = AuthenticationMethod.identityProviders.GAR, externalIdentifier = 'externalId', userId, userFirstName = 'Margotte', userLastName = 'Saint-James', createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-01-02') }: $TSFixMe = {}) {
    userId = isUndefined(userId) ? buildUser().id : userId;
    const values = {
        id,
        identityProvider,
        externalIdentifier,
        authenticationComplement: {
            firstName: userFirstName,
            lastName: userLastName,
        },
        userId,
        createdAt,
        updatedAt,
    };
    return databaseBuffer.pushInsertable({
        tableName: 'authentication-methods',
        values,
    });
};

(buildAuthenticationMethod as $TSFixMe).withPixAsIdentityProviderAndHashedPassword = function ({ id = databaseBuffer.getNextId(), hashedPassword = 'ABCDEF123', shouldChangePassword = false, userId, createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-01-02') }: $TSFixMe = {}) {
    userId = isUndefined(userId) ? buildUser().id : userId;
    const values = {
        id,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
        authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
            password: hashedPassword,
            shouldChangePassword,
        }),
        externalIdentifier: undefined,
        userId,
        createdAt,
        updatedAt,
    };
    return databaseBuffer.pushInsertable({
        tableName: 'authentication-methods',
        values,
    });
};

(buildAuthenticationMethod as $TSFixMe).withPixAsIdentityProviderAndPassword = function ({ id = databaseBuffer.getNextId(), password = 'Password123', shouldChangePassword = false, userId, createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-01-02') }: $TSFixMe = {}) {
    // eslint-disable-next-line no-sync
    const hashedPassword = encrypt.hashPasswordSync(password);
    userId = isUndefined(userId) ? buildUser().id : userId;
    const values = {
        id,
        identityProvider: AuthenticationMethod.identityProviders.PIX,
        authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
            password: hashedPassword,
            shouldChangePassword,
        }),
        externalIdentifier: undefined,
        userId,
        createdAt,
        updatedAt,
    };
    return databaseBuffer.pushInsertable({
        tableName: 'authentication-methods',
        values,
    });
};

(buildAuthenticationMethod as $TSFixMe).withPoleEmploiAsIdentityProvider = function ({ id = databaseBuffer.getNextId(), externalIdentifier, accessToken = 'ABC789', refreshToken = 'DEF753', expiredDate = new Date('2022-01-01'), userId, createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-01-02') }: $TSFixMe = {}) {
    userId = isUndefined(userId) ? buildUser().id : userId;
    let generatedIdentifier = externalIdentifier;
    if (!generatedIdentifier) {
        generatedIdentifier = `externalIdentifier-${id}`;
    }
    const values = {
        id,
        identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        authenticationComplement: new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken,
            refreshToken,
            expiredDate,
        }),
        externalIdentifier: generatedIdentifier,
        userId,
        createdAt,
        updatedAt,
    };
    return databaseBuffer.pushInsertable({
        tableName: 'authentication-methods',
        values,
    });
};

(buildAuthenticationMethod as $TSFixMe).withIdentityProvider = function ({ id = databaseBuffer.getNextId(), identityProvider, externalIdentifier, accessToken = 'ABC789', refreshToken = 'DEF753', expiredDate = new Date('2022-01-01'), userId, createdAt = new Date('2020-01-01'), updatedAt = new Date('2020-01-02') }: $TSFixMe = {}) {
    userId = isUndefined(userId) ? buildUser().id : userId;
    let generatedIdentifier = externalIdentifier;
    if (!generatedIdentifier) {
        generatedIdentifier = `externalIdentifier-${id}`;
    }
    const values = {
        id,
        identityProvider,
        authenticationComplement: new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken,
            refreshToken,
            expiredDate,
        }),
        externalIdentifier: generatedIdentifier,
        userId,
        createdAt,
        updatedAt,
    };
    return databaseBuffer.pushInsertable({
        tableName: 'authentication-methods',
        values,
    });
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildAuthenticationMethod;
