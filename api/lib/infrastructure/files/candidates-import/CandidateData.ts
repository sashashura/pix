// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRANCE_COU... Remove this comment to see the full error message
const FRANCE_COUNTRY_CODE = '99100';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../../domain/models/CertificationCandidate');
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
} = require('../../../domain/models/ComplementaryCertification');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class CandidateData {
  billingMode: $TSFixMe;
  birthCity: $TSFixMe;
  birthCountry: $TSFixMe;
  birthINSEECode: $TSFixMe;
  birthPostalCode: $TSFixMe;
  birthProvinceCode: $TSFixMe;
  birthdate: $TSFixMe;
  cleaNumerique: $TSFixMe;
  count: $TSFixMe;
  createdAt: $TSFixMe;
  email: $TSFixMe;
  externalId: $TSFixMe;
  extraTimePercentage: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  organizationLearnerId: $TSFixMe;
  pixPlusDroit: $TSFixMe;
  pixPlusEdu1erDegre: $TSFixMe;
  pixPlusEdu2ndDegre: $TSFixMe;
  prepaymentCode: $TSFixMe;
  resultRecipientEmail: $TSFixMe;
  sessionId: $TSFixMe;
  sex: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    id = null,
    firstName = null,
    lastName = null,
    sex = null,
    birthPostalCode = null,
    birthINSEECode = null,
    birthCity = null,
    birthProvinceCode = null,
    birthCountry = null,
    email = null,
    resultRecipientEmail = null,
    externalId = null,
    birthdate = null,
    extraTimePercentage = null,
    createdAt = null,
    sessionId = null,
    userId = null,
    organizationLearnerId = null,
    number = null,
    complementaryCertifications = null,
    billingMode = null,
    prepaymentCode = null,
  }) {
    this.id = this._emptyStringIfNull(id);
    this.firstName = this._emptyStringIfNull(firstName);
    this.lastName = this._emptyStringIfNull(lastName);
    this.sex = this._emptyStringIfNull(sex);
    this.birthPostalCode = this._emptyStringIfNull(birthPostalCode);
    this.birthINSEECode = this._emptyStringIfNull(birthINSEECode);
    this.birthCity = this._emptyStringIfNull(birthCity);
    this.birthProvinceCode = this._emptyStringIfNull(birthProvinceCode);
    this.birthCountry = this._emptyStringIfNull(birthCountry);
    this.email = this._emptyStringIfNull(email);
    this.resultRecipientEmail = this._emptyStringIfNull(resultRecipientEmail);
    this.externalId = this._emptyStringIfNull(externalId);
    this.birthdate = birthdate === null ? '' : moment(birthdate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    if (!_.isFinite(extraTimePercentage) || extraTimePercentage <= 0) {
      this.extraTimePercentage = '';
    } else {
      this.extraTimePercentage = extraTimePercentage;
    }
    this.createdAt = this._emptyStringIfNull(createdAt);
    this.sessionId = this._emptyStringIfNull(sessionId);
    this.userId = this._emptyStringIfNull(userId);
    this.organizationLearnerId = this._emptyStringIfNull(organizationLearnerId);
    this.billingMode = CertificationCandidate.translateBillingMode(billingMode);
    this.prepaymentCode = this._emptyStringIfNull(prepaymentCode);
    this.cleaNumerique = this._displayYesIfCandidateHasComplementaryCertification(complementaryCertifications, CLEA);
    this.pixPlusDroit = this._displayYesIfCandidateHasComplementaryCertification(
      complementaryCertifications,
      PIX_PLUS_DROIT
    );
    this.pixPlusEdu1erDegre = this._displayYesIfCandidateHasComplementaryCertification(
      complementaryCertifications,
      PIX_PLUS_EDU_1ER_DEGRE
    );
    this.pixPlusEdu2ndDegre = this._displayYesIfCandidateHasComplementaryCertification(
      complementaryCertifications,
      PIX_PLUS_EDU_2ND_DEGRE
    );
    this.count = number;
    this._clearBirthInformationDataForExport();
  }

  _emptyStringIfNull(value: $TSFixMe) {
    return value === null ? '' : value;
  }

  _clearBirthInformationDataForExport() {
    if (this.birthCountry.toUpperCase() === 'FRANCE') {
      if (this.birthINSEECode) {
        this.birthPostalCode = '';
        this.birthCity = '';
      }

      return;
    }

    if (this.birthINSEECode && this.birthINSEECode !== FRANCE_COUNTRY_CODE) {
      this.birthINSEECode = '99';
    }
  }

  _displayYesIfCandidateHasComplementaryCertification(complementaryCertifications: $TSFixMe, certificationKey: $TSFixMe) {
    if (!complementaryCertifications) {
      return '';
    }
    const hasComplementaryCertification = complementaryCertifications.some(
      (complementaryCertification: $TSFixMe) => complementaryCertification.key === certificationKey
    );
    return hasComplementaryCertification ? 'oui' : '';
  }

  static fromCertificationCandidateAndCandidateNumber(certificationCandidate: $TSFixMe, number: $TSFixMe) {
    return new CandidateData({ ...certificationCandidate, number });
  }

  static empty(number: $TSFixMe) {
    return new CandidateData({ number });
  }
};
