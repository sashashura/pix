// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('./CompetenceMark');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('./ComplementaryCertificationCourseResult');
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

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'status'.
const status = {
  REJECTED: 'rejected',
  VALIDATED: 'validated',
  ERROR: 'error',
  CANCELLED: 'cancelled',
  STARTED: 'started',
};

const emitters = {
  PIX_ALGO: 'PIX-ALGO',
  PIX_ALGO_AUTO_JURY: 'PIX-ALGO-AUTO-JURY',
  PIX_ALGO_NEUTRALIZATION: 'PIX-ALGO-NEUTRALIZATION',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationResult {
  static status = status;

  static emitters = emitters;

  birthdate: $TSFixMe;
  birthplace: $TSFixMe;
  commentForOrganization: $TSFixMe;
  competencesWithMark: $TSFixMe;
  complementaryCertificationCourseResults: $TSFixMe;
  createdAt: $TSFixMe;
  emitter: $TSFixMe;
  externalId: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  pixScore: $TSFixMe;
  sessionId: $TSFixMe;

  constructor({
    id,
    firstName,
    lastName,
    birthplace,
    birthdate,
    externalId,
    createdAt,
    sessionId,
    status,
    pixScore,
    emitter,
    commentForOrganization,
    competencesWithMark,
    complementaryCertificationCourseResults
  }: $TSFixMe) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthplace = birthplace;
    this.birthdate = birthdate;
    this.externalId = externalId;
    this.createdAt = createdAt;
    this.sessionId = sessionId;
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Certific... Remove this comment to see the full error message
    this.status = status;
    this.pixScore = pixScore;
    this.emitter = emitter;
    this.commentForOrganization = commentForOrganization;
    this.competencesWithMark = competencesWithMark;
    this.complementaryCertificationCourseResults = complementaryCertificationCourseResults;
  }

  static from({
    certificationResultDTO
  }: $TSFixMe) {
    let certificationStatus;
    if (certificationResultDTO.isCancelled) {
      certificationStatus = status.CANCELLED;
    } else {
      certificationStatus = certificationResultDTO?.assessmentResultStatus ?? (status as $TSFixMe).STARTED;
    }
    const competenceMarkDTOs = _.compact(certificationResultDTO.competenceMarks);
    const competencesWithMark = _.map(
      competenceMarkDTOs,
      (competenceMarkDTO: $TSFixMe) => new CompetenceMark({
        ...competenceMarkDTO,
        area_code: competenceMarkDTO.area_code.toString(),
        competence_code: competenceMarkDTO.competence_code.toString(),
      })
    );
    const complementaryCertificationCourseResults = _.compact(
      certificationResultDTO.complementaryCertificationCourseResults
    ).map(
      (complementaryCertifCourseResult: $TSFixMe) => new ComplementaryCertificationCourseResult(complementaryCertifCourseResult)
    );

    return new CertificationResult({
      id: certificationResultDTO.id,
      firstName: certificationResultDTO.firstName,
      lastName: certificationResultDTO.lastName,
      birthplace: certificationResultDTO.birthplace,
      birthdate: certificationResultDTO.birthdate,
      externalId: certificationResultDTO.externalId,
      createdAt: certificationResultDTO.createdAt,
      sessionId: certificationResultDTO.sessionId,
      status: certificationStatus,
      pixScore: certificationResultDTO.pixScore,
      emitter: certificationResultDTO.emitter,
      commentForOrganization: certificationResultDTO.commentForOrganization,
      competencesWithMark,
      complementaryCertificationCourseResults,
    });
  }

  isCancelled() {
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Certific... Remove this comment to see the full error message
    return this.status === status.CANCELLED;
  }

  isValidated() {
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Certific... Remove this comment to see the full error message
    return this.status === status.VALIDATED;
  }

  isRejected() {
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Certific... Remove this comment to see the full error message
    return this.status === status.REJECTED;
  }

  isInError() {
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Certific... Remove this comment to see the full error message
    return this.status === status.ERROR;
  }

  isStarted() {
    // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Certific... Remove this comment to see the full error message
    return this.status === (status as $TSFixMe).STARTED;
  }

  hasBeenRejectedAutomatically() {
    return (
      // @ts-expect-error TS(2576): Property 'status' does not exist on type 'Certific... Remove this comment to see the full error message
      this.status === status.REJECTED &&
      (this.emitter === emitters.PIX_ALGO || this.emitter === emitters.PIX_ALGO_AUTO_JURY)
    );
  }

  hasTakenClea() {
    const result = this._getCertificationCourseResultByPartnerKeys([
      PIX_EMPLOI_CLEA_V1,
      PIX_EMPLOI_CLEA_V2,
      PIX_EMPLOI_CLEA_V3,
    ]);
    return Boolean(result);
  }

  hasAcquiredClea() {
    const result = this._getCertificationCourseResultByPartnerKeys([
      PIX_EMPLOI_CLEA_V1,
      PIX_EMPLOI_CLEA_V2,
      PIX_EMPLOI_CLEA_V3,
    ]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusDroitMaitre() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_DROIT_MAITRE_CERTIF]);
    return Boolean(result);
  }

  hasAcquiredPixPlusDroitMaitre() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_DROIT_MAITRE_CERTIF]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusDroitExpert() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_DROIT_EXPERT_CERTIF]);
    return Boolean(result);
  }

  hasAcquiredPixPlusDroitExpert() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_DROIT_EXPERT_CERTIF]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu2ndDegreInitie() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu2ndDegreInitie() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu2ndDegreConfirme() {
    const result = this._getCertificationCourseResultByPartnerKeys([
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    ]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu2ndDegreConfirme() {
    const result = this._getCertificationCourseResultByPartnerKeys([
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    ]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu2ndDegreAvance() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu2ndDegreAvance() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu2ndDegreExpert() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu2ndDegreExpert() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu1erDegreInitie() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu1erDegreInitie() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu1erDegreConfirme() {
    const result = this._getCertificationCourseResultByPartnerKeys([
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
    ]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu1erDegreConfirme() {
    const result = this._getCertificationCourseResultByPartnerKeys([
      PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME,
    ]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu1erDegreAvance() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu1erDegreAvance() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE]);
    return Boolean(result?.acquired);
  }

  hasTakenPixPlusEdu1erDegreExpert() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT]);
    return Boolean(result);
  }

  hasAcquiredPixPlusEdu1erDegreExpert() {
    const result = this._getCertificationCourseResultByPartnerKeys([PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT]);
    return Boolean(result?.acquired);
  }

  _getCertificationCourseResultByPartnerKeys(partnerKeys: $TSFixMe) {
    return this.complementaryCertificationCourseResults.find(({
      partnerKey
    }: $TSFixMe) => partnerKeys.includes(partnerKey));
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationResult;
