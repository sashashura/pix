const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationResult = require('../../../../lib/domain/models/CertificationResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | sessions-controller', function () {
  let options: $TSFixMe;
  let server: $TSFixMe;
  let session: $TSFixMe;
  const examinerGlobalComment = 'It was a fine session my dear';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    session = databaseBuilder.factory.buildSession();
    const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({}).id;
    const report1 = databaseBuilder.factory.buildCertificationReport({ sessionId: session.id, certificationCourseId });
    const report2 = databaseBuilder.factory.buildCertificationReport({ sessionId: session.id, certificationCourseId });
    databaseBuilder.factory.buildAssessment({ certificationCourseId });
    options = {
      method: 'PUT',
      payload: {
        data: {
          attributes: {
            'examiner-global-comment': examinerGlobalComment,
            'has-incident': true,
            'has-joining-issue': true,
          },
          included: [
            {
              id: report1.id,
              type: 'certification-reports',
              attributes: {
                'certification-course-id': report1.certificationCourseId,
                'examiner-comment': 'What a fine lad this one',
                'has-seen-end-test-screen': false,
                'is-completed': true,
              },
            },
            {
              id: report2.id,
              type: 'certification-reports',
              attributes: {
                'certification-course-id': report2.certificationCourseId,
                'examiner-comment': 'What a fine lad this two',
                'has-seen-end-test-screen': true,
                'is-completed': true,
              },
            },
          ],
        },
      },
      headers: {},
      url: `/api/sessions/${session.id}/finalization`,
    };

    return databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /sessions/{id}/finalization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 Forbidden if the user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 404 NotFound the if user is not authorized (to keep opacity on whether forbidden or not found)', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();
        options.headers.authorization = generateValidRequestAuthorizationHeader(userId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        await knex('certification-issue-reports').delete();
        await knex('finalized-sessions').delete();
        await knex('competence-marks').delete();
        await knex('assessment-results').delete();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond OK', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCertificationCenterMembership({
          userId,
          certificationCenterId: session.certificationCenterId,
        });

        await databaseBuilder.commit();
        options.headers.authorization = generateValidRequestAuthorizationHeader(userId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update session', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCertificationCenterMembership({
          userId,
          certificationCenterId: session.certificationCenterId,
        });

        await databaseBuilder.commit();
        options.headers.authorization = generateValidRequestAuthorizationHeader(userId);

        // when
        await server.inject(options);

        // then
        const finalizedSession = await knex.from('sessions').where({ id: session.id }).first();
        expect(finalizedSession.hasIncident).to.be.true;
        expect(finalizedSession.hasJoiningIssue).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should neutralize auto-neutralizable challenges', async function () {
        // given
        const learningContent = [
          {
            id: 'recArea0',
            code: '66',
            competences: [
              {
                id: 'recCompetence0',
                index: '1',
                tubes: [
                  {
                    id: 'recTube0_0',
                    skills: [
                      {
                        id: 'recSkill0_0',
                        nom: '@recSkill0_0',
                        challenges: [{ id: 'recChallenge0_0_0' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        const userId = databaseBuilder.factory.buildUser().id;
        const session = databaseBuilder.factory.buildSession();
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ sessionId: session.id }).id;
        databaseBuilder.factory.buildCertificationCenterMembership({
          userId,
          certificationCenterId: session.certificationCenterId,
        });
        const report = databaseBuilder.factory.buildCertificationReport({
          certificationCourseId,
          sessionId: session.id,
        });

        const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId }).id;
        databaseBuilder.factory.buildCertificationIssueReport({
          certificationCourseId,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          description: '',
          subcategory: CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
          questionNumber: 1,
        });

        const certificationChallengeKo = databaseBuilder.factory.buildCertificationChallenge({
          courseId: certificationCourseId,
          isNeutralized: false,
        });
        const certificationChallengeOk = databaseBuilder.factory.buildCertificationChallenge({
          courseId: certificationCourseId,
          isNeutralized: false,
        });

        databaseBuilder.factory.buildAnswer({
          assessmentId,
          challengeId: certificationChallengeKo.challengeId,
          result: AnswerStatus.KO.status,
        });
        databaseBuilder.factory.buildAnswer({
          assessmentId,
          challengeId: certificationChallengeOk.challengeId,
          result: AnswerStatus.OK.status,
        });

        await databaseBuilder.commit();

        options = {
          method: 'PUT',
          payload: {
            data: {
              attributes: {
                'examiner-global-comment': examinerGlobalComment,
                'has-incident': true,
                'has-joining-issue': true,
              },
              included: [
                {
                  id: report.id,
                  type: 'certification-reports',
                  attributes: {
                    'certification-course-id': report.certificationCourseId,
                    'examiner-comment': 'What a fine lad this one',
                    'has-seen-end-test-screen': false,
                    'is-completed': true,
                  },
                },
              ],
            },
          },
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
          },
          url: `/api/sessions/${session.id}/finalization`,
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        const actualKoCertificationChallenge = await knex('certification-challenges')
          .where({ id: certificationChallengeKo.id })
          .first();
        const actualOkCertificationChallenge = await knex('certification-challenges')
          .where({ id: certificationChallengeOk.id })
          .first();
        expect(actualKoCertificationChallenge.isNeutralized).to.be.true;
        expect(actualOkCertificationChallenge.isNeutralized).to.be.false;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should set the finalized session as publishable when the issue reports have been resolved', async function () {
        // given
        const learningContent = [
          {
            id: 'recArea0',
            code: '66',
            competences: [
              {
                id: 'recCompetence0',
                index: '1',
                tubes: [
                  {
                    id: 'recTube0_0',
                    skills: [
                      {
                        id: 'recSkill0_0',
                        nom: '@recSkill0_0',
                        challenges: [{ id: 'recChallenge0_0_0' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        const userId = databaseBuilder.factory.buildUser().id;
        const session = databaseBuilder.factory.buildSession();
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
          sessionId: session.id,
          completedAt: new Date(),
        }).id;
        databaseBuilder.factory.buildCertificationCenterMembership({
          userId,
          certificationCenterId: session.certificationCenterId,
        });
        const report = databaseBuilder.factory.buildCertificationReport({
          certificationCourseId,
          sessionId: session.id,
        });

        const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId }).id;
        databaseBuilder.factory.buildCertificationIssueReport({
          certificationCourseId,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          description: '',
          subcategory: CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
          questionNumber: 1,
        });

        databaseBuilder.factory.buildAssessmentResult({ assessmentId });

        const certificationChallenge = databaseBuilder.factory.buildCertificationChallenge({
          courseId: certificationCourseId,
          isNeutralized: false,
        });
        databaseBuilder.factory.buildAnswer({
          assessmentId,
          challengeId: certificationChallenge.challengeId,
          result: AnswerStatus.KO.status,
        });

        await databaseBuilder.commit();

        options = {
          method: 'PUT',
          payload: {
            data: {
              attributes: {
                'examiner-global-comment': '',
                'has-incident': true,
                'has-joining-issue': true,
              },
              included: [
                {
                  id: report.id,
                  type: 'certification-reports',
                  attributes: {
                    'certification-course-id': report.certificationCourseId,
                    'examiner-comment': 'What a fine lad this one',
                    'has-seen-end-test-screen': true,
                    'is-completed': true,
                  },
                },
              ],
            },
          },
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
          },
          url: `/api/sessions/${session.id}/finalization`,
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        const finalizedSession = await knex('finalized-sessions').where({ sessionId: session.id }).first();
        expect(finalizedSession.isPublishable).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should re score assessment when there is auto-neutralizable challenge', async function () {
        // given

        const learningContent = [
          {
            id: 'recArea0',
            code: '66',
            competences: [
              {
                id: 'recCompetence0',
                index: '1',
                tubes: [
                  {
                    id: 'recTube0_0',
                    skills: [
                      {
                        id: 'recSkill0_0',
                        nom: '@recSkill0_0',
                        challenges: [{ id: 'recChallenge0_0_0' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        const userId = databaseBuilder.factory.buildUser().id;
        const session = databaseBuilder.factory.buildSession();
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
          sessionId: session.id,
          userId,
          createdAt: new Date(),
        }).id;
        databaseBuilder.factory.buildCertificationCenterMembership({
          userId,
          certificationCenterId: session.certificationCenterId,
        });

        const report = databaseBuilder.factory.buildCertificationReport({
          certificationCourseId,
          sessionId: session.id,
        });

        const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId, userId }).id;
        databaseBuilder.factory.buildCertificationIssueReport({
          certificationCourseId,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          description: '',
          subcategory: CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
          questionNumber: 1,
        });

        const assessmentResultKo = databaseBuilder.factory.buildAssessmentResult({
          assessmentId,
          pixScore: 42,
        });

        databaseBuilder.factory.buildCompetenceMark({
          assessmentResultId: assessmentResultKo.id,
          competenceId: 'recCompetence0',
        });

        const certificationChallengeKo = databaseBuilder.factory.buildCertificationChallenge({
          courseId: certificationCourseId,
          isNeutralized: false,
          challengeId: 'recChallenge0_0_0',
          competenceId: 'recCompetence0',
        });

        const answerId = databaseBuilder.factory.buildAnswer({
          assessmentId,
          challengeId: certificationChallengeKo.challengeId,
          result: AnswerStatus.KO.status,
        }).id;

        databaseBuilder.factory.buildKnowledgeElement({
          assessmentId,
          answerId,
          skillId: 'recSkill0_0',
          competenceId: 'recCompetence0',
          userId,
          earnedPix: 16,
        });

        await databaseBuilder.commit();

        options = {
          method: 'PUT',
          payload: {
            data: {
              attributes: {
                'examiner-global-comment': examinerGlobalComment,
                'has-incident': true,
                'has-joining-issue': true,
              },
              included: [
                {
                  id: report.id,
                  type: 'certification-reports',
                  attributes: {
                    'certification-course-id': report.certificationCourseId,
                    'examiner-comment': 'What a fine lad this one',
                    'has-seen-end-test-screen': false,
                    'is-completed': true,
                  },
                },
              ],
            },
          },
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
          },
          url: `/api/sessions/${session.id}/finalization`,
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        const actualKoAssessmentResult = await knex('assessment-results')
          .where({ assessmentId, emitter: CertificationResult.emitters.PIX_ALGO_AUTO_JURY })
          .first();
        expect(actualKoAssessmentResult.pixScore).not.to.equal(assessmentResultKo.pixScore);
      });
    });
  });
});
