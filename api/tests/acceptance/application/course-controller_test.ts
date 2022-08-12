const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'nock'.
  nock,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Courses', function () {
  let server: $TSFixMe;
  const userId = 42;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/courses/:course_id', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const learningContent = [
        {
          id: '1. Information et données',
          competences: [
            {
              id: 'competence_id',
              tubes: [
                {
                  id: 'recTube1',
                  skills: [
                    {
                      challenges: [{ id: 'k_challenge_id' }],
                    },
                  ],
                },
              ],
            },
          ],
          courses: [
            {
              id: 'rec_course_id',
              name: "A la recherche de l'information #01",
              description: "Mener une recherche et une veille d'information",
              competenceId: 'competence_id',
              challengeIds: ['k_challenge_id'],
            },
          ],
        },
      ];

      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);
    });

    // @ts-expect-error TS(2304): Cannot find name 'after'.
    after(function () {
      nock.cleanAll();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the course exists', function () {
      let options: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options = {
          method: 'GET',
          url: '/api/courses/rec_course_id',
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
          },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', function () {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(200);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return application/json', function () {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          const contentType = response.headers['content-type'];
          expect(contentType).to.contain('application/json');
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the expected course', function () {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          const course = response.result.data;
          expect(course.id).to.equal('rec_course_id');
          expect(course.attributes.name).to.equal("A la recherche de l'information #01");
          expect(course.attributes.description).to.equal("Mener une recherche et une veille d'information");
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the course does not exist', function () {
      let options: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options = {
          method: 'GET',
          url: '/api/courses/rec_i_dont_exist',
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 404 HTTP status code', function () {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(404);
        });
      });
    });
  });
});
