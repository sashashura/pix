// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../models/Badge').keys;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
class CertifiedBadges {
  complementaryCertificationCourseResults: $TSFixMe;
  constructor({
    complementaryCertificationCourseResults
  }: $TSFixMe) {
    this.complementaryCertificationCourseResults = complementaryCertificationCourseResults;
  }

  getAcquiredCertifiedBadgesDTO() {
    const complementaryCertificationCourseResultsByPartnerKey = _.groupBy(
      this.complementaryCertificationCourseResults,
      'complementaryCertificationCourseId'
    );

    return Object.values(complementaryCertificationCourseResultsByPartnerKey)
      .map((complementaryCertificationCourseResults) => {
        const partnerKey = (complementaryCertificationCourseResults as $TSFixMe)[0].partnerKey;
        if ((complementaryCertificationCourseResults as $TSFixMe)[0].isPixEdu()) {
          if ((complementaryCertificationCourseResults as $TSFixMe).length === 1) {
            if (!(complementaryCertificationCourseResults as $TSFixMe)[0].isAcquired()) {
              return;
            }
            return { partnerKey, isTemporaryBadge: true };
          }

          if ((complementaryCertificationCourseResults as $TSFixMe).length > 1) {
            if (this._hasRejectedJuryCertifiedBadge(complementaryCertificationCourseResults)) {
              return;
            }

            const lowestPartnerKey = this._getLowestPartnerKey(complementaryCertificationCourseResults);

            return { partnerKey: lowestPartnerKey, isTemporaryBadge: false };
          }
        }

        if ((complementaryCertificationCourseResults as $TSFixMe)[0].isAcquired()) {
          return { partnerKey, isTemporaryBadge: false };
        }
      })
      .filter(Boolean);
  }

  _getLowestPartnerKey(complementaryCertificationCourseResults: $TSFixMe) {
    if (complementaryCertificationCourseResults[0].isPixEdu2ndDegre()) {
      return this._getLowestPartnerKeyForPixEdu2ndDegreBadge(complementaryCertificationCourseResults);
    }
    if (complementaryCertificationCourseResults[0].isPixEdu1erDegre()) {
      return this._getLowestPartnerKeyForPixEdu1erDegreBadge(complementaryCertificationCourseResults);
    }
  }

  _getLowestPartnerKeyForPixEdu2ndDegreBadge(complementaryCertificationCourseResults: $TSFixMe) {
    const firstIndexOf = [
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
    ].indexOf(complementaryCertificationCourseResults[0].partnerKey);

    const secondIndexOf = [
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
    ].indexOf(complementaryCertificationCourseResults[1].partnerKey);

    return firstIndexOf <= secondIndexOf
      ? complementaryCertificationCourseResults[0].partnerKey
      : complementaryCertificationCourseResults[1].partnerKey;
  }

  _getLowestPartnerKeyForPixEdu1erDegreBadge(complementaryCertificationCourseResults: $TSFixMe) {
    const firstIndexOf = [
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
    ].indexOf(complementaryCertificationCourseResults[0].partnerKey);

    const secondIndexOf = [
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
    ].indexOf(complementaryCertificationCourseResults[1].partnerKey);

    return firstIndexOf <= secondIndexOf
      ? complementaryCertificationCourseResults[0].partnerKey
      : complementaryCertificationCourseResults[1].partnerKey;
  }

  _hasRejectedJuryCertifiedBadge(complementaryCertificationCourseResults: $TSFixMe) {
    return complementaryCertificationCourseResults.some(
      (complementaryCertificationCourseResult: $TSFixMe) => !complementaryCertificationCourseResult.isAcquired() &&
      complementaryCertificationCourseResult.isFromExternalSource()
    );
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertifiedBadges;
