// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
  PIX_PLUS_DROIT,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
  CLEA,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_2ND_DEGRE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
  PIX_PLUS_EDU_1ER_DEGRE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/ComplementaryCertification');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
  UserNotAuthorizedToCertifyError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SessionNot... Remove this comment to see the full error message
  SessionNotAccessible,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CandidateN... Remove this comment to see the full error message
  CandidateNotAuthorizedToJoinSessionError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CandidateN... Remove this comment to see the full error message
  CandidateNotAuthorizedToResumeCertificationTestError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const retrieveLastOrCreateCertificationCourse = require('../../../../lib/domain/usecases/retrieve-last-or-create-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourse = require('../../../../lib/domain/models/ComplementaryCertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | retrieve-last-or-create-certification-course', function () {
  let clock: $TSFixMe;
  let now: $TSFixMe;
  let domainTransaction: $TSFixMe;
  let verificationCode: $TSFixMe;

  const sessionRepository = {};
  const assessmentRepository = {};
  const competenceRepository = {};
  const certificationCandidateRepository = {};
  const certificationChallengeRepository = {};
  const certificationChallengesService = {};
  const certificationCourseRepository = {};
  const certificationCenterRepository = {};
  const certificationBadgesService = {};
  const placementProfileService = {};
  const verifyCertificateCodeService = {};
  const complementaryCertificationRepository = {};
  const endTestScreenRemovalService = {};

  const injectables = {
    assessmentRepository,
    competenceRepository,
    certificationCandidateRepository,
    certificationChallengeRepository,
    certificationCourseRepository,
    sessionRepository,
    certificationCenterRepository,
    certificationBadgesService,
    certificationChallengesService,
    placementProfileService,
    verifyCertificateCodeService,
    complementaryCertificationRepository,
    endTestScreenRemovalService,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    now = new Date('2019-01-01T05:06:07Z');
    clock = sinon.useFakeTimers(now);
    domainTransaction = Symbol('someDomainTransaction');
    verificationCode = Symbol('verificationCode');

    (assessmentRepository as $TSFixMe).save = sinon.stub();
    (competenceRepository as $TSFixMe).listPixCompetencesOnly = sinon.stub();
    (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions = sinon.stub();
    (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId = sinon.stub();
    (certificationCandidateRepository as $TSFixMe).update = sinon.stub();
    (certificationChallengeRepository as $TSFixMe).save = sinon.stub();
    (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus = sinon.stub();
    (certificationChallengesService as $TSFixMe).pickCertificationChallenges = sinon.stub();
    (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId = sinon.stub();
    (certificationCourseRepository as $TSFixMe).save = sinon.stub();
    (sessionRepository as $TSFixMe).get = sinon.stub();
    (placementProfileService as $TSFixMe).getPlacementProfile = sinon.stub();
    (endTestScreenRemovalService as $TSFixMe).isEndTestScreenRemovalEnabledBySessionId = sinon.stub();

    (verifyCertificateCodeService as $TSFixMe).generateCertificateVerificationCode = sinon.stub().resolves(verificationCode);
    (certificationCenterRepository as $TSFixMe).getBySessionId = sinon.stub();
    (complementaryCertificationRepository as $TSFixMe).findAll = sinon.stub();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    clock.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when session access code is different from provided access code', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a not found error', async function () {
      // given
      const foundSession = domainBuilder.buildSession({ accessCode: 'differentAccessCode' });
      (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(retrieveLastOrCreateCertificationCourse)({
        domainTransaction,
        sessionId: 1,
        accessCode: 'accessCode',
        userId: 2,
        locale: 'fr',
        ...injectables,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect((certificationCourseRepository as $TSFixMe).save).not.to.have.been.called;
      expect((verifyCertificateCodeService as $TSFixMe).generateCertificateVerificationCode).not.to.have.been.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when session access code is the same as the provided access code', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session is not accessible', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a SessionNotAccessible error', async function () {
        // given
        const foundSession = domainBuilder.buildSession.finalized({ id: 1, accessCode: 'accessCode' });
        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(retrieveLastOrCreateCertificationCourse)({
          domainTransaction,
          sessionId: 1,
          accessCode: 'accessCode',
          userId: 2,
          locale: 'fr',
          ...injectables,
        });

        // then
        expect(error).to.be.instanceOf(SessionNotAccessible);
        expect((certificationCourseRepository as $TSFixMe).save).not.to.have.been.called;
        expect((verifyCertificateCodeService as $TSFixMe).generateCertificateVerificationCode).not.to.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session is accessible', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(
        'when FT_END_TEST_SCREEN_REMOVAL_ENABLED_CERTIFICATION_CENTER_IDS is enabled for the session and the candidate IS NOT authorized',
        function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            (endTestScreenRemovalService as $TSFixMe).isEndTestScreenRemovalEnabledBySessionId.withArgs(1).resolves(true);
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when the user tries to join the session for the first time', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should throw a CandidateNotAuthorizedToJoinSessionError', async function () {
              // given
              const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
              (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

              const candidateNotAuthorizedToStart = domainBuilder.buildCertificationCandidate({
                userId: 2,
                sessionId: 1,
                authorizedToStart: false,
              });
              (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(candidateNotAuthorizedToStart);

              // when
              // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
              const error = await catchErr(retrieveLastOrCreateCertificationCourse)({
                domainTransaction: Symbol('someDomainTransaction'),
                sessionId: 1,
                accessCode: 'accessCode',
                userId: 2,
                locale: 'fr',
                ...injectables,
              });

              // then
              expect(error).to.be.an.instanceOf(CandidateNotAuthorizedToJoinSessionError);
            });
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when the user tries to go back to the session without authorization', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should throw a CandidateNotAuthorizedToResumeCertificationTestError', async function () {
              // given
              const domainTransaction = Symbol('someDomainTransaction');
              const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
              (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

              const candidateNotAuthorizedToStart = domainBuilder.buildCertificationCandidate({
                userId: 2,
                sessionId: 1,
                authorizedToStart: false,
              });
              (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(candidateNotAuthorizedToStart);

              const existingCertificationCourse = domainBuilder.buildCertificationCourse({ userId: 2, sessionId: 1 });
              (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(existingCertificationCourse);

              // when
              // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
              const error = await catchErr(retrieveLastOrCreateCertificationCourse)({
                domainTransaction,
                sessionId: 1,
                accessCode: 'accessCode',
                userId: 2,
                locale: 'fr',
                ...injectables,
              });

              // then
              expect(error).to.be.an.instanceOf(CandidateNotAuthorizedToResumeCertificationTestError);
            });
          });
        }
      );

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(
        'when FT_END_TEST_SCREEN_REMOVAL_ENABLED_CERTIFICATION_CENTER_IDS is enabled for the session and when the certification candidate is authorized',
        function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(function () {
            (endTestScreenRemovalService as $TSFixMe).isEndTestScreenRemovalEnabledBySessionId.withArgs(1).resolves(true);
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when a certification course with provided userId and sessionId already exists', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('return existing certification course and unauthorize candidate to start', async function () {
              // given
              const domainTransaction = Symbol('someDomainTransaction');
              const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
              (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

              const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                userId: 2,
                sessionId: 1,
                authorizedToStart: true,
              });
              (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

              const existingCertificationCourse = domainBuilder.buildCertificationCourse({ userId: 2, sessionId: 1 });
              (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(existingCertificationCourse);

              // when
              const result = await retrieveLastOrCreateCertificationCourse({
                domainTransaction,
                sessionId: 1,
                accessCode: 'accessCode',
                userId: 2,
                locale: 'fr',
                ...injectables,
              });

              // then
              expect(result).to.deep.equal({
                created: false,
                certificationCourse: existingCertificationCourse,
              });
              expect((certificationCandidateRepository as $TSFixMe).update).to.have.been.calledOnceWith(domainBuilder.buildCertificationCandidate({
    ...foundCertificationCandidate,
    authorizedToStart: false,
}));
            });
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when no certification course exists for this userId and sessionId', function () {
            // @ts-expect-error TS(2304): Cannot find name 'context'.
            context('when the user is not certifiable', function () {
              // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
              it('should throw a UserNotAuthorizedToCertifyError', async function () {
                // given
                const domainTransaction = Symbol('someDomainTransaction');

                const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId.withArgs({ sessionId: 1, userId: 2 }).resolves(domainBuilder.buildCertificationCandidate({
    userId: 2,
    sessionId: 1,
    authorizedToStart: true,
}));

                (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                const competences = [{ id: 'rec123' }, { id: 'rec456' }];
                (competenceRepository as $TSFixMe).listPixCompetencesOnly.resolves(competences);

                const placementProfile = { isCertifiable: sinon.stub().returns(false) };
                (placementProfileService as $TSFixMe).getPlacementProfile
    .withArgs({ userId: 2, limitDate: now })
    .resolves(placementProfile);

                // when
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                const error = await catchErr(retrieveLastOrCreateCertificationCourse)({
                  domainTransaction,
                  sessionId: 1,
                  accessCode: 'accessCode',
                  userId: 2,
                  locale: 'fr',
                  ...injectables,
                });

                // then
                expect(error).to.be.an.instanceOf(UserNotAuthorizedToCertifyError);
                sinon.assert.notCalled((certificationCourseRepository as $TSFixMe).save);
                sinon.assert.notCalled((assessmentRepository as $TSFixMe).save);
                sinon.assert.notCalled((certificationChallengeRepository as $TSFixMe).save);
                expect((verifyCertificateCodeService as $TSFixMe).generateCertificateVerificationCode).not.to.have.been.called;
              });
            });

            // @ts-expect-error TS(2304): Cannot find name 'context'.
            context('when user is certifiable', function () {
              // @ts-expect-error TS(2304): Cannot find name 'context'.
              context('when a certification course has been created meanwhile', function () {
                // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                it('should return it with flag created marked as false', async function () {
                  // given
                  const domainTransaction = Symbol('someDomainTransaction');
                  const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                  (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                  (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(domainBuilder.buildCertificationCandidate({
    userId: 2,
    sessionId: 1,
    authorizedToStart: true,
}));

                  (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .onCall(0)
    .resolves(null);

                  const { placementProfile, userCompetencesWithChallenges } = _buildPlacementProfileWithTwoChallenges(
                    placementProfileService,
                    2,
                    now
                  );
                  (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                  const certificationCourseCreatedMeanwhile = domainBuilder.buildCertificationCourse({
                    userId: 2,
                    sessionId: 1,
                  });
                  (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .onCall(1)
    .resolves(certificationCourseCreatedMeanwhile);

                  // when
                  const result = await retrieveLastOrCreateCertificationCourse({
                    domainTransaction,
                    sessionId: 1,
                    accessCode: 'accessCode',
                    userId: 2,
                    locale: 'fr',
                    ...injectables,
                  });

                  // then
                  expect(result).to.deep.equal({
                    created: false,
                    certificationCourse: certificationCourseCreatedMeanwhile,
                  });
                  expect((certificationCourseRepository as $TSFixMe).save).not.to.have.been.called;
                  expect((verifyCertificateCodeService as $TSFixMe).generateCertificateVerificationCode).not.to.have.been.called;
                });
              });

              // @ts-expect-error TS(2304): Cannot find name 'context'.
              context('when a certification still has not been created meanwhile', function () {
                // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                it('should return it with flag created marked as true with related resources', async function () {
                  // given
                  const domainTransaction = Symbol('someDomainTransaction');

                  const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                  (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                  const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                    userId: 2,
                    sessionId: 1,
                    authorizedToStart: true,
                  });
                  (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                  (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                  const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                    _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                  (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                  const certificationCenter = domainBuilder.buildCertificationCenter({ habilitations: [] });
                  (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);

                  (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([]);

                  // TODO: extraire jusqu'à la ligne 387 dans une fonction ?
                  const certificationCourseToSave = CertificationCourse.from({
                    certificationCandidate: foundCertificationCandidate,
                    challenges: [challenge1, challenge2],
                    verificationCode,
                    maxReachableLevelOnCertificationDate: 5,
                  });
                  const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                    certificationCourseToSave.toDTO()
                  );
                  (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                  const assessmentToSave = new Assessment({
                    userId: 2,
                    certificationCourseId: savedCertificationCourse.getId(),
                    state: Assessment.states.STARTED,
                    type: Assessment.types.CERTIFICATION,
                    isImproving: false,
                    method: Assessment.methods.CERTIFICATION_DETERMINED,
                  });
                  const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                  (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                  // when
                  const result = await retrieveLastOrCreateCertificationCourse({
                    domainTransaction,
                    sessionId: 1,
                    accessCode: 'accessCode',
                    userId: 2,
                    locale: 'fr',
                    ...injectables,
                  });

                  // then
                  expect(result).to.deep.equal({
                    created: true,
                    certificationCourse: new CertificationCourse({
                      ...savedCertificationCourse.toDTO(),
                      assessment: savedAssessment,
                      challenges: [challenge1, challenge2],
                    }),
                  });
                });

                // @ts-expect-error TS(2304): Cannot find name 'context'.
                context('#Pix+ Droit', function () {
                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is habilitated', function () {
                    // @ts-expect-error TS(2304): Cannot find name 'context'.
                    context('when user is eligible', function () {
                      // @ts-expect-error TS(2304): Cannot find name 'context'.
                      context('when user has a subscription', function () {
                        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                        it('should save complementary certification info', async function () {
                          // given
                          const domainTransaction = Symbol('someDomainTransaction');

                          const foundSession = domainBuilder.buildSession.created({
                            id: 1,
                            accessCode: 'accessCode',
                          });
                          (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                          (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                          const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                            userId: 2,
                            sessionId: 1,
                            authorizedToStart: true,
                            complementaryCertifications: [{ key: PIX_PLUS_DROIT }],
                          });

                          const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                            _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                          (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                          (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                          const complementaryCertificationPixPlusDroit = domainBuilder.buildComplementaryCertification({
                            key: PIX_PLUS_DROIT,
                          });
                          const certificationCenter = domainBuilder.buildCertificationCenter({
                            habilitations: [complementaryCertificationPixPlusDroit],
                          });
                          (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                          (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusDroit,
]);

                          const challengePlus1 = domainBuilder.buildChallenge({ id: 'challenge-pixplus1' });
                          const challengePlus2 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                          const challengePlus3 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });

                          const pixDroitMaitreBadgeAcquisition =
                            domainBuilder.buildBadgeAcquisition.forPixDroitMaitre();
                          (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixDroitMaitreBadgeAcquisition]);

                          (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(pixDroitMaitreBadgeAcquisition.badge, 2)
    .resolves([challengePlus1, challengePlus2, challengePlus3]);

                          const complementaryCertificationCourse =
                            ComplementaryCertificationCourse.fromComplementaryCertificationId(
                              complementaryCertificationPixPlusDroit.id
                            );

                          const certificationCourseToSave = CertificationCourse.from({
                            certificationCandidate: foundCertificationCandidate,
                            challenges: [challenge1, challenge2, challengePlus1, challengePlus2, challengePlus3],
                            verificationCode,
                            maxReachableLevelOnCertificationDate: 5,
                            complementaryCertificationCourses: [complementaryCertificationCourse],
                          });

                          const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                            certificationCourseToSave.toDTO()
                          );
                          savedCertificationCourse._complementaryCertificationCourses = [
                            {
                              ...complementaryCertificationCourse,
                              id: 99,
                              certificationCourseId: savedCertificationCourse.getId(),
                            },
                          ];
                          (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                          const assessmentToSave = new Assessment({
                            userId: 2,
                            certificationCourseId: savedCertificationCourse.getId(),
                            state: Assessment.states.STARTED,
                            type: Assessment.types.CERTIFICATION,
                            isImproving: false,
                            method: Assessment.methods.CERTIFICATION_DETERMINED,
                          });
                          const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                          (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                          // when
                          const result = await retrieveLastOrCreateCertificationCourse({
                            domainTransaction,
                            sessionId: 1,
                            accessCode: 'accessCode',
                            userId: 2,
                            locale: 'fr',
                            ...injectables,
                          });

                          // then
                          expect(result.certificationCourse._complementaryCertificationCourses).to.deep.equal([
                            {
                              id: 99,
                              certificationCourseId: savedCertificationCourse.getId(),
                              complementaryCertificationId: complementaryCertificationPixPlusDroit.id,
                            },
                          ]);
                        });

                        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                        it('should save all the challenges from pix and Pix+ Droit', async function () {
                          // given
                          const domainTransaction = Symbol('someDomainTransaction');

                          const foundSession = domainBuilder.buildSession.created({
                            id: 1,
                            accessCode: 'accessCode',
                          });
                          (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                          (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                          const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                            userId: 2,
                            sessionId: 1,
                            authorizedToStart: true,
                            complementaryCertifications: [{ key: PIX_PLUS_DROIT }],
                          });

                          const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                            _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                          (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                          (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                          const complementaryCertificationPixPlusDroit = domainBuilder.buildComplementaryCertification({
                            key: PIX_PLUS_DROIT,
                          });
                          const certificationCenter = domainBuilder.buildCertificationCenter({
                            habilitations: [complementaryCertificationPixPlusDroit],
                          });
                          (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                          (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusDroit,
]);

                          const challengePlus1 = domainBuilder.buildChallenge({ id: 'challenge-pixplus1' });
                          const challengePlus2 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                          const challengePlus3 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });

                          const pixDroitMaitreBadgeAcquisition =
                            domainBuilder.buildBadgeAcquisition.forPixDroitMaitre();
                          (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixDroitMaitreBadgeAcquisition]);

                          (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(pixDroitMaitreBadgeAcquisition.badge, 2)
    .resolves([challengePlus1, challengePlus2, challengePlus3]);

                          const complementaryCertificationCourse =
                            ComplementaryCertificationCourse.fromComplementaryCertificationId(
                              complementaryCertificationPixPlusDroit.id
                            );
                          const certificationCourseToSave = CertificationCourse.from({
                            certificationCandidate: foundCertificationCandidate,
                            challenges: [challenge1, challenge2, challengePlus1, challengePlus2, challengePlus3],
                            verificationCode,
                            maxReachableLevelOnCertificationDate: 5,
                            complementaryCertificationCourses: [complementaryCertificationCourse],
                          });

                          const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                            certificationCourseToSave.toDTO()
                          );
                          savedCertificationCourse._complementaryCertificationCourses = [
                            {
                              ...complementaryCertificationCourse,
                              certificationCourseId: savedCertificationCourse.getId(),
                            },
                          ];
                          (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                          const assessmentToSave = new Assessment({
                            userId: 2,
                            certificationCourseId: savedCertificationCourse.getId(),
                            state: Assessment.states.STARTED,
                            type: Assessment.types.CERTIFICATION,
                            isImproving: false,
                            method: Assessment.methods.CERTIFICATION_DETERMINED,
                          });
                          const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                          (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                          // when
                          const result = await retrieveLastOrCreateCertificationCourse({
                            domainTransaction,
                            sessionId: 1,
                            accessCode: 'accessCode',
                            userId: 2,
                            locale: 'fr',
                            ...injectables,
                          });

                          // then
                          expect(result.certificationCourse._challenges).to.deep.equal([
                            challenge1,
                            challenge2,
                            challengePlus1,
                            challengePlus2,
                            challengePlus3,
                          ]);
                        });

                        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                        it('should generate challenges for expert badge only if both maitre and expert badges are acquired', async function () {
                          // given
                          const domainTransaction = Symbol('someDomainTransaction');

                          const foundSession = domainBuilder.buildSession.created({
                            id: 1,
                            accessCode: 'accessCode',
                          });
                          (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                          (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                          const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                            userId: 2,
                            sessionId: 1,
                            authorizedToStart: true,
                            complementaryCertifications: [{ key: PIX_PLUS_DROIT }],
                          });

                          (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                          const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                            _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                          (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                          const complementaryCertificationPixPlusDroit = domainBuilder.buildComplementaryCertification({
                            key: PIX_PLUS_DROIT,
                          });
                          const certificationCenter = domainBuilder.buildCertificationCenter({
                            habilitations: [complementaryCertificationPixPlusDroit],
                          });
                          (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                          (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusDroit,
]);

                          const challengesForMaitre = [
                            domainBuilder.buildChallenge({ id: 'challenge-pixmaitre1' }),
                            domainBuilder.buildChallenge({ id: 'challenge-pixmaitre2' }),
                          ];
                          const challengesForExpert = [
                            domainBuilder.buildChallenge({ id: 'challenge-pixexpert1' }),
                            domainBuilder.buildChallenge({ id: 'challenge-pixexpert2' }),
                          ];
                          const maitreBadge = domainBuilder.buildBadge({
                            key: 'PIX_DROIT_MAITRE_CERTIF',
                            targetProfileId: 11,
                          });
                          const expertBadge = domainBuilder.buildBadge({
                            key: 'PIX_DROIT_EXPERT_CERTIF',
                            targetProfileId: 22,
                          });
                          domainBuilder.buildBadgeAcquisition({ badge: maitreBadge });
                          const certifiableBadgeAcquisition2 = domainBuilder.buildBadgeAcquisition({
                            badge: expertBadge,
                          });
                          (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([certifiableBadgeAcquisition2]);

                          (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(maitreBadge, 2)
    .resolves(challengesForMaitre)
    .withArgs(expertBadge, 2)
    .resolves(challengesForExpert);

                          const complementaryCertificationCourse =
                            ComplementaryCertificationCourse.fromComplementaryCertificationId(
                              complementaryCertificationPixPlusDroit.id
                            );

                          const certificationCourseToSave = CertificationCourse.from({
                            certificationCandidate: foundCertificationCandidate,
                            challenges: [challenge1, challenge2, ...challengesForExpert],
                            verificationCode,
                            maxReachableLevelOnCertificationDate: 5,
                            complementaryCertificationCourses: [complementaryCertificationCourse],
                          });

                          const savedCertificationCourse = domainBuilder.buildCertificationCourse({
                            ...foundCertificationCandidate,
                            isV2Certification: true,
                            challenges: [challenge1, challenge2, ...challengesForExpert],
                          });

                          savedCertificationCourse._complementaryCertificationCourses = [
                            {
                              ...complementaryCertificationCourse,
                              certificationCourseId: savedCertificationCourse.getId(),
                            },
                          ];

                          (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                          const savedAssessment = domainBuilder.buildAssessment({
                            userId: 2,
                            certificationCourseId: savedCertificationCourse.id,
                            state: Assessment.states.STARTED,
                            type: Assessment.types.CERTIFICATION,
                            isImproving: false,
                            method: Assessment.methods.CERTIFICATION_DETERMINED,
                          });
                          (assessmentRepository as $TSFixMe).save.resolves(savedAssessment);

                          // when
                          const result = await retrieveLastOrCreateCertificationCourse({
                            domainTransaction,
                            sessionId: 1,
                            accessCode: 'accessCode',
                            userId: 2,
                            locale: 'fr',
                            ...injectables,
                          });

                          // then
                          expect(result.certificationCourse._challenges).to.deep.equal([
                            challenge1,
                            challenge2,
                            ...challengesForExpert,
                          ]);
                        });
                      });

                      // @ts-expect-error TS(2304): Cannot find name 'context'.
                      context(
                        'when user does not have a subscription for Pix+ Droit complementary certification',
                        function () {
                          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                          it('should not save complementary certification info', async function () {
                            // given
                            const domainTransaction = Symbol('someDomainTransaction');

                            const foundSession = domainBuilder.buildSession.created({
                              id: 1,
                              accessCode: 'accessCode',
                            });
                            (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                            (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                            const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                              userId: 2,
                              authorizedToStart: true,
                              sessionId: 1,
                              complementaryCertifications: [],
                            });

                            (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                            const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                              _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                            (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                            const complementaryCertificationPixPlusDroit =
                              domainBuilder.buildComplementaryCertification({
                                key: PIX_PLUS_DROIT,
                              });
                            const certificationCenter = domainBuilder.buildCertificationCenter({
                              habilitations: [complementaryCertificationPixPlusDroit],
                            });
                            (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                            (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusDroit,
]);

                            const challengePlus1 = domainBuilder.buildChallenge({ id: 'challenge-pixplus1' });
                            const challengePlus2 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                            const challengePlus3 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                            const certifiableBadge1 = domainBuilder.buildBadge({ key: 'COUCOU', targetProfileId: 11 });
                            const certifiableBadge2 = domainBuilder.buildBadge({ key: 'SALUT', targetProfileId: 22 });
                            const certifiableBadgeAcquisition1 = domainBuilder.buildBadgeAcquisition({
                              badge: certifiableBadge1,
                            });
                            const certifiableBadgeAcquisition2 = domainBuilder.buildBadgeAcquisition({
                              badge: certifiableBadge2,
                            });

                            (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([certifiableBadgeAcquisition1, certifiableBadgeAcquisition2]);

                            (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(certifiableBadge1, 2)
    .resolves([challengePlus1, challengePlus2])
    .withArgs(certifiableBadge2, 2)
    .resolves([challengePlus3]);

                            const certificationCourseToSave = CertificationCourse.from({
                              certificationCandidate: foundCertificationCandidate,
                              challenges: [challenge1, challenge2],
                              verificationCode,
                              maxReachableLevelOnCertificationDate: 5,
                              complementaryCertificationCourses: [],
                            });

                            const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                              certificationCourseToSave.toDTO()
                            );
                            (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                            const assessmentToSave = new Assessment({
                              userId: 2,
                              certificationCourseId: savedCertificationCourse.getId(),
                              state: Assessment.states.STARTED,
                              type: Assessment.types.CERTIFICATION,
                              isImproving: false,
                              method: Assessment.methods.CERTIFICATION_DETERMINED,
                            });
                            const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                            (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                            // when
                            const result = await retrieveLastOrCreateCertificationCourse({
                              domainTransaction,
                              sessionId: 1,
                              accessCode: 'accessCode',
                              userId: 2,
                              locale: 'fr',
                              ...injectables,
                            });

                            // then
                            expect(result.certificationCourse._complementaryCertificationCourses).to.be.empty;
                          });
                        }
                      );
                    });

                    // @ts-expect-error TS(2304): Cannot find name 'context'.
                    context('when user has no certifiable badges', function () {
                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should not save challenges', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({
                          id: 1,
                          accessCode: 'accessCode',
                        });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                          complementaryCertifications: [{ key: PIX_PLUS_DROIT }],
                        });

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        const complementaryCertificationPixPlusDroit = domainBuilder.buildComplementaryCertification({
                          key: PIX_PLUS_DROIT,
                        });
                        const certificationCenter = domainBuilder.buildCertificationCenter({
                          habilitations: [complementaryCertificationPixPlusDroit],
                        });
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([complementaryCertificationPixPlusDroit]);

                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([]);

                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                          certificationCourseToSave.toDTO()
                        );
                        (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                        const assessmentToSave = new Assessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.getId(),
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                        (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
                        expect(result).to.deep.equal({
                          created: true,
                          certificationCourse: new CertificationCourse({
                            ...savedCertificationCourse.toDTO(),
                            assessment: savedAssessment,
                            challenges: [challenge1, challenge2],
                          }),
                        });
                      });

                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should not generate challenges for expert badge', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({
                          id: 1,
                          accessCode: 'accessCode',
                        });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                          complementaryCertifications: [{ key: PIX_PLUS_DROIT }],
                        });

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        const complementaryCertificationPixPlusDroit = domainBuilder.buildComplementaryCertification({
                          key: PIX_PLUS_DROIT,
                        });
                        const certificationCenter = domainBuilder.buildCertificationCenter({
                          habilitations: [complementaryCertificationPixPlusDroit],
                        });
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([complementaryCertificationPixPlusDroit]);

                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([]);

                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse({
                          ...foundCertificationCandidate,
                          isV2Certification: true,
                          challenges: [challenge1, challenge2],
                        });

                        (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);
                        const savedAssessment = domainBuilder.buildAssessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.id,
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        (assessmentRepository as $TSFixMe).save.resolves(savedAssessment);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
                        expect(result.certificationCourse._challenges).to.deep.equal([challenge1, challenge2]);
                      });
                    });
                  });

                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is not habilitated', function () {
                    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                    it('should save only the challenges from pix', async function () {
                      // given
                      const domainTransaction = Symbol('someDomainTransaction');

                      const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                      (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                      (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                      const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                        userId: 2,
                        sessionId: 1,
                        authorizedToStart: true,
                      });

                      (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                      const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                        _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                      (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                      const complementaryCertificationPixPlusDroit = domainBuilder.buildComplementaryCertification({
                        key: PIX_PLUS_DROIT,
                      });
                      const certificationCenter = domainBuilder.buildCertificationCenter({
                        habilitations: [complementaryCertificationPixPlusDroit],
                      });
                      (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                      (complementaryCertificationRepository as $TSFixMe).findAll.resolves([complementaryCertificationPixPlusDroit]);

                      (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([]);

                      const certificationCourseToSave = CertificationCourse.from({
                        certificationCandidate: foundCertificationCandidate,
                        challenges: [challenge1, challenge2],
                        verificationCode,
                        maxReachableLevelOnCertificationDate: 5,
                      });

                      const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                        certificationCourseToSave.toDTO()
                      );
                      (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                      const assessmentToSave = new Assessment({
                        userId: 2,
                        certificationCourseId: savedCertificationCourse.getId(),
                        state: Assessment.states.STARTED,
                        type: Assessment.types.CERTIFICATION,
                        isImproving: false,
                        method: Assessment.methods.CERTIFICATION_DETERMINED,
                      });
                      const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                      (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                      // when
                      const result = await retrieveLastOrCreateCertificationCourse({
                        domainTransaction,
                        sessionId: 1,
                        accessCode: 'accessCode',
                        userId: 2,
                        locale: 'fr',
                        ...injectables,
                      });

                      // then
                      expect(result.certificationCourse._challenges).to.deep.equal([challenge1, challenge2]);
                      expect((certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus).not.to.have.been.called;
                    });
                  });
                });

                // @ts-expect-error TS(2304): Cannot find name 'context'.
                context('#CleA', function () {
                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is habilitated', function () {
                    // @ts-expect-error TS(2304): Cannot find name 'context'.
                    context('when user is not eligible', function () {
                      // @ts-expect-error TS(2304): Cannot find name 'context'.
                      context('when user has no subscription', function () {
                        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                        it('should not save complementary certification info', async function () {
                          // given
                          const domainTransaction = Symbol('someDomainTransaction');

                          const foundSession = domainBuilder.buildSession.created({
                            id: 1,
                            accessCode: 'accessCode',
                          });
                          (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                          (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                          const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                            userId: 2,
                            sessionId: 1,
                            authorizedToStart: true,
                            complementaryCertifications: [{ key: CLEA }],
                          });

                          (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                          const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                            _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                          (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                          const complementaryCertificationCleA = domainBuilder.buildComplementaryCertification({
                            key: CLEA,
                          });
                          const certificationCenter = domainBuilder.buildCertificationCenter({
                            habilitations: [complementaryCertificationCleA],
                          });
                          (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                          (complementaryCertificationRepository as $TSFixMe).findAll.resolves([complementaryCertificationCleA]);

                          const certificationCourseToSave = CertificationCourse.from({
                            certificationCandidate: foundCertificationCandidate,
                            challenges: [challenge1, challenge2],
                            verificationCode,
                            maxReachableLevelOnCertificationDate: 5,
                            complementaryCertificationCourses: [],
                          });

                          const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                            certificationCourseToSave.toDTO()
                          );
                          (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                          const assessmentToSave = new Assessment({
                            userId: 2,
                            certificationCourseId: savedCertificationCourse.getId(),
                            state: Assessment.states.STARTED,
                            type: Assessment.types.CERTIFICATION,
                            isImproving: false,
                            method: Assessment.methods.CERTIFICATION_DETERMINED,
                          });
                          const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                          (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                          (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({
    userId: 2,
    domainTransaction,
})
    .resolves([]);

                          // when
                          const result = await retrieveLastOrCreateCertificationCourse({
                            domainTransaction,
                            sessionId: 1,
                            accessCode: 'accessCode',
                            userId: 2,
                            locale: 'fr',
                            ...injectables,
                          });

                          // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledWith({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});

                          expect(result.certificationCourse._complementaryCertificationCourses).to.be.empty;
                        });
                      });
                    });

                    // @ts-expect-error TS(2304): Cannot find name 'context'.
                    context('when user is eligible', function () {
                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should save complementary certification info', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                          complementaryCertifications: [{ key: CLEA }],
                        });

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        const complementaryCertificationCleA = domainBuilder.buildComplementaryCertification({
                          key: CLEA,
                        });
                        const certificationCenter = domainBuilder.buildCertificationCenter({
                          habilitations: [complementaryCertificationCleA],
                        });
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([complementaryCertificationCleA]);

                        const cleaBadgeAcquisition = domainBuilder.buildBadgeAcquisition.forCleaV3();

                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([cleaBadgeAcquisition]);

                        (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus.resolves([]);

                        const complementaryCertificationCourse =
                          ComplementaryCertificationCourse.fromComplementaryCertificationId(
                            complementaryCertificationCleA.id
                          );
                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                          complementaryCertificationCourses: [complementaryCertificationCourse],
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                          certificationCourseToSave.toDTO()
                        );

                        savedCertificationCourse._complementaryCertificationCourses = [
                          {
                            ...complementaryCertificationCourse,
                            id: 99,
                            certificationCourseId: savedCertificationCourse.getId(),
                          },
                        ];
                        (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                        const assessmentToSave = new Assessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.getId(),
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                        (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledWith({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});

                        expect(result.certificationCourse._complementaryCertificationCourses).to.deep.equal([
                          {
                            id: 99,
                            certificationCourseId: result.certificationCourse.getId(),
                            complementaryCertificationId: complementaryCertificationCleA.id,
                          },
                        ]);
                      });

                      // @ts-expect-error TS(2304): Cannot find name 'context'.
                      context('when user does not have a subscription for CleA certification', function () {
                        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                        it('should not save complementary certification info', async function () {
                          // given
                          const domainTransaction = Symbol('someDomainTransaction');

                          const foundSession = domainBuilder.buildSession.created({
                            id: 1,
                            accessCode: 'accessCode',
                          });
                          (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                          (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                          const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                            userId: 2,
                            sessionId: 1,
                            authorizedToStart: true,
                          });

                          (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                          const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                            _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                          (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                          const complementaryCertificationCleA = domainBuilder.buildComplementaryCertification({
                            key: CLEA,
                          });
                          const certificationCenter = domainBuilder.buildCertificationCenter({
                            habilitations: [complementaryCertificationCleA],
                          });
                          (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                          (complementaryCertificationRepository as $TSFixMe).findAll.resolves([complementaryCertificationCleA]);

                          const certificationCourseToSave = CertificationCourse.from({
                            certificationCandidate: foundCertificationCandidate,
                            challenges: [challenge1, challenge2],
                            verificationCode,
                            maxReachableLevelOnCertificationDate: 5,
                            complementaryCertificationCourses: [],
                          });

                          const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                            certificationCourseToSave.toDTO()
                          );
                          (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                          const assessmentToSave = new Assessment({
                            userId: 2,
                            certificationCourseId: savedCertificationCourse.getId(),
                            state: Assessment.states.STARTED,
                            type: Assessment.types.CERTIFICATION,
                            isImproving: false,
                            method: Assessment.methods.CERTIFICATION_DETERMINED,
                          });
                          const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                          (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);
                          const cleaBadgeAcquisition = domainBuilder.buildBadgeAcquisition.forCleaV2();

                          (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({
    userId: 2,
    domainTransaction,
})
    .resolves([cleaBadgeAcquisition]);

                          // when
                          const result = await retrieveLastOrCreateCertificationCourse({
                            domainTransaction,
                            sessionId: 1,
                            accessCode: 'accessCode',
                            userId: 2,
                            locale: 'fr',
                            ...injectables,
                          });

                          // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledWith({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});

                          expect(result.certificationCourse._complementaryCertificationCourses).to.deep.equal([]);
                        });
                      });
                    });
                  });

                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is not habilitated', function () {
                    // @ts-expect-error TS(2304): Cannot find name 'context'.
                    context('when user is eligible', function () {
                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should not save complementary certification info', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                        });

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        const complementaryCertificationCleA = domainBuilder.buildComplementaryCertification({
                          key: CLEA,
                        });
                        const certificationCenter = domainBuilder.buildCertificationCenter();
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([complementaryCertificationCleA]);

                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                          complementaryCertificationCourses: [],
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                          certificationCourseToSave.toDTO()
                        );
                        (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                        const assessmentToSave = new Assessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.getId(),
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                        (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                        const cleaBadgeAcquisition = domainBuilder.buildBadgeAcquisition.forCleaV1();

                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({
    userId: 2,
    domainTransaction,
})
    .resolves([cleaBadgeAcquisition]);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledWith({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});

                        expect(result.certificationCourse._complementaryCertificationCourses).to.deep.equal([]);
                      });
                    });
                  });
                });

                // @ts-expect-error TS(2304): Cannot find name 'context'.
                context('#Pix+ Edu 1er degré', function () {
                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is habilitated', function () {
                    // @ts-expect-error TS(2304): Cannot find name 'context'.
                    context('when user is eligible', function () {
                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should save complementary certification', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({
                          id: 1,
                          accessCode: 'accessCode',
                        });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                          complementaryCertifications: [{ key: PIX_PLUS_EDU_1ER_DEGRE }],
                        });

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const complementaryCertificationPixPlusEdu1erDegre =
                          domainBuilder.buildComplementaryCertification({
                            key: PIX_PLUS_EDU_1ER_DEGRE,
                          });
                        const certificationCenter = domainBuilder.buildCertificationCenter({
                          habilitations: [complementaryCertificationPixPlusEdu1erDegre],
                        });
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusEdu1erDegre,
]);

                        const challengePlus1 = domainBuilder.buildChallenge({ id: 'challenge-pixplus1' });
                        const challengePlus2 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                        const challengePlus3 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });

                        const pixEduBadgeAcquisition =
                          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme();
                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixEduBadgeAcquisition]);

                        (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(pixEduBadgeAcquisition.badge, 2)
    .resolves([challengePlus1, challengePlus2, challengePlus3]);

                        const complementaryCertificationCourse =
                          ComplementaryCertificationCourse.fromComplementaryCertificationId(
                            complementaryCertificationPixPlusEdu1erDegre.id
                          );

                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2, challengePlus1, challengePlus2, challengePlus3],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                          complementaryCertificationCourses: [complementaryCertificationCourse],
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                          certificationCourseToSave.toDTO()
                        );
                        savedCertificationCourse._complementaryCertificationCourses = [
                          {
                            ...complementaryCertificationCourse,
                            id: 99,
                            certificationCourseId: savedCertificationCourse.getId(),
                          },
                        ];
                        (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                        const assessmentToSave = new Assessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.getId(),
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                        (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledOnceWithExactly({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});
                        expect(result.certificationCourse._complementaryCertificationCourses).to.deep.equal([
                          {
                            id: 99,
                            certificationCourseId: savedCertificationCourse.getId(),
                            complementaryCertificationId: complementaryCertificationPixPlusEdu1erDegre.id,
                          },
                        ]);
                      });
                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should save Pix and Pix+ challenges', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({
                          id: 1,
                          accessCode: 'accessCode',
                        });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                          complementaryCertifications: [{ key: PIX_PLUS_EDU_1ER_DEGRE }],
                        });

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const complementaryCertificationPixPlusEdu1erDegre =
                          domainBuilder.buildComplementaryCertification({
                            key: PIX_PLUS_EDU_1ER_DEGRE,
                          });
                        const certificationCenter = domainBuilder.buildCertificationCenter({
                          habilitations: [complementaryCertificationPixPlusEdu1erDegre],
                        });
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusEdu1erDegre,
]);

                        const challengePlus1 = domainBuilder.buildChallenge({ id: 'challenge-pixplus1' });
                        const challengePlus2 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                        const challengePlus3 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });

                        const pixEduBadgeAcquisition =
                          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme();
                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixEduBadgeAcquisition]);

                        (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(pixEduBadgeAcquisition.badge, 2)
    .resolves([challengePlus1, challengePlus2, challengePlus3]);

                        const complementaryCertificationCourse =
                          ComplementaryCertificationCourse.fromComplementaryCertificationId(
                            complementaryCertificationPixPlusEdu1erDegre.id
                          );

                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2, challengePlus1, challengePlus2, challengePlus3],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                          complementaryCertificationCourses: [complementaryCertificationCourse],
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                          certificationCourseToSave.toDTO()
                        );
                        savedCertificationCourse._complementaryCertificationCourses = [
                          {
                            ...complementaryCertificationCourse,
                            id: 99,
                            certificationCourseId: savedCertificationCourse.getId(),
                          },
                        ];
                        (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                        const assessmentToSave = new Assessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.getId(),
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                        (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledOnceWithExactly({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});
                        expect(result.certificationCourse._challenges).to.deep.equal([
                          challenge1,
                          challenge2,
                          challengePlus1,
                          challengePlus2,
                          challengePlus3,
                        ]);
                      });
                    });
                  });
                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is not habilitated', function () {
                    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                    it('should save only the challenges from pix', async function () {
                      // given
                      const domainTransaction = Symbol('someDomainTransaction');

                      const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                      (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                      (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                      const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                        userId: 2,
                        sessionId: 1,
                        authorizedToStart: true,
                      });

                      (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                      const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                        _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                      (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                      const complementaryCertificationPixPlusEdu1erDegre =
                        domainBuilder.buildComplementaryCertification({
                          key: PIX_PLUS_EDU_1ER_DEGRE,
                        });
                      const certificationCenter = domainBuilder.buildCertificationCenter({
                        habilitations: [],
                      });
                      (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                      (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusEdu1erDegre,
]);

                      const pixEduBadgeAcquisition =
                        domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale1erDegreConfirme();

                      (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixEduBadgeAcquisition]);

                      const certificationCourseToSave = CertificationCourse.from({
                        certificationCandidate: foundCertificationCandidate,
                        challenges: [challenge1, challenge2],
                        verificationCode,
                        maxReachableLevelOnCertificationDate: 5,
                      });

                      const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                        certificationCourseToSave.toDTO()
                      );
                      (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                      const assessmentToSave = new Assessment({
                        userId: 2,
                        certificationCourseId: savedCertificationCourse.getId(),
                        state: Assessment.states.STARTED,
                        type: Assessment.types.CERTIFICATION,
                        isImproving: false,
                        method: Assessment.methods.CERTIFICATION_DETERMINED,
                      });
                      const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                      (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                      // when
                      const result = await retrieveLastOrCreateCertificationCourse({
                        domainTransaction,
                        sessionId: 1,
                        accessCode: 'accessCode',
                        userId: 2,
                        locale: 'fr',
                        ...injectables,
                      });

                      // then
                      expect(result.certificationCourse._challenges).to.deep.equal([challenge1, challenge2]);
                      expect((certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus).not.to.have.been.called;
                    });
                  });
                });
                // @ts-expect-error TS(2304): Cannot find name 'context'.
                context('#Pix+ Edu 2nd degré', function () {
                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is habilitated', function () {
                    // @ts-expect-error TS(2304): Cannot find name 'context'.
                    context('when user is eligible', function () {
                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should save complementary certification', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({
                          id: 1,
                          accessCode: 'accessCode',
                        });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                          complementaryCertifications: [{ key: PIX_PLUS_EDU_2ND_DEGRE }],
                        });

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const complementaryCertificationPixPlusEdu2ndDegre =
                          domainBuilder.buildComplementaryCertification({
                            key: PIX_PLUS_EDU_2ND_DEGRE,
                          });
                        const certificationCenter = domainBuilder.buildCertificationCenter({
                          habilitations: [complementaryCertificationPixPlusEdu2ndDegre],
                        });
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusEdu2ndDegre,
]);

                        const challengePlus1 = domainBuilder.buildChallenge({ id: 'challenge-pixplus1' });
                        const challengePlus2 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                        const challengePlus3 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });

                        const pixEduBadgeAcquisition =
                          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme();
                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixEduBadgeAcquisition]);

                        (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(pixEduBadgeAcquisition.badge, 2)
    .resolves([challengePlus1, challengePlus2, challengePlus3]);

                        const complementaryCertificationCourse =
                          ComplementaryCertificationCourse.fromComplementaryCertificationId(
                            complementaryCertificationPixPlusEdu2ndDegre.id
                          );

                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2, challengePlus1, challengePlus2, challengePlus3],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                          complementaryCertificationCourses: [complementaryCertificationCourse],
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                          certificationCourseToSave.toDTO()
                        );
                        savedCertificationCourse._complementaryCertificationCourses = [
                          {
                            ...complementaryCertificationCourse,
                            id: 99,
                            certificationCourseId: savedCertificationCourse.getId(),
                          },
                        ];
                        (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                        const assessmentToSave = new Assessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.getId(),
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                        (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledOnceWithExactly({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});
                        expect(result.certificationCourse._complementaryCertificationCourses).to.deep.equal([
                          {
                            id: 99,
                            certificationCourseId: savedCertificationCourse.getId(),
                            complementaryCertificationId: complementaryCertificationPixPlusEdu2ndDegre.id,
                          },
                        ]);
                      });
                      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                      it('should save Pix and Pix+ challenges', async function () {
                        // given
                        const domainTransaction = Symbol('someDomainTransaction');

                        const foundSession = domainBuilder.buildSession.created({
                          id: 1,
                          accessCode: 'accessCode',
                        });
                        (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                        (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                        const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                          userId: 2,
                          sessionId: 1,
                          authorizedToStart: true,
                          complementaryCertifications: [{ key: PIX_PLUS_EDU_2ND_DEGRE }],
                        });

                        const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                          _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                        (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                        (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                        const complementaryCertificationPixPlusEdu2ndDegre =
                          domainBuilder.buildComplementaryCertification({
                            key: PIX_PLUS_EDU_2ND_DEGRE,
                          });
                        const certificationCenter = domainBuilder.buildCertificationCenter({
                          habilitations: [complementaryCertificationPixPlusEdu2ndDegre],
                        });
                        (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                        (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusEdu2ndDegre,
]);

                        const challengePlus1 = domainBuilder.buildChallenge({ id: 'challenge-pixplus1' });
                        const challengePlus2 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });
                        const challengePlus3 = domainBuilder.buildChallenge({ id: 'challenge-pixplus2' });

                        const pixEduBadgeAcquisition =
                          domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme();
                        (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixEduBadgeAcquisition]);

                        (certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus
    .withArgs(pixEduBadgeAcquisition.badge, 2)
    .resolves([challengePlus1, challengePlus2, challengePlus3]);

                        const complementaryCertificationCourse =
                          ComplementaryCertificationCourse.fromComplementaryCertificationId(
                            complementaryCertificationPixPlusEdu2ndDegre.id
                          );

                        const certificationCourseToSave = CertificationCourse.from({
                          certificationCandidate: foundCertificationCandidate,
                          challenges: [challenge1, challenge2, challengePlus1, challengePlus2, challengePlus3],
                          verificationCode,
                          maxReachableLevelOnCertificationDate: 5,
                          complementaryCertificationCourses: [complementaryCertificationCourse],
                        });

                        const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                          certificationCourseToSave.toDTO()
                        );
                        savedCertificationCourse._complementaryCertificationCourses = [
                          {
                            ...complementaryCertificationCourse,
                            id: 99,
                            certificationCourseId: savedCertificationCourse.getId(),
                          },
                        ];
                        (certificationCourseRepository as $TSFixMe).save.resolves(savedCertificationCourse);

                        const assessmentToSave = new Assessment({
                          userId: 2,
                          certificationCourseId: savedCertificationCourse.getId(),
                          state: Assessment.states.STARTED,
                          type: Assessment.types.CERTIFICATION,
                          isImproving: false,
                          method: Assessment.methods.CERTIFICATION_DETERMINED,
                        });
                        const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                        (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                        // when
                        const result = await retrieveLastOrCreateCertificationCourse({
                          domainTransaction,
                          sessionId: 1,
                          accessCode: 'accessCode',
                          userId: 2,
                          locale: 'fr',
                          ...injectables,
                        });

                        // then
expect((certificationCourseRepository as $TSFixMe).save).to.have.been.calledOnceWithExactly({
    certificationCourse: certificationCourseToSave,
    domainTransaction,
});
                        expect(result.certificationCourse._challenges).to.deep.equal([
                          challenge1,
                          challenge2,
                          challengePlus1,
                          challengePlus2,
                          challengePlus3,
                        ]);
                      });
                    });
                  });
                  // @ts-expect-error TS(2304): Cannot find name 'context'.
                  context('when certification center is not habilitated', function () {
                    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
                    it('should save only the challenges from pix', async function () {
                      // given
                      const domainTransaction = Symbol('someDomainTransaction');

                      const foundSession = domainBuilder.buildSession.created({ id: 1, accessCode: 'accessCode' });
                      (sessionRepository as $TSFixMe).get.withArgs(1).resolves(foundSession);

                      (certificationCourseRepository as $TSFixMe).findOneCertificationCourseByUserIdAndSessionId
    .withArgs({ userId: 2, sessionId: 1, domainTransaction })
    .resolves(null);

                      const foundCertificationCandidate = domainBuilder.buildCertificationCandidate({
                        userId: 2,
                        sessionId: 1,
                        authorizedToStart: true,
                      });

                      (certificationCandidateRepository as $TSFixMe).getBySessionIdAndUserId
    .withArgs({ sessionId: 1, userId: 2 })
    .resolves(foundCertificationCandidate);

                      const { challenge1, challenge2, placementProfile, userCompetencesWithChallenges } =
                        _buildPlacementProfileWithTwoChallenges(placementProfileService, 2, now);
                      (certificationChallengesService as $TSFixMe).pickCertificationChallenges
    .withArgs(placementProfile)
    .resolves(_.flatMap(userCompetencesWithChallenges, 'challenges'));

                      const complementaryCertificationPixPlusEdu2ndDegre =
                        domainBuilder.buildComplementaryCertification({
                          key: PIX_PLUS_EDU_2ND_DEGRE,
                        });
                      const certificationCenter = domainBuilder.buildCertificationCenter({
                        habilitations: [],
                      });
                      (certificationCenterRepository as $TSFixMe).getBySessionId.resolves(certificationCenter);
                      (complementaryCertificationRepository as $TSFixMe).findAll.resolves([
    complementaryCertificationPixPlusEdu2ndDegre,
]);

                      const pixEduBadgeAcquisition =
                        domainBuilder.buildBadgeAcquisition.forPixEduFormationInitiale2ndDegreConfirme();

                      (certificationBadgesService as $TSFixMe).findStillValidBadgeAcquisitions
    .withArgs({ userId: 2, domainTransaction })
    .resolves([pixEduBadgeAcquisition]);

                      const certificationCourseToSave = CertificationCourse.from({
                        certificationCandidate: foundCertificationCandidate,
                        challenges: [challenge1, challenge2],
                        verificationCode,
                        maxReachableLevelOnCertificationDate: 5,
                      });

                      const savedCertificationCourse = domainBuilder.buildCertificationCourse(
                        certificationCourseToSave.toDTO()
                      );
                      (certificationCourseRepository as $TSFixMe).save
    .withArgs({ certificationCourse: certificationCourseToSave, domainTransaction })
    .resolves(savedCertificationCourse);

                      const assessmentToSave = new Assessment({
                        userId: 2,
                        certificationCourseId: savedCertificationCourse.getId(),
                        state: Assessment.states.STARTED,
                        type: Assessment.types.CERTIFICATION,
                        isImproving: false,
                        method: Assessment.methods.CERTIFICATION_DETERMINED,
                      });
                      const savedAssessment = domainBuilder.buildAssessment(assessmentToSave);
                      (assessmentRepository as $TSFixMe).save
    .withArgs({ assessment: assessmentToSave, domainTransaction })
    .resolves(savedAssessment);

                      // when
                      const result = await retrieveLastOrCreateCertificationCourse({
                        domainTransaction,
                        sessionId: 1,
                        accessCode: 'accessCode',
                        userId: 2,
                        locale: 'fr',
                        ...injectables,
                      });

                      // then
                      expect(result.certificationCourse._challenges).to.deep.equal([challenge1, challenge2]);
                      expect((certificationChallengesService as $TSFixMe).pickCertificationChallengesForPixPlus).not.to.have.been.called;
                    });
                  });
                });
              });
            });
          });
        }
      );
    });
  });
});

function _buildPlacementProfileWithTwoChallenges(placementProfileService: $TSFixMe, userId: $TSFixMe, now: $TSFixMe) {
  const challenge1 = domainBuilder.buildChallenge({ id: 'challenge1' });
  const challenge2 = domainBuilder.buildChallenge({ id: 'challenge2' });
  // TODO : use the domainBuilder to instanciate userCompetences
  const placementProfile = {
    isCertifiable: sinon.stub().returns(true),
    userCompetences: [{ challenges: [challenge1] }, { challenges: [challenge2] }],
  };
  placementProfileService.getPlacementProfile.withArgs({ userId, limitDate: now }).resolves(placementProfile);

  const userCompetencesWithChallenges = _.clone(placementProfile.userCompetences);
  userCompetencesWithChallenges[0].challenges[0].testedSkill = domainBuilder.buildSkill();
  userCompetencesWithChallenges[1].challenges[0].testedSkill = domainBuilder.buildSkill();
  return { challenge1, challenge2, placementProfile, userCompetencesWithChallenges };
}
