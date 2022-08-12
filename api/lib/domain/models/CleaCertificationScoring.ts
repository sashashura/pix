// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
const PartnerCertificationScoring = require('./PartnerCertificationScoring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotEligibl... Remove this comment to see the full error message
const { NotEligibleCandidateError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
class CleaCertificationScoring extends PartnerCertificationScoring {
  complementaryCertificationCourseId: $TSFixMe;
  hasAcquiredBadge: $TSFixMe;
  isBadgeAcquisitionStillValid: $TSFixMe;
  minimumEarnedPix: $TSFixMe;
  minimumReproducibilityRate: $TSFixMe;
  pixScore: $TSFixMe;
  reproducibilityRate: $TSFixMe;
  constructor({
    complementaryCertificationCourseId,
    hasAcquiredBadge,
    reproducibilityRate,
    isBadgeAcquisitionStillValid = true,
    cleaBadgeKey,
    pixScore,
    minimumEarnedPix,
    minimumReproducibilityRate
  }: $TSFixMe = {}) {
    super({
      complementaryCertificationCourseId,
      partnerKey: cleaBadgeKey,
    });

    this.complementaryCertificationCourseId = complementaryCertificationCourseId;
    this.hasAcquiredBadge = hasAcquiredBadge;
    this.isBadgeAcquisitionStillValid = isBadgeAcquisitionStillValid;
    this.reproducibilityRate = reproducibilityRate;
    this.pixScore = pixScore;
    this.minimumEarnedPix = minimumEarnedPix;
    this.minimumReproducibilityRate = minimumReproducibilityRate;

    const schema = Joi.object({
      hasAcquiredBadge: Joi.boolean().required(),
      reproducibilityRate: Joi.number().required(),
    }).unknown();

    validateEntity(schema, this);
  }

  static buildNotEligible({
    complementaryCertificationCourseId
  }: $TSFixMe) {
    return new CleaCertificationScoring({
      complementaryCertificationCourseId,
      hasAcquiredBadge: false,
      isBadgeAcquisitionStillValid: false,
      reproducibilityRate: 0,
      cleaBadgeKey: 'no_badge',
    });
  }

  isEligible() {
    return this.hasAcquiredBadge && this.isBadgeAcquisitionStillValid;
  }

  setBadgeAcquisitionStillValid(isValid: $TSFixMe) {
    this.isBadgeAcquisitionStillValid = isValid;
  }

  isAcquired() {
    if (!this.hasAcquiredBadge) throw new NotEligibleCandidateError();
    return this._isAboveMinimumReproducibilityRate() && this._isAboveMinimumScore();
  }

  _isAboveMinimumScore() {
    return this.pixScore >= this.minimumEarnedPix;
  }

  _isAboveMinimumReproducibilityRate() {
    return this.reproducibilityRate >= this.minimumReproducibilityRate;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CleaCertificationScoring;
