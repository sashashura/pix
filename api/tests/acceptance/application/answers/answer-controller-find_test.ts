// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | answer-controller-find', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/answers?challengeId=Y&assessmentId=Z', function () {
    let server: $TSFixMe;
    let options: $TSFixMe;
    let userId;
    let answer: $TSFixMe;
    const challengeId = 'recLt9uwa2dR3IYpi';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessmentid passed in query param is not an integer', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        userId = databaseBuilder.factory.buildUser().id;
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers?challengeId=${challengeId}&assessmentId=salut`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return no answer', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.result.data).to.be.null;
      });
    });

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
          challengeId,
        });
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers?challengeId=${challengeId}&assessmentId=${assessment.id}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return application/json', async function () {
        // when
        const response = await server.inject(options);

        // then
        const contentType = response.headers['content-type'];
        expect(contentType).to.contain('application/json');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return required answer', async function () {
        // when
        const response = await server.inject(options);

        // then
        const answerReceived = response.result.data;
        expect(answerReceived.id).to.equal(answer.id.toString());
        expect(answerReceived.attributes.value.toString()).to.equal(answer.value.toString());
        expect(answerReceived.attributes.result.toString()).to.equal(answer.result.toString());
        expect(answerReceived.relationships.assessment.data.id.toString()).to.equal(answer.assessmentId.toString());
        expect(answerReceived.relationships.challenge.data.id.toString()).to.equal(answer.challengeId.toString());
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment has an userId but the user is not the relevant user', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        userId = databaseBuilder.factory.buildUser().id;
        const assessment = databaseBuilder.factory.buildAssessment({ userId, type: 'COMPETENCE_EVALUATION' });
        answer = databaseBuilder.factory.buildAnswer({
          assessmentId: assessment.id,
          value: '1.2',
          result: 'ok',
          challengeId,
        });
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers?challengeId=${challengeId}&assessmentId=${assessment.id}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId + 3) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return no answer', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.result.data).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment is demo and there is no userId', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        const assessment = databaseBuilder.factory.buildAssessment({ userId: null, type: 'DEMO' });
        databaseBuilder.factory.buildAnswer({ assessmentId: assessment.id, value: '1.2', result: 'ok', challengeId });
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers?challengeId=${challengeId}&assessmentId=${assessment.id}`,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/answers?assessment=12323', function () {
    let server: $TSFixMe;
    let options: $TSFixMe;
    let userId;
    let answers: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment has an userId (is not a demo or preview)', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        userId = databaseBuilder.factory.buildUser().id;
        const assessment = databaseBuilder.factory.buildAssessment({ userId, type: 'COMPETENCE_EVALUATION' });
        answers = [
          databaseBuilder.factory.buildAnswer({ assessmentId: assessment.id, challengeId: 'rec1' }),
          databaseBuilder.factory.buildAnswer({ assessmentId: assessment.id, challengeId: 'rec2' }),
        ];
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers?assessmentId=${assessment.id}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return application/json', async function () {
        // when
        const response = await server.inject(options);

        // then
        const contentType = response.headers['content-type'];
        expect(contentType).to.contain('application/json');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return required answers', async function () {
        // when
        const response = await server.inject(options);

        // then
        const answerReceived = response.result.data;
        expect(answerReceived.length).to.equal(2);
        expect(answerReceived[0].type).to.equal('answers');
        expect(answerReceived[1].type).to.equal('answers');
        expect([answerReceived[0].id, answerReceived[1].id]).to.have.members([
          answers[0].id.toString(),
          answers[1].id.toString(),
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment has an userId but the user is not the relevant user', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        userId = databaseBuilder.factory.buildUser().id;
        const assessment = databaseBuilder.factory.buildAssessment({ userId, type: 'COMPETENCE_EVALUATION' });
        answers = [databaseBuilder.factory.buildAnswer({ assessmentId: assessment.id, value: '1.2', result: 'ok' })];
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers?assessmentId=${assessment.id}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId + 3) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 403 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment is demo and there is no userId', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();
        const assessment = databaseBuilder.factory.buildAssessment({ userId: null, type: 'DEMO' });
        databaseBuilder.factory.buildAnswer({ assessmentId: assessment.id, value: '1.2', result: 'ok' });
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/answers?&assessmentId=${assessment.id}`,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
