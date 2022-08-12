// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function commentSessionAsJury({
  sessionId,
  juryComment,
  juryCommentAuthorId,
  sessionJuryCommentRepository
}: $TSFixMe) {
  const sessionJuryComment = await sessionJuryCommentRepository.get(sessionId);

  sessionJuryComment.update({
    comment: juryComment,
    authorId: juryCommentAuthorId,
  });

  await sessionJuryCommentRepository.save(sessionJuryComment);
};
