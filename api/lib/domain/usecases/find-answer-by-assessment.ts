// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError, EntityValidationError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findAnswerByAssessment({
  assessmentId,
  userId,
  answerRepository,
  assessmentRepository
}: $TSFixMe = {}) {
  const integerAssessmentId = parseInt(assessmentId);
  if (!Number.isFinite(integerAssessmentId)) {
    throw new EntityValidationError({
      invalidAttributes: [{ attribute: 'assessmentId', message: 'This assessment ID is not valid.' }],
    });
  }

  const ownedByUser = await assessmentRepository.ownedByUser({ id: assessmentId, userId });
  if (!ownedByUser) {
    throw new UserNotAuthorizedToAccessEntityError('User does not have an access to this assessment.');
  }
  return answerRepository.findByAssessment(integerAssessmentId);
};
