// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationDetails = require('../read-models/CertificationDetails');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCertificationDetails({
  certificationCourseId,
  competenceMarkRepository,
  certificationAssessmentRepository,
  placementProfileService,
  scoringCertificationService
}: $TSFixMe) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
    certificationCourseId,
  });

  const competenceMarks = await competenceMarkRepository.findByCertificationCourseId(certificationCourseId);

  if (competenceMarks.length) {
    return _retrievePersistedCertificationDetails(competenceMarks, certificationAssessment, placementProfileService);
  } else {
    return _computeCertificationDetailsOnTheFly(
      certificationAssessment,
      placementProfileService,
      scoringCertificationService
    );
  }
};

async function _computeCertificationDetailsOnTheFly(
  certificationAssessment: $TSFixMe,
  placementProfileService: $TSFixMe,
  scoringCertificationService: $TSFixMe
) {
  const certificationAssessmentScore = await scoringCertificationService.calculateCertificationAssessmentScore({
    certificationAssessment,
    continueOnError: true,
  });
  const placementProfile = await placementProfileService.getPlacementProfile({
    userId: certificationAssessment.userId,
    limitDate: certificationAssessment.createdAt,
    isV2Certification: certificationAssessment.isV2Certification,
  });

  return CertificationDetails.fromCertificationAssessmentScore({
    certificationAssessmentScore,
    certificationAssessment,
    placementProfile,
  });
}

async function _retrievePersistedCertificationDetails(
  competenceMarks: $TSFixMe,
  certificationAssessment: $TSFixMe,
  placementProfileService: $TSFixMe
) {
  const placementProfile = await placementProfileService.getPlacementProfile({
    userId: certificationAssessment.userId,
    limitDate: certificationAssessment.createdAt,
    isV2Certification: certificationAssessment.isV2Certification,
  });

  return CertificationDetails.from({
    competenceMarks,
    certificationAssessment,
    placementProfile,
  });
}
