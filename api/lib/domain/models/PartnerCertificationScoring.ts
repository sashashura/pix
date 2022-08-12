// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotImpleme... Remove this comment to see the full error message
const { NotImplementedError } = require('../errors');

const SOURCES = {
  PIX: 'PIX',
  EXTERNAL: 'EXTERNAL',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
class PartnerCertificationScoring {
  complementaryCertificationCourseId: $TSFixMe;
  partnerKey: $TSFixMe;
  source: $TSFixMe;
  constructor({
    complementaryCertificationCourseId,
    partnerKey,
    source = 'PIX'
  }: $TSFixMe = {}) {
    this.complementaryCertificationCourseId = complementaryCertificationCourseId;
    this.partnerKey = partnerKey;
    this.source = source;
    const schema = Joi.object({
      complementaryCertificationCourseId: Joi.number().integer().required(),
      partnerKey: Joi.string().allow(null).required(),
      source: Joi.string()
        .required()
        .valid(...Object.values(SOURCES)),
    });
    validateEntity(schema, this);
  }

  isAcquired() {
    throw new NotImplementedError();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PartnerCertificationScoring;
