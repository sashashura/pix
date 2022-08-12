// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const deleteSession = require('../../../../lib/domain/usecases/delete-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionSta... Remove this comment to see the full error message
const { SessionStartedDeletionError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | delete-session', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are no certification courses', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the session', async function () {
      // given
      const sessionRepository = { delete: sinon.stub() };
      const certificationCourseRepository = { findCertificationCoursesBySessionId: sinon.stub() };
      certificationCourseRepository.findCertificationCoursesBySessionId.resolves([]);

      // when
      await deleteSession({
        sessionId: 123,
        sessionRepository,
        certificationCourseRepository,
      });

      // then
      expect(sessionRepository.delete).to.have.been.calledWithExactly(123);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there are certification courses', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw SessionStartedDeletionError error', async function () {
      // given
      const sessionRepository = { delete: sinon.stub() };
      const certificationCourseRepository = { findCertificationCoursesBySessionId: sinon.stub() };
      certificationCourseRepository.findCertificationCoursesBySessionId.resolves([
        domainBuilder.buildCertificationCourse({ sessionId: 123 }),
      ]);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(deleteSession)({
        sessionId: 123,
        sessionRepository,
        certificationCourseRepository,
      });

      // then
      expect(error).to.be.instanceOf(SessionStartedDeletionError);
      expect(sessionRepository.delete).to.not.have.been.called;
    });
  });
});
