// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2687): All declarations of 'handleCertificationRescoring'... Remove this comment to see the full error message
const { handleCertificationRescoring } = require('../../../../lib/domain/events')._forTestOnly.handlers;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
const ChallengeNeutralized = require('../../../../lib/domain/events/ChallengeNeutralized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeD... Remove this comment to see the full error message
const ChallengeDeneutralized = require('../../../../lib/domain/events/ChallengeDeneutralized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationJuryDone = require('../../../../lib/domain/events/CertificationJuryDone');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAssessment = require('../../../../lib/domain/models/CertificationAssessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationResult = require('../../../../lib/domain/models/CertificationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-certification-rescoring', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('computes and persists the assessment result and competence marks when computation succeeds', async function () {
    // given
    const certificationCourseRepository = { get: sinon.stub(), update: sinon.stub() };
    const assessmentResultRepository = { save: sinon.stub() };
    const certificationAssessmentRepository = { getByCertificationCourseId: sinon.stub() };
    const competenceMarkRepository = { save: sinon.stub() };
    const scoringCertificationService = { calculateCertificationAssessmentScore: sinon.stub() };
    const certificationCourse = domainBuilder.buildCertificationCourse({
      isCancelled: false,
    });
    const expectedSaveCertificationCourse = domainBuilder.buildCertificationCourse({
      ...certificationCourse.toDTO(),
    });

    const event = new ChallengeNeutralized({ certificationCourseId: certificationCourse.getId(), juryId: 7 });
    const certificationAssessment = new CertificationAssessment({
      id: 123,
      userId: 123,
      certificationCourseId: certificationCourse.getId(),
      createdAt: new Date('2020-01-01'),
      completedAt: new Date('2020-01-01'),
      state: CertificationAssessment.states.STARTED,
      isV2Certification: true,
      certificationChallenges: [
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
      ],
      certificationAnswersByDate: ['answer'],
    });
    certificationAssessmentRepository.getByCertificationCourseId
      .withArgs({ certificationCourseId: certificationCourse.getId() })
      .resolves(certificationAssessment);
    certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);

    const competenceMark2 = domainBuilder.buildCompetenceMark({ score: 5 });
    const competenceMark1 = domainBuilder.buildCompetenceMark({ score: 4 });
    const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
      nbPix: 9,
      status: AssessmentResult.status.VALIDATED,
      competenceMarks: [competenceMark1, competenceMark2],
      percentageCorrectAnswers: 80,
      hasEnoughNonNeutralizedChallengesToBeTrusted: true,
    });
    scoringCertificationService.calculateCertificationAssessmentScore
      .withArgs({ certificationAssessment, continueOnError: false })
      .resolves(certificationAssessmentScore);

    const assessmentResultToBeSaved = new AssessmentResult({
      id: undefined,
      commentForJury: 'Computed',
      emitter: 'PIX-ALGO-NEUTRALIZATION',
      pixScore: 9,
      reproducibilityRate: 80,
      status: AssessmentResult.status.VALIDATED,
      assessmentId: 123,
      juryId: 7,
    });
    const savedAssessmentResult = new AssessmentResult({ ...assessmentResultToBeSaved, id: 4 });
    assessmentResultRepository.save.withArgs(assessmentResultToBeSaved).resolves(savedAssessmentResult);

    const dependendencies = {
      assessmentResultRepository,
      certificationAssessmentRepository,
      competenceMarkRepository,
      scoringCertificationService,
      certificationCourseRepository,
    };

    // when
    await handleCertificationRescoring({
      ...dependendencies,
      event,
    });

    // then
    expect(assessmentResultRepository.save).to.have.been.calledWith(assessmentResultToBeSaved);
    competenceMark1.assessmentResultId = savedAssessmentResult.id;
    competenceMark2.assessmentResultId = savedAssessmentResult.id;
    expect(competenceMarkRepository.save).to.have.been.calledWithExactly(competenceMark1);
    expect(competenceMarkRepository.save).to.have.been.calledWithExactly(competenceMark2);
    expect(certificationCourseRepository.update).to.have.been.calledWithExactly(expectedSaveCertificationCourse);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the certification has not enough non neutralized challenges to be trusted', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('cancels the certification and save a not trustable assessment result', async function () {
      // given
      const certificationCourseRepository = { get: sinon.stub(), update: sinon.stub() };
      const assessmentResultRepository = { save: sinon.stub() };
      const certificationAssessmentRepository = { getByCertificationCourseId: sinon.stub() };
      const competenceMarkRepository = { save: sinon.stub() };
      const scoringCertificationService = { calculateCertificationAssessmentScore: sinon.stub() };
      const certificationCourse = domainBuilder.buildCertificationCourse({ id: 789 });
      sinon.spy(certificationCourse, 'cancel');

      const event = new ChallengeNeutralized({ certificationCourseId: 789, juryId: 7 });
      const certificationAssessment = new CertificationAssessment({
        id: 123,
        userId: 123,
        certificationCourseId: 789,
        createdAt: new Date('2020-01-01'),
        completedAt: new Date('2020-01-01'),
        state: CertificationAssessment.states.STARTED,
        isV2Certification: true,
        certificationChallenges: [
          domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
          domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
        ],
        certificationAnswersByDate: ['answer'],
      });
      certificationAssessmentRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId: 789 })
        .resolves(certificationAssessment);
      certificationCourseRepository.get.withArgs(789).resolves(certificationCourse);
      const competenceMark2 = domainBuilder.buildCompetenceMark({ score: 12 });
      const competenceMark1 = domainBuilder.buildCompetenceMark({ score: 18 });
      const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
        status: AssessmentResult.status.VALIDATED,
        competenceMarks: [competenceMark1, competenceMark2],
        percentageCorrectAnswers: 80,
        hasEnoughNonNeutralizedChallengesToBeTrusted: false,
      });
      scoringCertificationService.calculateCertificationAssessmentScore
        .withArgs({ certificationAssessment, continueOnError: false })
        .resolves(certificationAssessmentScore);

      const assessmentResultToBeSaved = domainBuilder.buildAssessmentResult.notTrustable({
        emitter: 'PIX-ALGO-NEUTRALIZATION',
        pixScore: 30,
        reproducibilityRate: 80,
        status: AssessmentResult.status.VALIDATED,
        assessmentId: 123,
        juryId: 7,
      });
      const savedAssessmentResult = new AssessmentResult({ ...assessmentResultToBeSaved, id: 4 });
      assessmentResultRepository.save.resolves(savedAssessmentResult);

      const dependendencies = {
        assessmentResultRepository,
        certificationAssessmentRepository,
        competenceMarkRepository,
        scoringCertificationService,
        certificationCourseRepository,
      };

      // when
      await handleCertificationRescoring({
        ...dependendencies,
        event,
      });

      // then
      expect(assessmentResultRepository.save).to.have.been.calledWithExactly(assessmentResultToBeSaved);
      expect(certificationCourse.cancel).to.have.been.calledOnce;
      expect(certificationCourseRepository.update).to.have.been.calledWithExactly(certificationCourse);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the certification has enough non neutralized challenges to be trusted', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uncancels the certification and save a standard assessment result', async function () {
      // given
      const certificationCourseRepository = { get: sinon.stub(), update: sinon.stub() };
      const assessmentResultRepository = { save: sinon.stub() };
      const certificationAssessmentRepository = { getByCertificationCourseId: sinon.stub() };
      const competenceMarkRepository = { save: sinon.stub() };
      const scoringCertificationService = { calculateCertificationAssessmentScore: sinon.stub() };
      const certificationCourse = domainBuilder.buildCertificationCourse({ id: 789 });
      sinon.spy(certificationCourse, 'uncancel');

      const event = new ChallengeNeutralized({ certificationCourseId: 789, juryId: 7 });
      const certificationAssessment = new CertificationAssessment({
        id: 123,
        userId: 123,
        certificationCourseId: 789,
        createdAt: new Date('2020-01-01'),
        completedAt: new Date('2020-01-01'),
        state: CertificationAssessment.states.STARTED,
        isV2Certification: true,
        certificationChallenges: [
          domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
          domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
        ],
        certificationAnswersByDate: ['answer'],
      });
      certificationAssessmentRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId: 789 })
        .resolves(certificationAssessment);
      certificationCourseRepository.get.withArgs(789).resolves(certificationCourse);
      const competenceMark2 = domainBuilder.buildCompetenceMark({ score: 12 });
      const competenceMark1 = domainBuilder.buildCompetenceMark({ score: 18 });
      const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
        status: AssessmentResult.status.VALIDATED,
        competenceMarks: [competenceMark1, competenceMark2],
        percentageCorrectAnswers: 80,
        hasEnoughNonNeutralizedChallengesToBeTrusted: true,
      });
      scoringCertificationService.calculateCertificationAssessmentScore
        .withArgs({ certificationAssessment, continueOnError: false })
        .resolves(certificationAssessmentScore);

      const assessmentResultToBeSaved = domainBuilder.buildAssessmentResult.standard({
        emitter: 'PIX-ALGO-NEUTRALIZATION',
        pixScore: 30,
        reproducibilityRate: 80,
        status: AssessmentResult.status.VALIDATED,
        assessmentId: 123,
        juryId: 7,
      });
      const savedAssessmentResult = new AssessmentResult({ ...assessmentResultToBeSaved, id: 4 });
      assessmentResultRepository.save.resolves(savedAssessmentResult);

      const dependendencies = {
        assessmentResultRepository,
        certificationAssessmentRepository,
        competenceMarkRepository,
        scoringCertificationService,
        certificationCourseRepository,
      };

      // when
      await handleCertificationRescoring({
        ...dependendencies,
        event,
      });

      // then
      expect(assessmentResultRepository.save).to.have.been.calledWithExactly(assessmentResultToBeSaved);
      expect(certificationCourse.uncancel).to.have.been.calledOnce;
      expect(certificationCourseRepository.update).to.have.been.calledWithExactly(certificationCourse);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns a CertificationRescoringCompleted event', async function () {
    // given
    const certificationCourseRepository = { get: sinon.stub(), update: sinon.stub() };
    const assessmentResultRepository = { save: sinon.stub() };
    const certificationAssessmentRepository = { getByCertificationCourseId: sinon.stub() };
    const competenceMarkRepository = { save: sinon.stub() };
    const scoringCertificationService = { calculateCertificationAssessmentScore: sinon.stub() };
    const certificationCourse = domainBuilder.buildCertificationCourse();

    const event = new ChallengeNeutralized({ certificationCourseId: certificationCourse.getId(), juryId: 7 });
    const certificationAssessment = domainBuilder.buildCertificationAssessment({
      userId: 123,
      certificationCourseId: certificationCourse.getId(),
    });
    certificationAssessmentRepository.getByCertificationCourseId
      .withArgs({ certificationCourseId: certificationCourse.getId() })
      .resolves(certificationAssessment);
    certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);

    const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
      competenceMarks: [],
      percentageCorrectAnswers: 80,
      hasEnoughNonNeutralizedChallengesToBeTrusted: true,
    });
    scoringCertificationService.calculateCertificationAssessmentScore
      .withArgs({ certificationAssessment, continueOnError: false })
      .resolves(certificationAssessmentScore);
    assessmentResultRepository.save.resolves(domainBuilder.buildAssessmentResult());

    const dependendencies = {
      assessmentResultRepository,
      certificationAssessmentRepository,
      competenceMarkRepository,
      scoringCertificationService,
      certificationCourseRepository,
    };

    // when
    const returnedEvent = await handleCertificationRescoring({
      ...dependendencies,
      event,
    });

    // then
    const expectedReturnedEvent = domainBuilder.buildCertificationRescoringCompletedEvent({
      certificationCourseId: certificationCourse.getId(),
      userId: 123,
      reproducibilityRate: 80,
    });
    expect(returnedEvent).to.deep.equal(expectedReturnedEvent);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('computes and persists the assessment result in error when computation fails', async function () {
    // given
    const assessmentResultRepository = { save: sinon.stub() };
    const certificationAssessmentRepository = { getByCertificationCourseId: sinon.stub() };
    const competenceMarkRepository = { save: sinon.stub() };
    const scoringCertificationService = { calculateCertificationAssessmentScore: sinon.stub() };

    const event = new ChallengeNeutralized({ certificationCourseId: 1, juryId: 7 });
    const certificationAssessment = new CertificationAssessment({
      id: 123,
      userId: 123,
      certificationCourseId: 1,
      createdAt: new Date('2020-01-01'),
      completedAt: new Date('2020-01-01'),
      state: CertificationAssessment.states.STARTED,
      isV2Certification: true,
      certificationChallenges: [
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
        domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
      ],
      certificationAnswersByDate: ['answer'],
    });
    certificationAssessmentRepository.getByCertificationCourseId
      .withArgs({ certificationCourseId: 1 })
      .resolves(certificationAssessment);

    scoringCertificationService.calculateCertificationAssessmentScore
      .withArgs({ certificationAssessment, continueOnError: false })
      .rejects(new CertificationComputeError('Oopsie'));

    const assessmentResultToBeSaved = new AssessmentResult({
      id: undefined,
      emitter: 'PIX-ALGO-NEUTRALIZATION',
      commentForJury: 'Oopsie',
      pixScore: 0,
      reproducibilityRate: 0,
      status: 'error',
      assessmentId: 123,
      juryId: 7,
    });
    const savedAssessmentResult = new AssessmentResult({ ...assessmentResultToBeSaved, id: 4 });
    assessmentResultRepository.save.withArgs(assessmentResultToBeSaved).resolves(savedAssessmentResult);

    const dependendencies = {
      assessmentResultRepository,
      certificationAssessmentRepository,
      competenceMarkRepository,
      scoringCertificationService,
    };

    // when
    await handleCertificationRescoring({
      ...dependendencies,
      event,
    });

    // then
    expect(assessmentResultRepository.save).to.have.been.calledWith(assessmentResultToBeSaved);
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  [
    {
      eventType: CertificationJuryDone,
      // eslint-disable-next-line mocha/no-setup-in-describe
      emitter: CertificationResult.emitters.PIX_ALGO_AUTO_JURY,
    },
    {
      eventType: ChallengeNeutralized,
      // eslint-disable-next-line mocha/no-setup-in-describe
      emitter: CertificationResult.emitters.PIX_ALGO_NEUTRALIZATION,
    },
    {
      eventType: ChallengeDeneutralized,
      // eslint-disable-next-line mocha/no-setup-in-describe
      emitter: CertificationResult.emitters.PIX_ALGO_NEUTRALIZATION,
    },
  ].forEach(({ eventType, emitter }) => {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(`when event is of type ${eventType}`, function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should save an assessment result with a ${emitter} emitter`, async function () {
        // given
        const certificationCourseRepository = { get: sinon.stub(), update: sinon.stub() };
        const assessmentResultRepository = { save: sinon.stub() };
        const certificationAssessmentRepository = { getByCertificationCourseId: sinon.stub() };
        const competenceMarkRepository = { save: sinon.stub() };
        const scoringCertificationService = { calculateCertificationAssessmentScore: sinon.stub() };
        const certificationCourse = domainBuilder.buildCertificationCourse({
          isCancelled: false,
        });

        const event = new eventType({ certificationCourseId: certificationCourse.getId() });
        const certificationAssessment = new CertificationAssessment({
          id: 123,
          userId: 123,
          certificationCourseId: certificationCourse.getId(),
          createdAt: new Date('2020-01-01'),
          completedAt: new Date('2020-01-01'),
          state: CertificationAssessment.states.STARTED,
          isV2Certification: true,
          certificationChallenges: [
            domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
            domainBuilder.buildCertificationChallengeWithType({ isNeutralized: false }),
          ],
          certificationAnswersByDate: ['answer'],
        });
        certificationAssessmentRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId: certificationCourse.getId() })
          .resolves(certificationAssessment);
        certificationCourseRepository.get.withArgs(certificationCourse.getId()).resolves(certificationCourse);

        const competenceMark2 = domainBuilder.buildCompetenceMark({ score: 5 });
        const competenceMark1 = domainBuilder.buildCompetenceMark({ score: 4 });
        const certificationAssessmentScore = domainBuilder.buildCertificationAssessmentScore({
          nbPix: 9,
          status: AssessmentResult.status.VALIDATED,
          competenceMarks: [competenceMark1, competenceMark2],
          percentageCorrectAnswers: 80,
          hasEnoughNonNeutralizedChallengesToBeTrusted: true,
        });
        scoringCertificationService.calculateCertificationAssessmentScore
          .withArgs({ certificationAssessment, continueOnError: false })
          .resolves(certificationAssessmentScore);

        const assessmentResultToBeSaved = new AssessmentResult({
          id: undefined,
          commentForJury: 'Computed',
          emitter,
          pixScore: 9,
          reproducibilityRate: 80,
          status: AssessmentResult.status.VALIDATED,
          assessmentId: 123,
          juryId: undefined,
        });
        const savedAssessmentResult = new AssessmentResult({ ...assessmentResultToBeSaved, id: 4 });
        assessmentResultRepository.save.resolves(savedAssessmentResult);

        const dependendencies = {
          assessmentResultRepository,
          certificationAssessmentRepository,
          competenceMarkRepository,
          scoringCertificationService,
          certificationCourseRepository,
        };

        // when
        await handleCertificationRescoring({
          ...dependendencies,
          event,
        });

        // then
        expect(assessmentResultRepository.save).to.have.been.calledWith(assessmentResultToBeSaved);
      });
    });
  });
});
