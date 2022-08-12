// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
const { InvalidCertificationCandidate } = require('../errors');

const scoCertificationCandidateValidationJoiSchema = Joi.object({
  firstName: Joi.string().required().empty(null),
  lastName: Joi.string().required().empty(null),
  birthdate: Joi.date().format('YYYY-MM-DD').greater('1900-01-01').required().empty(null),
  birthINSEECode: Joi.string().allow(null).optional(),
  birthCountry: Joi.string().allow(null).optional(),
  birthCity: Joi.string().allow(null, '').optional(),
  sex: Joi.string().allow(null).optional(),
  sessionId: Joi.number().required().empty(null),
  organizationLearnerId: Joi.number().required().empty(null),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCOCertifi... Remove this comment to see the full error message
class SCOCertificationCandidate {
  birthCity: $TSFixMe;
  birthCountry: $TSFixMe;
  birthINSEECode: $TSFixMe;
  birthdate: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  organizationLearnerId: $TSFixMe;
  sessionId: $TSFixMe;
  sex: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthINSEECode,
    birthCountry,
    birthCity,
    sex,
    sessionId,
    organizationLearnerId
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthINSEECode = birthINSEECode;
    this.birthCountry = birthCountry;
    this.birthCity = birthCity;
    this.sex = sex;
    this.sessionId = sessionId;
    this.organizationLearnerId = organizationLearnerId;
    this.validate();
  }

  validate() {
    const { error } = scoCertificationCandidateValidationJoiSchema.validate(this, { allowUnknown: true });
    if (error) {
      throw InvalidCertificationCandidate.fromJoiErrorDetail(error.details[0]);
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SCOCertificationCandidate;
