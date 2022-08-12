// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const endsWith = require('lodash/endsWith');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
  PIX_PLUS_DROIT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
  CLEA,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_1ER_DEGRE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_2ND_DEGRE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('./ComplementaryCertification');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
  InvalidCertificationCandidate,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidatePersonalInfoFieldMissingError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidatePersonalInfoWrongFormat,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BILLING_MO... Remove this comment to see the full error message
const BILLING_MODES = {
  FREE: 'FREE',
  PAID: 'PAID',
  PREPAID: 'PREPAID',
};

const certificationCandidateValidationJoiSchema_v1_5 = Joi.object({
  firstName: Joi.string().required().empty(null),
  lastName: Joi.string().required().empty(null),
  sex: Joi.string().valid('M', 'F').required().empty(null),
  birthPostalCode: Joi.string().empty(null),
  birthINSEECode: Joi.string().empty(null),
  birthCountry: Joi.string().required().empty(null),
  email: Joi.string().email().allow(null).optional(),
  resultRecipientEmail: Joi.string().email().allow(null).optional(),
  externalId: Joi.string().allow(null).optional(),
  birthdate: Joi.date().format('YYYY-MM-DD').greater('1900-01-01').required().empty(null),
  extraTimePercentage: Joi.number().allow(null).optional(),
  sessionId: Joi.number().required().empty(null),
  complementaryCertifications: Joi.array().required(),
  billingMode: Joi.when('$isSco', {
    is: false,
    then: Joi.string()
      .valid(...Object.values(BILLING_MODES))
      .required(),
  }),
  prepaymentCode: Joi.when('billingMode', {
    is: 'PREPAID',
    then: Joi.string().required().empty(null),
    otherwise: Joi.valid(null),
  }),
});

