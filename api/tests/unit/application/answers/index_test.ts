// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/answers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerCont... Remove this comment to see the full error message
const answerController = require('../../../../lib/application/answers/answer-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'features'.
const { features } = require('../../../../lib/config');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Router | answer-router', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/answers', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201', async function () {
      // given
      sinon.stub(answerController, 'save').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      const payload = {
        data: {
          attributes: {
            value: 'test',
            result: null,
            'result-details': null,
            timeout: null,
          },
          relationships: {},
          assessment: {},
          challenge: {},
          type: 'answers',
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/answers', payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return BAD_REQUEST with message if answer length is too long but does not (security issue)', async function () {
      // given
      sinon.stub(answerController, 'save').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response().created());
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const value = 'X'.repeat(features.userAnswersMaxLength + 1);

      const payload = {
        data: {
          attributes: {
            value,
            result: null,
            'result-details': null,
            timeout: null,
          },
          relationships: {},
          assessment: {},
          challenge: {},
          type: 'answers',
        },
      };

      // when
      const response = await httpTestServer.request('POST', '/api/answers', payload);

      // then
      expect(response.statusCode).to.not.equal(400);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/answers/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      //given
      sinon.stub(answerController, 'get').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/answers/1');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/answers/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204', async function () {
      // given
      sinon.stub(answerController, 'update').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(204));
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('PATCH', '/api/answers/1');

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/answers', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200', async function () {
      // given
      sinon.stub(answerController, 'find').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/answers');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
