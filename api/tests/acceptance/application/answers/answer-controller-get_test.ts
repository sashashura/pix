// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | answer-controller-get', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/answers/:id', function () {
    let server: $TSFixMe;
    let options: $TSFixMe;
    let userId;
    let answer: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment has an userId (is not a demo or preview)', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        userId = databaseBuilder.factory.buildUser().id;
        const assessment = databaseBuilder.factory.buildAssessment({ userId, type: 'COMPETENCE_EVALUATION' });
        answer = databaseBuilder.factory.buildAnswer({
          assessmentId: assessment.id,
          value: '1.2',
          result: 'ok',
          challengeId: 'rec1',
        });
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers/${answer.id}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // given
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return application/json', async function () {
        // when
        const response = await server.inject(options);

        // given
        const contentType = response.headers['content-type'];
        expect(contentType).to.contain('application/json');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return required answer', async function () {
        // when
        const response = await server.inject(options);

        // given
        const answerReceived = response.result.data;
        expect(answerReceived.id).to.equal(answer.id.toString());
        expect(answerReceived.attributes.value.toString()).to.equal(answer.value.toString());
        expect(answerReceived.attributes.result.toString()).to.equal(answer.result.toString());
        expect(answerReceived.relationships.assessment.data.id.toString()).to.equal(answer.assessmentId.toString());
        expect(answerReceived.relationships.challenge.data.id.toString()).to.equal(answer.challengeId.toString());
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the id of the answer is not an integer', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        userId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: '/api/answers/salut',
          headers: { authorization: generateValidRequestAuthorizationHeader(userId + 1) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 400 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // given
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment has an userId but the user is not the relevant user', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        userId = databaseBuilder.factory.buildUser().id;
        const assessment = databaseBuilder.factory.buildAssessment({ userId, type: 'COMPETENCE_EVALUATION' });
        const answer = databaseBuilder.factory.buildAnswer({
          assessmentId: assessment.id,
          value: '1.2',
          result: 'ok',
          challengeId: 'rec1',
        });
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers/${answer.id}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId + 1) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 404 HTTP status code', function () {
        // when
        const promise = server.inject(options);

        // given
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(404);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment is demo and there is no userId', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        const assessment = databaseBuilder.factory.buildAssessment({ userId: null, type: 'DEMO' });
        const answer = databaseBuilder.factory.buildAnswer({
          assessmentId: assessment.id,
          value: '1.2',
          result: 'ok',
          challengeId: 'rec1',
        });
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers/${answer.id}`,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // given
        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
