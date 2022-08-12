// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BookshelfA... Remove this comment to see the full error message
const BookshelfAssessment = require('../../../../lib/infrastructure/orm-models/Assessment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Assessments POST', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/assessments', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('assessments').delete();
      return knex('users').delete();
    });

    let options: $TSFixMe;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser().id;
      options = {
        method: 'POST',
        url: '/api/assessments',
        payload: {
          data: {
            type: 'assessment',
            attributes: {
              type: 'DEMO',
            },
            relationships: {
              course: {
                data: {
                  type: 'course',
                  id: 'non_adaptive_course_id',
                },
              },
              user: {
                data: {
                  type: 'users',
                  id: userId,
                },
              },
            },
          },
        },
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 HTTP status code', function () {
      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(201);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 HTTP status code when missing authorization header', function () {
      // given
      options.headers = {};

      // when
      const promise = server.inject(options);

      // given
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(201);
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

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the user is authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save user_id in the database', function () {
        // given
        options.payload.data.relationships.user.id = userId;

        // when
        const promise = server.inject(options);

        // then
        return promise
          .then((response: $TSFixMe) => {
            return new BookshelfAssessment({ id: response.result.data.id }).fetch();
          })
          .then((model: $TSFixMe) => {
            expect(parseInt(model.get('userId'))).to.deep.equal(userId);
          });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should add a new assessment into the database', function () {
        // when
        const promise = server.inject(options);

        // then
        return promise.then(() => {
          return BookshelfAssessment.count().then((afterAssessmentsNumber: $TSFixMe) => {
            expect(parseInt(afterAssessmentsNumber, 10)).to.equal(1);
          });
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return persisted Assessment', function () {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          const assessment = response.result.data;
          expect(assessment.id).to.exist;
          expect(assessment.attributes['user-id']).to.equal(options.payload.data.attributes['user-id']);
          expect(assessment.relationships.course.data.id).to.equal(options.payload.data.relationships.course.data.id);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('when the user is not authenticated', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should persist the given course ID', function () {
          // when
          const promise = server.inject(options);

          // then
          return promise
            .then((response: $TSFixMe) => {
              return new BookshelfAssessment({ id: response.result.data.id }).fetch();
            })
            .then((model: $TSFixMe) => {
              expect(model.get('courseId')).to.equal(options.payload.data.relationships.course.data.id);
            });
        });
      });
    });
  });
});
