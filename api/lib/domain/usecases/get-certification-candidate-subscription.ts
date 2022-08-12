// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidateSubscription = require('../read-models/CertificationCandidateSubscription');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function _hasStillValidPixPlusDroit(badgeAcquisitions: $TSFixMe) {
  return badgeAcquisitions.some(
    (badgeAcquisition: $TSFixMe) => badgeAcquisition.badgeKey === Badge.keys.PIX_DROIT_MAITRE_CERTIF ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_DROIT_EXPERT_CERTIF
  );
}

function _hasStillValidClea(badgeAcquisitions: $TSFixMe) {
  return badgeAcquisitions.some(
    (badgeAcquisition: $TSFixMe) => badgeAcquisition.badgeKey === Badge.keys.PIX_EMPLOI_CLEA_V1 ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EMPLOI_CLEA_V2 ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EMPLOI_CLEA_V3
  );
}

function _hasStillValidPixPlusEdu1erDegre(badgeAcquisitions: $TSFixMe) {
  return badgeAcquisitions.some(
    (badgeAcquisition: $TSFixMe) => badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_CONFIRME ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_AVANCE ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_CONFIRME ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT
  );
}

function _hasStillValidPixPlusEdu2ndDegre(badgeAcquisitions: $TSFixMe) {
  return badgeAcquisitions.some(
    (badgeAcquisition: $TSFixMe) => badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME ||
    badgeAcquisition.badgeKey === Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT
  );
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCertificationCandidateSubscription({
  certificationCandidateId,
  certificationBadgesService,
  certificationCandidateRepository
}: $TSFixMe) {
  const certificationCandidate = await certificationCandidateRepository.getWithComplementaryCertifications(
    certificationCandidateId
  );

  if (_.isEmpty(certificationCandidate.complementaryCertifications)) {
    return new CertificationCandidateSubscription({
      id: certificationCandidateId,
      sessionId: certificationCandidate.sessionId,
      eligibleSubscriptions: [],
      nonEligibleSubscriptions: [],
    });
  }

  const eligibleSubscriptions = [];
  const nonEligibleSubscriptions = [];
  if (certificationCandidate.complementaryCertifications.length) {
    const stillValidCertifiableBadgeAcquisitions = await certificationBadgesService.findStillValidBadgeAcquisitions({
      userId: certificationCandidate.userId,
    });

    for (const complementaryCertification of certificationCandidate.complementaryCertifications) {
      if (complementaryCertification.isPixPlusDroit()) {
        if (_hasStillValidPixPlusDroit(stillValidCertifiableBadgeAcquisitions)) {
          eligibleSubscriptions.push(complementaryCertification);
        } else {
          nonEligibleSubscriptions.push(complementaryCertification);
        }
      }
      if (complementaryCertification.isClea()) {
        if (_hasStillValidClea(stillValidCertifiableBadgeAcquisitions)) {
          eligibleSubscriptions.push(complementaryCertification);
        } else {
          nonEligibleSubscriptions.push(complementaryCertification);
        }
      }
      if (complementaryCertification.isPixPlusEdu1erDegre()) {
        if (_hasStillValidPixPlusEdu1erDegre(stillValidCertifiableBadgeAcquisitions)) {
          eligibleSubscriptions.push(complementaryCertification);
        } else {
          nonEligibleSubscriptions.push(complementaryCertification);
        }
      }
      if (complementaryCertification.isPixPlusEdu2ndDegre()) {
        if (_hasStillValidPixPlusEdu2ndDegre(stillValidCertifiableBadgeAcquisitions)) {
          eligibleSubscriptions.push(complementaryCertification);
        } else {
          nonEligibleSubscriptions.push(complementaryCertification);
        }
      }
    }
  }

  return new CertificationCandidateSubscription({
    id: certificationCandidateId,
    sessionId: certificationCandidate.sessionId,
    eligibleSubscriptions,
    nonEligibleSubscriptions,
  });
};
