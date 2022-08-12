// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function endAssessmentBySupervisor({
  certificationCandidateId,
  assessmentRepository
}: $TSFixMe) {
  const assessment = await assessmentRepository.getByCertificationCandidateId(certificationCandidateId);

  if (assessment.isCompleted()) {
    return;
  }

  await assessmentRepository.endBySupervisorByAssessmentId(assessment.id);
};
