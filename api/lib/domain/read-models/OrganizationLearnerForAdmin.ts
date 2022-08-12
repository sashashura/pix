// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationSchema = Joi.object({
  id: Joi.number().integer().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  birthdate: Joi.date().required().allow(null),
  division: Joi.string().required().allow(null),
  group: Joi.string().required().allow(null),
  organizationId: Joi.number().integer().required(),
  organizationName: Joi.string().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
  isDisabled: Joi.boolean().required(),
  canBeDissociated: Joi.boolean().required(),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationLearnerForAdmin {
  birthdate: $TSFixMe;
  canBeDissociated: $TSFixMe;
  createdAt: $TSFixMe;
  division: $TSFixMe;
  firstName: $TSFixMe;
  group: $TSFixMe;
  id: $TSFixMe;
  isDisabled: $TSFixMe;
  lastName: $TSFixMe;
  organizationId: $TSFixMe;
  organizationName: $TSFixMe;
  updatedAt: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    division,
    group,
    organizationId,
    organizationName,
    createdAt,
    updatedAt,
    isDisabled,
    organizationIsManagingStudents
  }: $TSFixMe) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.division = division;
    this.group = group;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDisabled = isDisabled;
    this.canBeDissociated = organizationIsManagingStudents;

    validateEntity(validationSchema, this);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationLearnerForAdmin;
