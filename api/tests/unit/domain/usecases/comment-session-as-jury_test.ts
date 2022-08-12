// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const commentSessionAsJury = require('../../../../lib/domain/usecases/comment-session-as-jury');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | comment-session-as-jury', function () {
  const sessionJuryCommentRepository = { get: null, save: null };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sessionJuryCommentRepository.get = sinon.stub();
    sessionJuryCommentRepository.save = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update the session jury comment', async function () {
    // given
    const sessionJuryComment = domainBuilder.buildSessionJuryComment({ juryCommentAuthorId: 789 });
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    sessionJuryCommentRepository.get.withArgs(123).resolves(sessionJuryComment);
    const updateSpy = sinon.spy(sessionJuryComment, 'update');

    // when
    await commentSessionAsJury({
      sessionId: 123,
      juryComment: 'a jury comment',
      juryCommentAuthorId: 456,
      sessionJuryCommentRepository,
    });

    // then
    expect(updateSpy).to.have.been.calledWithExactly({
      comment: 'a jury comment',
      authorId: 456,
    });
    expect(sessionJuryCommentRepository.save).to.have.been.calledWithExactly(sessionJuryComment);
  });
});
