// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../constants').PIX_ADMIN;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class AdminMember {
  createdAt: $TSFixMe;
  disabledAt: $TSFixMe;
  email: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  role: $TSFixMe;
  updatedAt: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    id,
    userId,
    firstName,
    lastName,
    email,
    role,
    createdAt,
    updatedAt,
    disabledAt
  }: $TSFixMe) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.disabledAt = disabledAt;

    validateEntity(
      Joi.object({
        id: Joi.number().integer().required(),
        userId: Joi.number().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid(ROLES.SUPER_ADMIN, ROLES.SUPPORT, ROLES.METIER, ROLES.CERTIF).required(),
        createdAt: Joi.date().allow(null).optional(),
        updatedAt: Joi.date().allow(null).optional(),
        disabledAt: Joi.date().allow(null).optional(),
      }),
      this
    );
  }

  get hasAccessToAdminScope() {
    return this.role in ROLES && isNil(this.disabledAt);
  }

  get isSuperAdmin() {
    return this.role === ROLES.SUPER_ADMIN && isNil(this.disabledAt);
  }

  get isCertif() {
    return this.role === ROLES.CERTIF && isNil(this.disabledAt);
  }

  get isMetier() {
    return this.role === ROLES.METIER && isNil(this.disabledAt);
  }

  get isSupport() {
    return this.role === ROLES.SUPPORT && isNil(this.disabledAt);
  }
};
