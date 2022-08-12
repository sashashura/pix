// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecase'.
const usecase = require('../../../../lib/application/usecases/checkUserIsMemberOfCertificationCenterSession');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../../../lib/infrastructure/repositories/certification-course-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sessionRep... Remove this comment to see the full error message
const sessionRepository = require('../../../../lib/infrastructure/repositories/sessions/session-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Use Case | CheckUserIsMemberOfCertificationCenterSession', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(certificationCourseRepository, 'get');
    sinon.stub(sessionRepository, 'doesUserHaveCertificationCenterMembershipForSession');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user is member of certification center session', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true', async function () {
      // given
      const userId = 7;
      const certificationCourseId = 1;
      const sessionId = 2;
      const certificationCourse = {
        getSessionId: () => sessionId,
      };

      certificationCourseRepository.get.withArgs(certificationCourseId).resolves(certificationCourse);
      sessionRepository.doesUserHaveCertificationCenterMembershipForSession.withArgs(userId, sessionId).resolves(true);

      // when
      const response = await usecase.execute({ userId, certificationCourseId });

      // then
      expect(response).to.equal(true);
    });
  });
});
