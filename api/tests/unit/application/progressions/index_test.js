const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const moduleUnderTest = require('../../../../lib/application/progressions');

const progressionController = require('../../../../lib/application/progressions/progression-controller');

describe('Unit | Application | Router | progression-router', () => {

  describe('GET /api/progressions/{id}', function() {

    it('should return 200', async () => {
      // given
      sinon.stub(progressionController, 'get').returns('ok');
      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);

      // when
      const response = await httpTestServer.request('GET', '/api/progressions/1');

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