const certificationCandidateParticipationJoiSchema = Joi.object({
  id: Joi.any().allow(null).optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  sex: Joi.string().allow(null).optional(),
  birthCity: Joi.any().allow(null).optional(),
  birthProvinceCode: Joi.any().allow(null).optional(),
  birthCountry: Joi.any().allow(null).optional(),
  birthPostalCode: Joi.string().allow(null).optional(),
  birthINSEECode: Joi.string().allow(null).optional(),
  email: Joi.any().allow(null).optional(),
  resultRecipientEmail: Joi.string().email().allow(null).optional(),
  externalId: Joi.any().allow(null).optional(),
  birthdate: Joi.date().format('YYYY-MM-DD').greater('1900-01-01').required(),
  createdAt: Joi.any().allow(null).optional(),
  authorizedToStart: Joi.boolean().optional(),
  extraTimePercentage: Joi.any().allow(null).optional(),
  sessionId: Joi.number().required(),
  userId: Joi.any().allow(null).optional(),
  organizationLearnerId: Joi.any().allow(null).optional(),
  complementaryCertifications: Joi.array(),
  billingMode: Joi.string()
    .valid(...Object.values(BILLING_MODES))
    .empty(null),
  prepaymentCode: Joi.string().allow(null).optional(),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidate {
  static BILLING_MODES = BILLING_MODES;

  authorizedToStart: $TSFixMe;
  billingMode: $TSFixMe;
  birthCity: $TSFixMe;
  birthCountry: $TSFixMe;
  birthINSEECode: $TSFixMe;
  birthPostalCode: $TSFixMe;
  birthProvinceCode: $TSFixMe;
  birthdate: $TSFixMe;
  complementaryCertifications: $TSFixMe;
  createdAt: $TSFixMe;
  email: $TSFixMe;
  externalId: $TSFixMe;
  extraTimePercentage: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  organizationLearnerId: $TSFixMe;
  prepaymentCode: $TSFixMe;
  resultRecipientEmail: $TSFixMe;
  sessionId: $TSFixMe;
  sex: $TSFixMe;
  userId: $TSFixMe;

  constructor({
    id,
    firstName,
    lastName,
    sex,
    birthPostalCode,
    birthINSEECode,
    birthCity,
    birthProvinceCode,
    birthCountry,
    email,
    resultRecipientEmail,
    externalId,
    birthdate,
    extraTimePercentage,
    createdAt,
    authorizedToStart,
    sessionId,
    userId,
    organizationLearnerId = null,
    complementaryCertifications = [],
    billingMode = null,
    prepaymentCode = null
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthCity = birthCity;
    this.birthProvinceCode = birthProvinceCode;
    this.birthCountry = birthCountry;
    this.birthPostalCode = birthPostalCode;
    this.birthINSEECode = birthINSEECode;
    this.sex = sex;
    this.email = email;
    this.resultRecipientEmail = resultRecipientEmail;
    this.externalId = externalId;
    this.birthdate = birthdate;
    this.extraTimePercentage = !isNil(extraTimePercentage) ? parseFloat(extraTimePercentage) : extraTimePercentage;
    this.createdAt = createdAt;
    this.authorizedToStart = authorizedToStart;
    this.sessionId = sessionId;
    this.userId = userId;
    this.organizationLearnerId = organizationLearnerId;
    this.complementaryCertifications = complementaryCertifications;
    this.billingMode = billingMode;
    this.prepaymentCode = prepaymentCode;
  }

  static translateBillingMode(value: $TSFixMe) {
    switch (value) {
      case 'FREE':
        return 'Gratuite';
      case 'PAID':
        return 'Payante';
      case 'PREPAID':
        return 'Prépayée';
      case 'Gratuite':
        return 'FREE';
      case 'Payante':
        return 'PAID';
      case 'Prépayée':
        return 'PREPAID';
      case null:
      default:
        return '';
    }
  }

  validate(isSco = false) {
    const { error } = certificationCandidateValidationJoiSchema_v1_5.validate(this, {
      allowUnknown: true,
      context: {
        isSco,
      },
    });
    if (error) {
      throw InvalidCertificationCandidate.fromJoiErrorDetail(error.details[0]);
    }
  }

  validateParticipation() {
    const { error } = certificationCandidateParticipationJoiSchema.validate(this);
    if (error) {
      if (endsWith(error.details[0].type, 'required')) {
        throw new CertificationCandidatePersonalInfoFieldMissingError();
      }
      throw new CertificationCandidatePersonalInfoWrongFormat();
    }

    if (this.isBillingModePrepaid() && !this.prepaymentCode) {
      throw new CertificationCandidatePersonalInfoFieldMissingError();
    }
  }

  get translatedBillingMode() {
    return CertificationCandidate.translateBillingMode(this.billingMode);
  }

  isAuthorizedToStart() {
    return this.authorizedToStart;
  }

  isLinkedToAUser() {
    return !isNil(this.userId);
  }

  isLinkedToUserId(userId: $TSFixMe) {
    return this.userId === userId;
  }

  updateBirthInformation({
    birthCountry,
    birthINSEECode,
    birthPostalCode,
    birthCity
  }: $TSFixMe) {
    this.birthCountry = birthCountry;
    this.birthINSEECode = birthINSEECode;
    this.birthPostalCode = birthPostalCode;
    this.birthCity = birthCity;
  }

  isGrantedPixPlusDroit() {
    return this.complementaryCertifications.some((comp: $TSFixMe) => comp.key === PIX_PLUS_DROIT);
  }

  isGrantedCleA() {
    return this.complementaryCertifications.some((comp: $TSFixMe) => comp.key === CLEA);
  }

  isGrantedPixPlusEdu1erDegre() {
    return this.complementaryCertifications.some((comp: $TSFixMe) => comp.key === PIX_PLUS_EDU_1ER_DEGRE);
  }

  isGrantedPixPlusEdu2ndDegre() {
    return this.complementaryCertifications.some((comp: $TSFixMe) => comp.key === PIX_PLUS_EDU_2ND_DEGRE);
  }

  isBillingModePrepaid() {
    return this.billingMode === CertificationCandidate.BILLING_MODES.PREPAID;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCandidate;
