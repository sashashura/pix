const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V1,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V3,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
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

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_COUNT_... Remove this comment to see the full error message
const PIX_COUNT_BY_LEVEL = 8;
const COMPETENCE_COUNT = 16;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationAttestation {
  birthdate: $TSFixMe;
  birthplace: $TSFixMe;
  certificationCenter: $TSFixMe;
  certifiedBadges: $TSFixMe;
  date: $TSFixMe;
  deliveredAt: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  isPublished: $TSFixMe;
  lastName: $TSFixMe;
  maxReachableLevelOnCertificationDate: $TSFixMe;
  maxReachableScore: $TSFixMe;
  pixScore: $TSFixMe;
  resultCompetenceTree: $TSFixMe;
  userId: $TSFixMe;
  verificationCode: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    birthplace,
    isPublished,
    userId,
    date,
    deliveredAt,
    certificationCenter,
    pixScore,
    certifiedBadges,
    resultCompetenceTree = null,
    verificationCode,
    maxReachableLevelOnCertificationDate
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.birthplace = birthplace;
    this.isPublished = isPublished;
    this.userId = userId;
    this.date = date;
    this.deliveredAt = deliveredAt;
    this.certificationCenter = certificationCenter;
    this.pixScore = pixScore;
    this.certifiedBadges = certifiedBadges;
    this.resultCompetenceTree = resultCompetenceTree;
    this.verificationCode = verificationCode;
    this.maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
    this.maxReachableScore = this.maxReachableLevelOnCertificationDate * PIX_COUNT_BY_LEVEL * COMPETENCE_COUNT;
  }

  setResultCompetenceTree(resultCompetenceTree: $TSFixMe) {
    this.resultCompetenceTree = resultCompetenceTree;
  }

  getAcquiredCleaCertification() {
    return this.certifiedBadges.find(
      ({
        partnerKey
      }: $TSFixMe) =>
        partnerKey === PIX_EMPLOI_CLEA_V1 || partnerKey === PIX_EMPLOI_CLEA_V2 || partnerKey === PIX_EMPLOI_CLEA_V3
    )?.partnerKey;
  }

  getAcquiredPixPlusDroitCertification() {
    return this.certifiedBadges.find(
      ({
        partnerKey
      }: $TSFixMe) => partnerKey === PIX_DROIT_MAITRE_CERTIF || partnerKey === PIX_DROIT_EXPERT_CERTIF
    )?.partnerKey;
  }

  getAcquiredPixPlusEduCertification() {
    return (
      this._findByPartnerKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE) ||
      this._findByPartnerKey(PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT)
    );
  }

  getPixPlusEduBadgeDisplayName() {
    const acquiredPixPlusEduCertification = this.getAcquiredPixPlusEduCertification();
    if (!acquiredPixPlusEduCertification) {
      return null;
    }

    const { partnerKey } = acquiredPixPlusEduCertification;
    if (
      [PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE, PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE].includes(partnerKey)
    ) {
      return 'Initié (entrée dans le métier)';
    }
    if (
      [
        PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
      ].includes(partnerKey)
    ) {
      return 'Confirmé';
    }
    if (
      [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE].includes(partnerKey)
    ) {
      return 'Avancé';
    }
    if (
      [PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT, PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT].includes(partnerKey)
    ) {
      return 'Expert';
    }
  }

  hasAcquiredAnyComplementaryCertifications() {
    return this.certifiedBadges.length > 0;
  }

  _findByPartnerKey(key: $TSFixMe) {
    return this.certifiedBadges.find(({
      partnerKey
    }: $TSFixMe) => partnerKey === key);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationAttestation;
