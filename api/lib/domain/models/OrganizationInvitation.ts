// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  CANCELLED: 'cancelled',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'roles'.
const roles = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  AUTO: null,
};

const validationScheme = Joi.object({
  id: Joi.number().optional(),
  email: Joi.string().optional(),
  status: Joi.string().optional(),
  code: Joi.string().optional(),
  organizationName: Joi.string().allow(null).optional(),
  role: Joi.string()
    .valid(...Object.values(roles))
    .optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  organizationId: Joi.number().optional(),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationInvitation {
  static StatusType = statuses;

  code: $TSFixMe;
  createdAt: $TSFixMe;
  email: $TSFixMe;
  id: $TSFixMe;
  organizationId: $TSFixMe;
  organizationName: $TSFixMe;
  role: $TSFixMe;
  status: $TSFixMe;
  updatedAt: $TSFixMe;

  constructor({
    id,
    email,
    status,
    code,
    organizationName,
    role,
    createdAt,
    updatedAt,

    //references
    organizationId
  }: $TSFixMe = {}) {
    this.id = id;
    this.email = email;
    this.status = status;
    this.code = code;
    this.organizationName = organizationName;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    //references
    this.organizationId = organizationId;

    validateEntity(validationScheme, this);
  }

  get isPending() {
    return this.status === (statuses as $TSFixMe).PENDING;
  }

  get isAccepted() {
    return this.status === (statuses as $TSFixMe).ACCEPTED;
  }

  get isCancelled() {
    return this.status === (statuses as $TSFixMe).CANCELLED;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationInvitation;
