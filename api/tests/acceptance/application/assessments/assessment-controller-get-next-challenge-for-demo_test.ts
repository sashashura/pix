// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, learningContentBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | assessment-controller-get-next-challenge-for-demo', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    const learningContent = [
      {
        id: '1. Information et données',
        competences: [
          {
            id: 'competence_id',
            nameFrFr: "Mener une recherche et une veille d'information",
            index: '1.1',
            tubes: [
              {
                id: 'recTube0_0',
                skills: [
                  {
                    id: '@web1',
                    nom: '@web1',
                    challenges: [{ id: 'first_challenge' }, { id: 'second_challenge' }, { id: 'third_challenge' }],
                  },
                ],
              },
            ],
          },
        ],
        courses: [
          {
            id: 'course_id',
            competenceId: 'competence_id',
            challengeIds: ['first_challenge', 'second_challenge'],
          },
        ],
      },
    ];

    const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
    mockLearningContent(learningContentObjects);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('(demo) GET /api/assessments/:assessment_id/next', function () {
    const assessmentId = 1;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no challenge is answered', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildAssessment({
          id: assessmentId,
          type: 'DEMO',
          courseId: 'course_id',
        });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', function () {
        // given
        const options = {
          method: 'GET',
          url: '/api/assessments/' + assessmentId + '/next',
        };

        // when
        return server.inject(options).then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(200);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return application/json', function () {
        // given
        const options = {
          method: 'GET',
          url: '/api/assessments/' + assessmentId + '/next',
        };

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          const contentType = response.headers['content-type'];
          expect(contentType).to.contain('application/json');
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the first challenge if none already answered', function () {
        // given
        const options = {
          method: 'GET',
          url: '/api/assessments/' + assessmentId + '/next',
        };

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.result.data.id).to.equal('first_challenge');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the first challenge is already answered', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildAssessment({
          id: assessmentId,
          type: 'DEMO',
          courseId: 'course_id',
        });
        databaseBuilder.factory.buildAnswer({ challengeId: 'first_challenge', assessmentId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the second challenge', async function () {
        // given
        const options = {
          method: 'GET',
          url: '/api/assessments/' + assessmentId + '/next',
        };

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.result.data.id).to.equal('second_challenge');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all challenges are answered', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        databaseBuilder.factory.buildAssessment({
          id: assessmentId,
          type: 'DEMO',
          courseId: 'course_id',
        });
        databaseBuilder.factory.buildAnswer({ challengeId: 'first_challenge', assessmentId });
        databaseBuilder.factory.buildAnswer({ challengeId: 'second_challenge', assessmentId });
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should finish the test', async function () {
        // given
        const options = {
          method: 'GET',
          url: '/api/assessments/' + assessmentId + '/next',
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: null,
        });
      });
    });
  });
});
