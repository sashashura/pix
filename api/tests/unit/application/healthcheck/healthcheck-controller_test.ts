// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'redisMonit... Remove this comment to see the full error message
const redisMonitor = require('../../../../lib/infrastructure/utils/redis-monitor');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'healthchec... Remove this comment to see the full error message
const healthcheckController = require('../../../../lib/application/healthcheck/healthcheck-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | healthcheckController', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with the API description', async function () {
      // when
      const mockedRequest = { i18n: { __: sinon.stub() } };

      const response = await healthcheckController.get(mockedRequest, hFake);

      // then
      expect(response).to.include.keys('name', 'version', 'description');
      expect(response['name']).to.equal('pix-api');
      expect(response['description']).to.equal(
        "Plateforme d'évaluation et de certification des compétences numériques"
      );
      expect(response['environment']).to.equal('test');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkDbStatus', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(knex, 'raw');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should check if DB connection is successful', async function () {
      // given
      knex.raw.resolves();

      // when
      const response = await healthcheckController.checkDbStatus();

      // then
      expect(response).to.include.keys('message');
      expect(response['message']).to.equal('Connection to database ok');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with a 503 error when the connection with the database is KO', function () {
      // given
      knex.raw.rejects();

      // when
      const promise = healthcheckController.checkDbStatus(null, hFake);

      // then
      expect(promise).to.be.rejectedWith(/Connection to database failed/);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkRedisStatus', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(redisMonitor, 'ping');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should check if Redis connection is successful', async function () {
      // given
      redisMonitor.ping.resolves();

      // when
      const response = await healthcheckController.checkRedisStatus();

      // then
      expect(response).to.include.keys('message');
      expect(response['message']).to.equal('Connection to Redis ok');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with a 503 error when the connection with Redis is KO', function () {
      // given
      redisMonitor.ping.rejects();

      // when
      const promise = healthcheckController.checkRedisStatus(null, hFake);

      // then
      return expect(promise)
        .to.be.eventually.rejectedWith(/Connection to Redis failed/)
        .and.have.nested.property('output.statusCode', 503);
    });
  });
});
