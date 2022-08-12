// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

const identityProviders = {
  PIX: 'PIX',
  GAR: 'GAR',
  POLE_EMPLOI: 'POLE_EMPLOI',
  CNAV: 'CNAV',
};

class PixAuthenticationComplement {
  password: $TSFixMe;
  shouldChangePassword: $TSFixMe;
  constructor({
    password,
    shouldChangePassword
  }: $TSFixMe = {}) {
    this.password = password;
    this.shouldChangePassword = shouldChangePassword;

    validateEntity(
      Joi.object({
        password: Joi.string().required(),
        shouldChangePassword: Joi.boolean().required(),
      }),
      this
    );
  }
}

class OidcAuthenticationComplement {
  accessToken: $TSFixMe;
  expiredDate: $TSFixMe;
  refreshToken: $TSFixMe;
  constructor({
    accessToken,
    refreshToken,
    expiredDate
  }: $TSFixMe = {}) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiredDate = expiredDate;

    validateEntity(
      Joi.object({
        accessToken: Joi.string().required(),
        refreshToken: Joi.string().optional(),
        expiredDate: Joi.date().required(),
      }),
      this
    );
  }
}

class GARAuthenticationComplement {
  firstName: $TSFixMe;
  lastName: $TSFixMe;
  constructor({
    firstName,
    lastName
  }: $TSFixMe = {}) {
    this.firstName = firstName;
    this.lastName = lastName;

    validateEntity(
      Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
      }),
      this
    );
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationSchema = Joi.object({
  id: Joi.number().optional(),
  identityProvider: Joi.string()
    .valid(...Object.values(identityProviders))
    .required(),
  authenticationComplement: Joi.when('identityProvider', [
    { is: identityProviders.PIX, then: Joi.object().instance(PixAuthenticationComplement).required() },
    { is: identityProviders.POLE_EMPLOI, then: Joi.object().instance(OidcAuthenticationComplement).required() },
    { is: identityProviders.GAR, then: Joi.any().empty() },
    { is: identityProviders.CNAV, then: Joi.any().empty() },
  ]),
  externalIdentifier: Joi.when('identityProvider', [
    { is: identityProviders.GAR, then: Joi.string().required() },
    { is: identityProviders.POLE_EMPLOI, then: Joi.string().required() },
    { is: identityProviders.PIX, then: Joi.any().forbidden() },
    { is: identityProviders.CNAV, then: Joi.string().required() },
  ]),
  userId: Joi.number().integer().required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
class AuthenticationMethod {
  static identityProviders = identityProviders;

  static PixAuthenticationComplement: $TSFixMe;

  static OidcAuthenticationComplement: $TSFixMe;

  static GARAuthenticationComplement: $TSFixMe;

  authenticationComplement: $TSFixMe;
  createdAt: $TSFixMe;
  externalIdentifier: $TSFixMe;
  id: $TSFixMe;
  identityProvider: $TSFixMe;
  updatedAt: $TSFixMe;
  userId: $TSFixMe;

  constructor({
    id,
    identityProvider,
    authenticationComplement,
    externalIdentifier,
    createdAt,
    updatedAt,
    userId
  }: $TSFixMe = {}) {
    this.id = id;
    this.identityProvider = identityProvider;
    this.authenticationComplement = authenticationComplement;
    this.externalIdentifier = externalIdentifier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;

    validateEntity(validationSchema, this);
  }

  static buildPixAuthenticationMethod({
    id,
    password,
    shouldChangePassword = false,
    createdAt,
    updatedAt,
    userId
  }: $TSFixMe) {
    const authenticationComplement = new PixAuthenticationComplement({ password, shouldChangePassword });
    return new AuthenticationMethod({
      id,
      identityProvider: identityProviders.PIX,
      authenticationComplement,
      externalIdentifier: undefined,
      createdAt,
      updatedAt,
      userId,
    });
  }
}
AuthenticationMethod.PixAuthenticationComplement = PixAuthenticationComplement;
AuthenticationMethod.OidcAuthenticationComplement = OidcAuthenticationComplement;
AuthenticationMethod.GARAuthenticationComplement = GARAuthenticationComplement;
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AuthenticationMethod;
