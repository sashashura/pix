const { AlreadyRatedAssessmentError } = require('../errors');

module.exports = async function endBySupervisorAssessment({ assessmentId, domainTransaction, assessmentRepository }) {
  const assessment = await assessmentRepository.get(assessmentId, domainTransaction);

  if (assessment.isCompleted()) {
    throw new AlreadyRatedAssessmentError();
  }

  await assessmentRepository.endBySupervisorByAssessmentId(assessmentId, domainTransaction);
};
