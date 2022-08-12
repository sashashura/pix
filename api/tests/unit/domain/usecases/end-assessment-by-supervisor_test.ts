// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const endAssessmentBySupervisor = require('../../../../lib/domain/usecases/end-assessment-by-supervisor');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | end-assessment-by-supervisor', function () {
  let assessmentRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    assessmentRepository = {
      getByCertificationCandidateId: _.noop,
      endBySupervisorByAssessmentId: _.noop,
    };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when assessment is already completed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not end the assessment', async function () {
      // when
      const completedAssessment = domainBuilder.buildAssessment.ofTypeCertification({ state: 'completed' });
      const certificationCandidateId = domainBuilder.buildCertificationCandidate().id;
      sinon.stub(assessmentRepository, 'endBySupervisorByAssessmentId').resolves();
      sinon
        .stub(assessmentRepository, 'getByCertificationCandidateId')
        .withArgs(certificationCandidateId)
        .resolves(completedAssessment);

      await endAssessmentBySupervisor({
        certificationCandidateId,
        assessmentRepository,
      });

      // then
      expect(assessmentRepository.endBySupervisorByAssessmentId).not.to.have.been.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when assessment is not completed', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should end the assessment', async function () {
      // when
      const assessment = domainBuilder.buildAssessment.ofTypeCertification({ state: 'started', userId: 123 });
      const certificationCandidateId = domainBuilder.buildCertificationCandidate({ userId: 123 }).id;
      sinon.stub(assessmentRepository, 'endBySupervisorByAssessmentId').resolves();
      sinon
        .stub(assessmentRepository, 'getByCertificationCandidateId')
        .withArgs(certificationCandidateId)
        .resolves(assessment);

      await endAssessmentBySupervisor({
        certificationCandidateId,
        assessmentRepository,
      });

      // then
      expect(assessmentRepository.endBySupervisorByAssessmentId).to.have.been.calledWithExactly(assessment.id);
    });
  });
});
