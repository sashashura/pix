const {
  expect,
  databaseBuilder,
  generateValidRequestAuthorizationHeader,
  insertUserWithRolePixMaster,
  sinon,
} = require('../../../test-helper');
const createServer = require('../../../../server');
const { featureToggles } = require('../../../../lib/config');

describe('Acceptance | Controller | session-for-supervising-controller-get', function () {
  let server, options;

  beforeEach(async function () {
    server = await createServer();
    await insertUserWithRolePixMaster();
  });

  describe('GET /api/sessions/{id}/supervising', function () {
    beforeEach(function () {
      databaseBuilder.factory.buildCertificationCenter({ id: 345 });
      databaseBuilder.factory.buildSession({ id: 121, certificationCenterId: 345 });
      databaseBuilder.factory.buildCertificationCandidate({ sessionId: 121 });
      options = {
        method: 'GET',
        url: '/api/sessions/121/supervising',
        payload: {},
      };
      return databaseBuilder.commit();
    });

    context('when FT_IS_END_TEST_SCREEN_REMOVAL_ENABLED is enabled', function () {
      beforeEach(function () {
        options.headers = { authorization: generateValidRequestAuthorizationHeader() };
      });

      it('should return a 200 status code response with JSON API serialized', async function () {
        // when
        sinon.stub(featureToggles, 'isEndTestScreenRemovalEnabled').value(true);
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.type).to.equal('sessionForSupervisings');
      });
    });

    context('when FT_IS_END_TEST_SCREEN_REMOVAL_ENABLED is not enabled', function () {
      it('should return 404 HTTP status code ', async function () {
        options.headers = { authorization: generateValidRequestAuthorizationHeader(1111) };
        sinon.stub(featureToggles, 'isEndTestScreenRemovalEnabled').value(false);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });
});
