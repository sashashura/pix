// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder, knex } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
const { MAX_REACHABLE_PIX_BY_COMPETENCE } = require('../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Improve Competence Evaluation', function () {
  let server: $TSFixMe;
  let userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    await databaseBuilder.commit();
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/competence-evaluations/improve', function () {
    const competenceId = 'recABCD123';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user is authenticated', function () {
      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        await knex('competence-evaluations').delete();
        await knex('knowledge-elements').delete();
        await knex('answers').delete();
        await knex('assessments').delete();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and competence exists', function () {
        let response: $TSFixMe, assessment: $TSFixMe;

        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          databaseBuilder.factory.buildCompetenceEvaluation({ competenceId, userId });
          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('and user has not reached maximum level of given competence', function () {
          // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
          beforeEach(async function () {
            // given
            const options = {
              method: 'PUT',
              url: '/api/competence-evaluations/improve',
              headers: {
                authorization: generateValidRequestAuthorizationHeader(userId),
              },
              payload: { competenceId },
            };

            await databaseBuilder.commit();

            // when
            response = await server.inject(options);
            assessment = response.result.data.relationships.assessment.data;
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return 200 and the competence evaluation', async function () {
            // then
            expect(response.statusCode).to.equal(200);
            expect(response.result.data.id).to.exist;
            expect(assessment.id).to.be.not.null;
            expect(assessment).to.exist;
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should create an improving assessment', async function () {
            // then
            const [createdAssessment] = await knex('assessments').select().where({ id: assessment.id });
            expect(createdAssessment.isImproving).to.equal(true);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('and user has reached maximum level of given competence', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return 403 error', async function () {
            // given
            databaseBuilder.factory.buildKnowledgeElement({
              earnedPix: MAX_REACHABLE_PIX_BY_COMPETENCE,
              competenceId,
              userId,
            });
            await databaseBuilder.commit();

            const options = {
              method: 'PUT',
              url: '/api/competence-evaluations/improve',
              headers: {
                authorization: generateValidRequestAuthorizationHeader(userId),
              },
              payload: { competenceId },
            };

            // when
            response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(403);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and competence evaluation does not exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 404 error', async function () {
          // given
          const options = {
            method: 'PUT',
            url: '/api/competence-evaluations/improve',
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
          method: 'PUT',
          url: '/api/competence-evaluations/improve',
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
