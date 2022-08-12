// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const deleteSessionJuryComment = require('../../../../lib/domain/usecases/delete-session-jury-comment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | delete-session-jury-comment', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should delete the session jury comment', async function () {
    // given
    const sessionJuryCommentRepository = { delete: sinon.stub() };

    // when
    await deleteSessionJuryComment({
      sessionId: 123,
      sessionJuryCommentRepository,
    });

    // then
    expect(sessionJuryCommentRepository.delete).to.have.been.calledWithExactly(123);
  });
});
