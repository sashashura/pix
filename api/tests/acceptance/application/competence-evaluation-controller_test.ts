// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Competence Evaluations', function () {
  let server: $TSFixMe;
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    await databaseBuilder.commit();
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/competence-evaluations/start-or-resume', function () {
    const competenceId = 'recABCD123';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user is authenticated', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: competenceId,
                tubes: [],
              },
            ],
          },
        ];

        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        await knex('competence-evaluations').delete();
        await knex('assessments').delete();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and competence exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 201 and the competence evaluation when it has been successfully created', async function () {
          // when
          const options = {
            method: 'POST',
            url: '/api/competence-evaluations/start-or-resume',
            headers: {
              authorization: generateValidRequestAuthorizationHeader(userId),
            },
            payload: { competenceId },
          };
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(201);
          expect(response.result.data.id).to.exist;
          expect(response.result.data.attributes['assessment-id']).to.be.not.null;
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 200 and the competence evaluation when it has been successfully found', async function () {
          // given
          const options = {
            method: 'POST',
            url: '/api/competence-evaluations/start-or-resume',
            headers: {
              authorization: generateValidRequestAuthorizationHeader(userId),
            },
            payload: { competenceId },
          };
          databaseBuilder.factory.buildCompetenceEvaluation({ competenceId, userId });
          await databaseBuilder.commit();

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result.data.id).to.exist;
          expect(response.result.data.attributes['assessment-id']).to.be.not.null;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and competence does not exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 404 error', async function () {
          // given
          const options = {
            method: 'POST',
            url: '/api/competence-evaluations/start-or-resume',
            headers: {
              authorization: generateValidRequestAuthorizationHeader(userId),
            },
            payload: { competenceId: 'WRONG_ID' },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user is not authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401 error', async function () {
        // given
        const options = {
          method: 'POST',
          url: '/api/competence-evaluations/start-or-resume',
          headers: {
            authorization: null,
          },
          payload: { competenceId },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
