const { expect, sinon, domainBuilder, hFake } = require('../../../test-helper');
const AssessmentSupervisorAuthorization = require('../../../../lib/application/preHandlers/assessment-supervisor-authorization');
const tokenService = require('../../../../lib/domain/services/token-service');
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
const certificationCourseRepository = require('../../../../lib/infrastructure/repositories/certification-course-repository');
const supervisorAccessRepository = require('../../../../lib/infrastructure/repositories/supervisor-access-repository');

describe('Unit | Pre-handler | Assessment Supervisor Authorization', function () {
  describe('#verify', function () {
    const request = {
      headers: { authorization: 'VALID_TOKEN' },
      params: {
        id: 8,
      },
    };

    beforeEach(function () {
      sinon.stub(tokenService, 'extractTokenFromAuthChain');
      sinon.stub(tokenService, 'extractUserId');
      sinon.stub(assessmentRepository, 'get');
      sinon.stub(certificationCourseRepository, 'get');
      sinon.stub(supervisorAccessRepository, 'isUserSupervisorForSession');
    });

    it('should get userId from token', function () {
      // given
      const certificationCourse = domainBuilder.buildCertificationCourse({ sessionId: 5467 });
      const assessement = domainBuilder.buildAssessment({ courseId: certificationCourse.id });
      tokenService.extractTokenFromAuthChain.returns('VALID_TOKEN');
      tokenService.extractUserId.returns('userId');
      assessmentRepository.get.resolves(assessement);
      certificationCourseRepository.get.resolves(certificationCourse);
      supervisorAccessRepository.isUserSupervisorForSession.resolves(true);

      // when
      const promise = AssessmentSupervisorAuthorization.verify(request, hFake);

      // then
      return promise.then(() => {
        sinon.assert.calledOnce(tokenService.extractUserId);
        sinon.assert.calledWith(tokenService.extractUserId, request.headers.authorization);
      });
    });

    describe('When user is the supervisor of the assessment session', function () {
      it('should return true', async function () {
        // given
        const extractedUserId = 'userId';
        tokenService.extractUserId.returns(extractedUserId);
        const certificationCourse = domainBuilder.buildCertificationCourse({ sessionId: 5467 });
        const assessement = domainBuilder.buildAssessment({ courseId: certificationCourse.id });
        tokenService.extractTokenFromAuthChain.returns('VALID_TOKEN');
        tokenService.extractUserId.returns('userId');
        assessmentRepository.get.resolves(assessement);
        certificationCourseRepository.get.resolves(certificationCourse);
        supervisorAccessRepository.isUserSupervisorForSession.resolves(true);

        // when
        const response = await AssessmentSupervisorAuthorization.verify(request, hFake);

        // then
        sinon.assert.calledOnce(assessmentRepository.get);
        sinon.assert.calledWith(supervisorAccessRepository.isUserSupervisorForSession, {
          sessionId: certificationCourse.getSessionId(),
          userId: extractedUserId,
        });
        expect(response).to.be.true;
      });
    });
  });
});
