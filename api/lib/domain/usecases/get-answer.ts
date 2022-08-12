// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getAnswer({
  answerId,
  userId,
  answerRepository,
  assessmentRepository
}: $TSFixMe = {}) {
  const integerAnswerId = parseInt(answerId);
  if (!Number.isFinite(integerAnswerId)) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Not found answer for ID ${answerId}`);
  }
  const answer = await answerRepository.get(integerAnswerId);
  const ownedByUser = await assessmentRepository.ownedByUser({ id: answer.assessmentId, userId });
  if (!ownedByUser) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`Not found answer for ID ${integerAnswerId}`);
  }
  return answer;
};
