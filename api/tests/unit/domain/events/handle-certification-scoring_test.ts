// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2687): All declarations of 'handleCertificationScoring' m... Remove this comment to see the full error message
const { handleCertificationScoring } = require('../../../../lib/domain/events')._forTestOnly.handlers;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('../../../../lib/domain/events/CertificationScoringCompleted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-certification-scoring', function () {
  let scoringCertificationService: $TSFixMe;
  let certificationAssessmentRepository: $TSFixMe;
  let assessmentResultRepository: $TSFixMe;
  let certificationCourseRepository: $TSFixMe;
  let competenceMarkRepository: $TSFixMe;

  const now = new Date('2019-01-01T05:06:07Z');
  let clock: $TSFixMe;
  let event: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    clock = sinon.useFakeTimers(now);

    scoringCertificationService = { calculateCertificationAssessmentScore: sinon.stub() };
    certificationAssessmentRepository = { get: sinon.stub() };
    assessmentResultRepository = { save: sinon.stub() };
    certificationCourseRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
      getCreationDate: sinon.stub(),
    };
    competenceMarkRepository = { save: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    clock.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when assessment is of type CERTIFICATION', function () {
    const assessmentId = 1214;
    const certificationCourseId = 1234;
    const userId = 4567;
    let certificationAssessment: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      event = new AssessmentCompleted({
        assessmentId,
        userId,
        certificationCourseId: 123,
      });
      certificationAssessment = {
        id: assessmentId,
        certificationCourseId,
        userId,
        createdAt: Symbol('someCreationDate'),
      };
      certificationAssessmentRepository.get.withArgs(assessmentId).resolves(certificationAssessment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fails when event is not of correct type', async function () {
      // given
      const event = 'not an event of the correct type';
      // when / then
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(handleCertificationScoring)({
        event,
        assessmentResultRepository,
        certificationCourseRepository,
        competenceMarkRepository,
        scoringCertificationService,
        certificationAssessmentRepository,
      });

      // then
      expect(error).not.to.be.null;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an error different from a compute error happens', function () {
      const otherError = new Error();
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        scoringCertificationService.calculateCertificationAssessmentScore.rejects(otherError);
        sinon.stub(AssessmentResult, 'buildAlgoErrorResult');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not save any results', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(handleCertificationScoring)({
          event,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
          certificationAssessmentRepository,
        });

        // then
        expect(AssessmentResult.buildAlgoErrorResult).to.not.have.been.called;
        expect(assessmentResultRepository.save).to.not.have.been.called;
        expect(certificationCourseRepository.update).to.not.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an error of type CertificationComputeError happens while scoring the assessment', function () {
      const computeError = new CertificationComputeError();
      let errorAssessmentResult: $TSFixMe;
      let certificationCourse: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        errorAssessmentResult = Symbol('ErrorAssessmentResult');
        certificationCourse = domainBuilder.buildCertificationCourse({
          id: certificationCourseId,
          completedAt: null,
        });

        scoringCertificationService.calculateCertificationAssessmentScore.rejects(computeError);
        sinon.stub(AssessmentResult, 'buildAlgoErrorResult').returns(errorAssessmentResult);
        assessmentResultRepository.save.resolves();
        certificationCourseRepository.get
          .withArgs(certificationAssessment.certificationCourseId)
          .resolves(certificationCourse);
        certificationCourseRepository.update.resolves(certificationCourse);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the scoring service with the right arguments', async function () {
        // when
        await handleCertificationScoring({
          event,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
          certificationAssessmentRepository,
        });

        // then
        expect(scoringCertificationService.calculateCertificationAssessmentScore).to.have.been.calledWithExactly({
          certificationAssessment,
          continueOnError: false,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the error result appropriately', async function () {
        // when
        await handleCertificationScoring({
          event,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
          certificationAssessmentRepository,
        });

        // then
        expect(AssessmentResult.buildAlgoErrorResult).to.have.been.calledWithExactly({
          error: computeError,
          assessmentId: certificationAssessment.id,
          emitter: 'PIX-ALGO',
        });
        expect(assessmentResultRepository.save).to.have.been.calledWithExactly(errorAssessmentResult);

        expect(certificationCourseRepository.update).to.have.been.calledWithExactly(
          new CertificationCourse({
            ...certificationCourse.toDTO(),
            completedAt: now,
          })
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when scoring is successful', function () {
      const assessmentResultId = 99;
      let certificationCourse: $TSFixMe;
      let assessmentResult: $TSFixMe;
      let competenceMark1;
      let competenceMark2;
      let savedAssessmentResult;
      let certificationAssessmentScore: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationCourse = domainBuilder.buildCertificationCourse({
          id: certificationCourseId,
          completedAt: null,
        });
        assessmentResult = Symbol('AssessmentResult');
        competenceMark1 = domainBuilder.buildCompetenceMark({ assessmentResultId, score: 5 });
        competenceMark2 = domainBuilder.buildCompetenceMark({ assessmentResultId, score: 4 });
        savedAssessmentResult = { id: assessmentResultId };
        certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
          nbPix: 9,
          status: AssessmentResult.status.VALIDATED,
          competenceMarks: [competenceMark1, competenceMark2],
          percentageCorrectAnswers: 80,
        });

        sinon.stub(AssessmentResult, 'buildStandardAssessmentResult').returns(assessmentResult);
        assessmentResultRepository.save.resolves(savedAssessmentResult);
        competenceMarkRepository.save.resolves();
        scoringCertificationService.calculateCertificationAssessmentScore.resolves(certificationAssessmentScore);
        certificationCourseRepository.get
          .withArgs(certificationAssessment.certificationCourseId)
          .resolves(certificationCourse);
        certificationCourseRepository.update.resolves(certificationCourse);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build and save an assessment result with the expected arguments', async function () {
        // when
        await handleCertificationScoring({
          event,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
          certificationAssessmentRepository,
        });

        // then
        expect(AssessmentResult.buildStandardAssessmentResult).to.have.been.calledWithExactly({
          pixScore: certificationAssessmentScore.nbPix,
          reproducibilityRate: certificationAssessmentScore.percentageCorrectAnswers,
          status: certificationAssessmentScore.status,
          assessmentId: certificationAssessment.id,
          emitter: 'PIX-ALGO',
        });
        expect(assessmentResultRepository.save).to.have.been.calledWithExactly(assessmentResult);
        expect(certificationCourseRepository.update).to.have.been.calledWithExactly(
          new CertificationCourse({
            ...certificationCourse.toDTO(),
            completedAt: now,
          })
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a CertificationScoringCompleted', async function () {
        // when
        const certificationScoringCompleted = await handleCertificationScoring({
          event,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
          certificationAssessmentRepository,
        });

        // then
        expect(certificationScoringCompleted).to.be.instanceof(CertificationScoringCompleted);
        expect(certificationScoringCompleted).to.deep.equal({
          userId: event.userId,
          certificationCourseId: certificationAssessment.certificationCourseId,
          reproducibilityRate: certificationAssessmentScore.percentageCorrectAnswers,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should build and save as many competence marks as present in the certificationAssessmentScore', async function () {
        // when
        await handleCertificationScoring({
          event,
          assessmentResultRepository,
          certificationCourseRepository,
          competenceMarkRepository,
          scoringCertificationService,
          certificationAssessmentRepository,
        });

        // then
        expect(competenceMarkRepository.save.callCount).to.equal(certificationAssessmentScore.competenceMarks.length);
      });
    });
  });
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when completed assessment is not of type CERTIFICATION', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not do anything', async function () {
      // given
      const event = new AssessmentCompleted(
        Symbol('an assessment Id'),
        // @ts-expect-error TS(2554): Expected 0-1 arguments, but got 5.
        Symbol('userId'),
        Symbol('targetProfileId'),
        Symbol('campaignParticipationId'),
        false
      );

      // when
      const certificationScoringCompleted = await handleCertificationScoring({
        event,
        assessmentResultRepository,
        certificationCourseRepository,
        competenceMarkRepository,
        scoringCertificationService,
        certificationAssessmentRepository,
      });

      expect(certificationScoringCompleted).to.be.null;
    });
  });
});
