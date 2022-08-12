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
} = require('./Badge').keys;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sources'.
const sources = {
  EXTERNAL: 'EXTERNAL',
  PIX: 'PIX',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertificationCourseResult {
  static sources = sources;

  acquired: $TSFixMe;
  complementaryCertificationCourseId: $TSFixMe;
  partnerKey: $TSFixMe;
  source: $TSFixMe;

  constructor({
    complementaryCertificationCourseId,
    partnerKey,
    source,
    acquired
  }: $TSFixMe = {}) {
    this.complementaryCertificationCourseId = complementaryCertificationCourseId;
    this.partnerKey = partnerKey;
    this.acquired = acquired;
    this.source = source;
  }

  static from({
    complementaryCertificationCourseId,
    partnerKey,
    acquired,
    source
  }: $TSFixMe) {
    return new ComplementaryCertificationCourseResult({
      complementaryCertificationCourseId,
      partnerKey,
      acquired,
      source,
    });
  }

  static buildFromJuryLevel({
    complementaryCertificationCourseId,
    juryLevel,
    pixPartnerKey
  }: $TSFixMe) {
    if (juryLevel === 'REJECTED') {
      return new ComplementaryCertificationCourseResult({
        complementaryCertificationCourseId,
        partnerKey: pixPartnerKey,
        acquired: false,
        source: sources.EXTERNAL,
      });
    }

    return new ComplementaryCertificationCourseResult({
      complementaryCertificationCourseId,
      partnerKey: juryLevel,
      acquired: true,
      source: sources.EXTERNAL,
    });
  }

  isFromPixSource() {
    return this.source === sources.PIX;
  }

  isFromExternalSource() {
    return this.source === sources.EXTERNAL;
  }

  isAcquired() {
    return this.acquired;
  }

  isPixEdu() {
    return this.isPixEdu1erDegre() || this.isPixEdu2ndDegre();
  }

  isPixEdu1erDegre() {
    return [
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT,
    ].includes(this.partnerKey);
  }

  isPixEdu2ndDegre() {
    return [
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
    ].includes(this.partnerKey);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertificationCourseResult;
