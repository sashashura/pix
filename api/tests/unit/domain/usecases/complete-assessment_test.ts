// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const completeAssessment = require('../../../../lib/domain/usecases/complete-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyRat... Remove this comment to see the full error message
const { AlreadyRatedAssessmentError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | complete-assessment', function () {
  let assessmentRepository: $TSFixMe;
  let campaignParticipationRepository: $TSFixMe;
  let domainTransaction: $TSFixMe;
  const now = new Date('2019-01-01T05:06:07Z');
  let clock: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    domainTransaction = Symbol('domainTransaction');
    assessmentRepository = {
      get: _.noop,
      completeByAssessmentId: _.noop,
    };

    campaignParticipationRepository = {
      get: _.noop,
      update: _.noop,
    };

    clock = sinon.useFakeTimers(now);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    clock.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when assessment is already completed', function () {
    const assessmentId = 'assessmentId';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const completedAssessment = domainBuilder.buildAssessment({
        id: assessmentId,
        state: 'completed',
      });
      sinon.stub(assessmentRepository, 'get').withArgs(assessmentId, domainTransaction).resolves(completedAssessment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an AlreadyRatedAssessmentError', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(completeAssessment)({
        assessmentId,
        domainTransaction,
        assessmentRepository,
        campaignParticipationRepository,
      });

      // then
      expect(err).to.be.an.instanceof(AlreadyRatedAssessmentError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when assessment is not yet completed', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      // eslint-disable-next-line mocha/no-setup-in-describe
      _buildCompetenceEvaluationAssessment(),
      // eslint-disable-next-line mocha/no-setup-in-describe
      _buildCampaignAssessment(),
      // eslint-disable-next-line mocha/no-setup-in-describe
      _buildCertificationAssessment(),
    ].forEach((assessment) => {
      // TODO: Fix this the next time the file is edited.
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      // eslint-disable-next-line mocha/no-setup-in-describe
      context(`common behavior when assessment is of type ${assessment.type}`, function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(function () {
          sinon.stub(assessmentRepository, 'get').withArgs(assessment.id, domainTransaction).resolves(assessment);
          sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should complete the assessment', async function () {
          // when
          await completeAssessment({
            assessmentId: assessment.id,
            domainTransaction,
            assessmentRepository,
            campaignParticipationRepository,
          });

          // then
          expect(
            assessmentRepository.completeByAssessmentId.calledWithExactly(assessment.id, domainTransaction)
          ).to.be.true;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a AssessmentCompleted event', async function () {
          // when
          const result = await completeAssessment({
            assessmentId: assessment.id,
            domainTransaction,
            assessmentRepository,
            campaignParticipationRepository,
          });

          // then
          expect(result).to.be.an.instanceof(AssessmentCompleted);
          expect(result.userId).to.equal(assessment.userId);
          expect(result.assessmentId).to.equal(assessment.id);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is of type CAMPAIGN', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a AssessmentCompleted event with a userId and targetProfileId', async function () {
        const assessment = _buildCampaignAssessment();

        sinon.stub(assessmentRepository, 'get').withArgs(assessment.id, domainTransaction).resolves(assessment);
        sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
        sinon.stub(campaignParticipationRepository, 'get').resolves({ id: 1 });
        sinon.stub(campaignParticipationRepository, 'update').resolves();
        // when
        const result = await completeAssessment({
          assessmentId: assessment.id,
          domainTransaction,
          assessmentRepository,
          campaignParticipationRepository,
        });

        // then
        expect(result.campaignParticipationId).to.equal(assessment.campaignParticipationId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call update campaign participation status', async function () {
        const assessment = _buildCampaignAssessment();
        const { TO_SHARE } = CampaignParticipationStatuses;

        sinon.stub(assessmentRepository, 'get').withArgs(assessment.id, domainTransaction).resolves(assessment);
        sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
        sinon.stub(campaignParticipationRepository, 'update').resolves();
        // when
        await completeAssessment({
          assessmentId: assessment.id,
          domainTransaction,
          assessmentRepository,
          campaignParticipationRepository,
        });

        // then
        expect(
          campaignParticipationRepository.update.calledWithExactly(
            { id: assessment.campaignParticipationId, status: TO_SHARE },
            domainTransaction
          )
        ).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is of type CERTIFICATION', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a AssessmentCompleted event with certification flag', async function () {
        const assessment = _buildCertificationAssessment();

        sinon.stub(assessmentRepository, 'get').withArgs(assessment.id, domainTransaction).resolves(assessment);
        sinon.stub(assessmentRepository, 'completeByAssessmentId').resolves();
        sinon.stub(campaignParticipationRepository, 'update').resolves();
        // when
        const result = await completeAssessment({
          assessmentId: assessment.id,
          domainTransaction,
          assessmentRepository,
          campaignParticipationRepository,
        });

        // then
        expect(campaignParticipationRepository.update).to.not.have.been.called;
        expect(result.isCertificationType).to.equal(true);
      });
    });
  });
});

function _buildCompetenceEvaluationAssessment() {
  return domainBuilder.buildAssessment.ofTypeCompetenceEvaluation({
    id: Symbol('assessmentId'),
    state: 'started',
  });
}

function _buildCampaignAssessment() {
  return domainBuilder.buildAssessment.ofTypeCampaign({
    id: Symbol('assessmentId'),
    state: 'started',
    type: Assessment.types.CAMPAIGN,
    userId: Symbol('userId'),
    campaignParticipationId: Symbol('campaignParticipationId'),
  });
}

function _buildCertificationAssessment() {
  return domainBuilder.buildAssessment({
    id: Symbol('assessmentId'),
    certificationCourseId: Symbol('certificationCourseId'),
    state: 'started',
    type: Assessment.types.CERTIFICATION,
  });
}
