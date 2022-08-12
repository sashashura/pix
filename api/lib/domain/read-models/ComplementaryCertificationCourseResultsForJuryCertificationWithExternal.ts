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

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getLabelBy... Remove this comment to see the full error message
const { getLabelByBadgeKey } = require('../read-models/CertifiableBadgeLabels');

const pixEdu1stDegreeBadges = [
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
];

const pixEdu2ndDegreeBadges = [
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
];

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertificationCourseResultsForJuryCertificationWithExternal {
  complementaryCertificationCourseId: $TSFixMe;
  externalSection: $TSFixMe;
  pixSection: $TSFixMe;
  constructor({
    complementaryCertificationCourseId,
    pixPartnerKey,
    pixAcquired,
    externalPartnerKey,
    externalAcquired
  }: $TSFixMe) {
    this.complementaryCertificationCourseId = complementaryCertificationCourseId;
    this.pixSection = new PixEduSection({ partnerKey: pixPartnerKey, acquired: pixAcquired });
    this.externalSection = new PixEduSection({ partnerKey: externalPartnerKey, acquired: externalAcquired });
  }

  static from(complementaryCertificationCourseResultsWithExternal: $TSFixMe) {
    if (!complementaryCertificationCourseResultsWithExternal.length) {
      return;
    }
    const pixComplementaryCertificationCourseResult = complementaryCertificationCourseResultsWithExternal.find(
      ({
        source
      }: $TSFixMe) => source === 'PIX'
    );
    const externalComplementaryCertificationCourseResult = complementaryCertificationCourseResultsWithExternal.find(
      ({
        source
      }: $TSFixMe) => source === 'EXTERNAL'
    );

    return new ComplementaryCertificationCourseResultsForJuryCertificationWithExternal({
      complementaryCertificationCourseId:
        complementaryCertificationCourseResultsWithExternal[0].complementaryCertificationCourseId,
      pixPartnerKey: pixComplementaryCertificationCourseResult?.partnerKey,
      pixAcquired: pixComplementaryCertificationCourseResult?.acquired,
      externalPartnerKey: externalComplementaryCertificationCourseResult?.partnerKey,
      externalAcquired: externalComplementaryCertificationCourseResult?.acquired,
    });
  }

  get pixResult() {
    if (!this.pixSection.isEvaluated) return null;
    if (!this.pixSection.acquired) return 'Rejetée';
    return getLabelByBadgeKey(this.pixSection.partnerKey);
  }

  get externalResult() {
    if (!this.pixSection.acquired) return '-';
    if (!this.externalSection.isEvaluated) return 'En attente';
    if (!this.externalSection.acquired) return 'Rejetée';
    return getLabelByBadgeKey(this.externalSection.partnerKey);
  }

  get finalResult() {
    if (!this.pixSection.acquired) return 'Rejetée';
    if (!this.externalSection.isEvaluated) return 'En attente volet jury';
    if (!this.externalSection.acquired) return 'Rejetée';
    if (this.pixSection._isPixEdu1erDegre() && this.externalSection._isPixEdu1erDegre())
      return this._getLowestPartnerKeyLabelForPixEdu1erDegreBadge();
    if (this.pixSection._isPixEdu2ndDegre() && this.externalSection._isPixEdu2ndDegre())
      return this._getLowestPartnerKeyLabelForPixEdu2ndDegreBadge();
    throw new Error(`Badges edu incoherent !!! ${this.pixSection.partnerKey} et ${this.externalSection.partnerKey}`);
  }

  get allowedExternalLevels() {
    const partnerKey = this.pixSection.partnerKey;
    let filteredBadges;
    if (this._isInitial1stDegree(partnerKey)) {
      filteredBadges = pixEdu1stDegreeBadges.filter(this._isInitial1stDegree);
    }
    if (this._isContinue1stDegree(partnerKey)) {
      filteredBadges = pixEdu1stDegreeBadges.filter(this._isContinue1stDegree);
    }
    if (this._isInitial2ndDegree(partnerKey)) {
      filteredBadges = pixEdu2ndDegreeBadges.filter(this._isInitial2ndDegree);
    }
    if (this._isContinue2ndDegree(partnerKey)) {
      filteredBadges = pixEdu2ndDegreeBadges.filter(this._isContinue2ndDegree);
    }

    // @ts-expect-error TS(2454): Variable 'filteredBadges' is used before being ass... Remove this comment to see the full error message
    if (!filteredBadges.length) {
      throw new Error('Unknown pix level');
    }

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    return filteredBadges.map((badge) => {
      return {
        label: getLabelByBadgeKey(badge),
        value: badge,
      };
    });
  }

  _isInitial1stDegree(partnerKey: $TSFixMe) {
    return partnerKey.startsWith('PIX_EDU_FORMATION_INITIALE_1ER_DEGRE');
  }
  _isContinue1stDegree(partnerKey: $TSFixMe) {
    return partnerKey.startsWith('PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE');
  }
  _isInitial2ndDegree(partnerKey: $TSFixMe) {
    return partnerKey.startsWith('PIX_EDU_FORMATION_INITIALE_2ND_DEGRE');
  }
  _isContinue2ndDegree(partnerKey: $TSFixMe) {
    return partnerKey.startsWith('PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE');
  }

  _getLowestPartnerKeyLabelForPixEdu2ndDegreBadge() {
    const firstIndexOf = pixEdu2ndDegreeBadges.indexOf(this.pixSection.partnerKey);
    const secondIndexOf = pixEdu2ndDegreeBadges.indexOf(this.externalSection.partnerKey);

    return firstIndexOf <= secondIndexOf
      ? getLabelByBadgeKey(this.pixSection.partnerKey)
      : getLabelByBadgeKey(this.externalSection.partnerKey);
  }

  _getLowestPartnerKeyLabelForPixEdu1erDegreBadge() {
    const firstIndexOf = pixEdu1stDegreeBadges.indexOf(this.pixSection.partnerKey);
    const secondIndexOf = pixEdu1stDegreeBadges.indexOf(this.externalSection.partnerKey);

    return firstIndexOf <= secondIndexOf
      ? getLabelByBadgeKey(this.pixSection.partnerKey)
      : getLabelByBadgeKey(this.externalSection.partnerKey);
  }
}

class PixEduSection {
  acquired: $TSFixMe;
  partnerKey: $TSFixMe;
  constructor({
    partnerKey,
    acquired
  }: $TSFixMe) {
    this.partnerKey = partnerKey;
    this.acquired = acquired ?? false;
  }

  get isEvaluated() {
    return Boolean(this.partnerKey);
  }

  _isPixEdu2ndDegre() {
    return pixEdu2ndDegreeBadges.includes(this.partnerKey);
  }

  _isPixEdu1erDegre() {
    return pixEdu1stDegreeBadges.includes(this.partnerKey);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertificationCourseResultsForJuryCertificationWithExternal;
