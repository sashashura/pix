// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sortBy'.
const sortBy = require('lodash/sortBy');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getImagePa... Remove this comment to see the full error message
const getImagePathByBadgeKey = require('./get-image-path-by-badge-key');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toArrayOfF... Remove this comment to see the full error message
const { toArrayOfFixedLengthStringsConservingWords } = require('../string-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CertifiedB... Remove this comment to see the full error message
const CertifiedBadgeImage = require('../../../domain/read-models/CertifiedBadgeImage');

const PROFESSIONALIZING_VALIDITY_START_DATE = new Date('2022-01-01');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Attestatio... Remove this comment to see the full error message
class AttestationViewModel {
  _deliveredAt: $TSFixMe;
  _hasAcquiredAnyComplementaryCertifications: $TSFixMe;
  _hasAcquiredCleaCertification: $TSFixMe;
  _hasAcquiredPixPlusDroitCertification: $TSFixMe;
  _hasAcquiredPixPlusEduCertification: $TSFixMe;
  _isFrenchDomainExtension: $TSFixMe;
  _maxReachableLevelOnCertificationDate: $TSFixMe;
  absoluteMaxLevelIndication: $TSFixMe;
  birth: $TSFixMe;
  birthplace: $TSFixMe;
  certificationCenter: $TSFixMe;
  cleaCertificationImagePath: $TSFixMe;
  competenceDetailViewModels: $TSFixMe;
  fullName: $TSFixMe;
  maxLevel: $TSFixMe;
  maxReachableLevelIndication: $TSFixMe;
  maxReachableScore: $TSFixMe;
  pixPlusDroitCertificationImagePath: $TSFixMe;
  pixPlusEduBadgeMessage: $TSFixMe;
  pixPlusEduCertificationImagePath: $TSFixMe;
  pixScore: $TSFixMe;
  verificationCode: $TSFixMe;
  constructor({
    pixScore,
    maxReachableScore,
    maxLevel,
    absoluteMaxLevelIndication,
    maxReachableLevelIndication,
    fullName,
    birthplace,
    birth,
    certificationCenter,
    deliveredAt,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    hasAcquiredAnyComplementaryCertifications,
    cleaCertificationImagePath,
    hasAcquiredPixPlusDroitCertification,
    hasAcquiredCleaCertification,
    pixPlusDroitCertificationImagePath,
    hasAcquiredPixPlusEduCertification,
    pixPlusEduCertificationImagePath,
    pixPlusEduBadgeMessage,
    competenceDetailViewModels,
    isFrenchDomainExtension
  }: $TSFixMe) {
    this.pixScore = pixScore;
    this.maxReachableScore = maxReachableScore;
    this.maxLevel = maxLevel;
    this.absoluteMaxLevelIndication = absoluteMaxLevelIndication;
    this.maxReachableLevelIndication = maxReachableLevelIndication;
    this.fullName = fullName;
    this.birthplace = birthplace;
    this.birth = birth;
    this.certificationCenter = certificationCenter;
    this._deliveredAt = deliveredAt;
    this.cleaCertificationImagePath = cleaCertificationImagePath;
    this.pixPlusDroitCertificationImagePath = pixPlusDroitCertificationImagePath;
    this.pixPlusEduCertificationImagePath = pixPlusEduCertificationImagePath;
    this.pixPlusEduBadgeMessage = pixPlusEduBadgeMessage;
    this.competenceDetailViewModels = competenceDetailViewModels;
    this.verificationCode = verificationCode;
    this._maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
    this._hasAcquiredAnyComplementaryCertifications = hasAcquiredAnyComplementaryCertifications;
    this._hasAcquiredPixPlusDroitCertification = hasAcquiredPixPlusDroitCertification;
    this._hasAcquiredCleaCertification = hasAcquiredCleaCertification;
    this._hasAcquiredPixPlusEduCertification = hasAcquiredPixPlusEduCertification;
    this._isFrenchDomainExtension = isFrenchDomainExtension;
  }

  get certificationDate() {
    return _formatDate(this._deliveredAt);
  }

  shouldDisplayComplementaryCertifications() {
    return this._hasAcquiredAnyComplementaryCertifications;
  }

  shouldDisplayAbsoluteMaxLevelIndication() {
    return this._maxReachableLevelOnCertificationDate < 8;
  }

  shouldDisplayCleaCertification() {
    return Boolean(this._hasAcquiredCleaCertification);
  }

  shouldDisplayPixPlusDroitCertification() {
    return Boolean(this._hasAcquiredPixPlusDroitCertification);
  }

  shouldDisplayPixPlusEduCertification() {
    return Boolean(this._hasAcquiredPixPlusEduCertification);
  }

  shouldDisplayProfessionalizingCertificationMessage() {
    if (!this._isFrenchDomainExtension) return false;
    if (!this._deliveredAt) return false;
    return this._deliveredAt.getTime() >= PROFESSIONALIZING_VALIDITY_START_DATE.getTime();
  }

  static from(certificate: $TSFixMe, isFrenchDomainExtension: $TSFixMe) {
    const pixScore = certificate.pixScore.toString();
    const maxReachableScore = certificate.maxReachableScore.toString() + '*';

    const maxLevel = `(niveaux sur ${certificate.maxReachableLevelOnCertificationDate})`;
    const maxReachableLevelIndication = `* À la date d’obtention de cette certification, le nombre maximum de pix atteignable était de ${certificate.maxReachableScore}, correspondant au niveau ${certificate.maxReachableLevelOnCertificationDate}.`;
    const absoluteMaxLevelIndication =
      'Lorsque les 8 niveaux du référentiel Pix seront disponibles, ce nombre maximum sera de 1024 pix.';

    const verificationCode = certificate.verificationCode;

    const fullName = `${certificate.firstName} ${certificate.lastName}`;
    const birthplace = certificate.birthplace ? ` à ${certificate.birthplace}` : '';
    const birth = _formatDate(certificate.birthdate) + birthplace;
    const certificationCenter = certificate.certificationCenter;
    const deliveredAt = certificate.deliveredAt;

    const maxReachableLevelOnCertificationDate = certificate.maxReachableLevelOnCertificationDate < 8;
    const hasAcquiredAnyComplementaryCertifications = certificate.hasAcquiredAnyComplementaryCertifications();

    let hasAcquiredCleaCertification = false;
    let cleaCertificationImagePath;
    if (certificate.getAcquiredCleaCertification()) {
      hasAcquiredCleaCertification = true;
      cleaCertificationImagePath = getImagePathByBadgeKey(certificate.getAcquiredCleaCertification());
    }

    let hasAcquiredPixPlusDroitCertification = false;
    let pixPlusDroitCertificationImagePath;
    if (certificate.getAcquiredPixPlusDroitCertification()) {
      hasAcquiredPixPlusDroitCertification = true;
      pixPlusDroitCertificationImagePath = getImagePathByBadgeKey(certificate.getAcquiredPixPlusDroitCertification());
    }

    let hasAcquiredPixPlusEduCertification = false;
    let pixPlusEduCertificationImagePath;
    let pixPlusEduBadgeMessage;
    if (certificate.getAcquiredPixPlusEduCertification()) {
      hasAcquiredPixPlusEduCertification = true;
      const { partnerKey, isTemporaryBadge } = certificate.getAcquiredPixPlusEduCertification();
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
      const certifiedBadgeImage = CertifiedBadgeImage.fromPartnerKey(partnerKey, isTemporaryBadge);
      pixPlusEduCertificationImagePath = getImagePathByBadgeKey(partnerKey);
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      pixPlusEduBadgeMessage = toArrayOfFixedLengthStringsConservingWords(certifiedBadgeImage.message, 45);
    }

    const sortedCompetenceTree = sortBy(certificate.resultCompetenceTree.areas, 'code');
    const competenceDetailViewModels = sortedCompetenceTree.flatMap((area: $TSFixMe) => {
      return area.resultCompetences.map((competence: $TSFixMe) => {
        return CompetenceDetailViewModel.from(competence);
      });
    });

    return new AttestationViewModel({
      pixScore,
      maxReachableScore,
      maxLevel,
      verificationCode,
      maxReachableLevelIndication,
      absoluteMaxLevelIndication,
      fullName,
      birthplace,
      birth,
      certificationCenter,
      deliveredAt,
      maxReachableLevelOnCertificationDate,
      hasAcquiredAnyComplementaryCertifications,
      cleaCertificationImagePath,
      pixPlusDroitCertificationImagePath,
      pixPlusEduCertificationImagePath,
      pixPlusEduBadgeMessage,
      hasAcquiredPixPlusDroitCertification,
      hasAcquiredCleaCertification,
      hasAcquiredPixPlusEduCertification,
      competenceDetailViewModels,
      isFrenchDomainExtension,
    });
  }
}

class CompetenceDetailViewModel {
  _levelValue: $TSFixMe;
  level: $TSFixMe;
  constructor({
    level,
    levelValue
  }: $TSFixMe) {
    this.level = level;
    this._levelValue = levelValue;
  }

  shouldBeDisplayed() {
    return this._levelValue > 0;
  }

  static from(competence: $TSFixMe) {
    return new CompetenceDetailViewModel({
      level: competence.level.toString(),
      levelValue: competence.level,
    });
  }
}

function _formatDate(date: $TSFixMe) {
  return moment(date).locale('fr').format('LL');
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AttestationViewModel;
