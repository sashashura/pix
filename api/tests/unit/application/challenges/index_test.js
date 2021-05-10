const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const moduleUnderTest = require('../../../../lib/application/challenges');

const challengeController = require('../../../../lib/application/challenges/challenge-controller');

describe('Unit | Application | Router | challenge-router', () => {

  describe('GET /api/challenges/{id}', () => {

    it('should return 200', async () => {
      // given
      sinon.stub(challengeController, 'get').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/challenges/1');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
