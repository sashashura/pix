const _ = require('lodash');
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
const endBySupervisorAssessment = require('../../../../lib/domain/usecases/end-by-supervisor-assessment');
const Assessment = require('../../../../lib/domain/models/Assessment');
const { AlreadyRatedAssessmentError } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | end-by-supervisor-assessment', function () {
  let assessmentRepository;
  let domainTransaction;

  beforeEach(function () {
    domainTransaction = Symbol('domainTransaction');
    assessmentRepository = {
      get: _.noop,
      endBySupervisorByAssessmentId: _.noop,
    };
  });

  context('when assessment is already completed', function () {
    it('should return an AlreadyRatedAssessmentError', async function () {
      // given
      const completedAssessment = _buildCertificationAssessment({ state: 'completed' });
      sinon
        .stub(assessmentRepository, 'get')
        .withArgs(completedAssessment.id, domainTransaction)
        .resolves(completedAssessment);

      // when
      const err = await catchErr(endBySupervisorAssessment)({
        assessmentId: completedAssessment.id,
        domainTransaction,
        assessmentRepository,
      });

      // then
      expect(err).to.be.an.instanceof(AlreadyRatedAssessmentError);
    });
  });

  context('when assessment is not yet completed', function () {
    context(`common behavior when assessment is a certification`, function () {
      it('should end the assessment', async function () {
        // when
        const assessment = _buildCertificationAssessment({ state: 'started' });
        sinon.stub(assessmentRepository, 'get').withArgs(assessment.id, domainTransaction).resolves(assessment);
        sinon.stub(assessmentRepository, 'endBySupervisorByAssessmentId').resolves();

        await endBySupervisorAssessment({
          assessmentId: assessment.id,
          domainTransaction,
          assessmentRepository,
        });

        // then
        expect(
          assessmentRepository.endBySupervisorByAssessmentId.calledWithExactly(assessment.id, domainTransaction)
        ).to.be.true;
      });
    });
  });
});

function _buildCertificationAssessment({ state }) {
  return domainBuilder.buildAssessment({
    id: Symbol('assessmentId'),
    certificationCourseId: Symbol('certificationCourseId'),
    state,
    type: Assessment.types.CERTIFICATION,
  });
}
