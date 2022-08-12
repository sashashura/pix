// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const split = require('split2');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const writeStream = require('flush-write-stream');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, generateValidRequestAuthorizationHeader, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const pinoPlugin = require('../../../../lib/infrastructure/plugins/pino');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('../../../../lib/infrastructure/monitoring-tools');

function sink(func: $TSFixMe) {
  const result = split(JSON.parse);
  result.pipe(writeStream.obj(func));
  return result;
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | plugins | pino', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    httpTestServer = new HttpTestServer();
    await httpTestServer.register({
      register: (server: $TSFixMe) => {
        server.route([
          {
            method: 'GET',
            path: '/',
            config: {
              handler: () => {
                monitoringTools.incrementInContext('metrics.knexQueryCount');
                return { cou: 'cou' };
              },
            },
          },
        ]);
      },
      name: 'test-api',
    });
  });

  async function registerWithPlugin(cb: $TSFixMe) {
    const pinoPluginWithLogger = {
      ...pinoPlugin,
      options: {
        ...pinoPlugin.options,
        instance: undefined,
        level: 'info',
        stream: sink(cb),
      },
    };
    await httpTestServer.register([pinoPluginWithLogger]);
  }

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('with request monitoring disabled', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(config.hapi, 'enableRequestMonitoring').value(false);
      monitoringTools.installHapiHook();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should log version', async function () {
      // given
      let finish: $TSFixMe;

      const done = new Promise(function (resolve) {
        finish = resolve;
      });
      const messages: $TSFixMe = [];
      await registerWithPlugin((data: $TSFixMe) => {
        messages.push(data);
        finish();
      });

      const method = 'GET';
      const url = '/';

      // when
      const response = await httpTestServer.request(method, url);
      await done;

      // then
      expect(response.statusCode).to.equal(200);
      expect(messages).to.have.lengthOf(1);
      expect(messages[0].req.version).to.equal('development');
      expect(messages[0].req.user_id).to.be.undefined;
      expect(messages[0].req.route).to.be.undefined;
      expect(messages[0].req.metrics).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('with request monitoring enabled', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(config.hapi, 'enableRequestMonitoring').value(true);
      monitoringTools.installHapiHook();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should log version, user id, route and metrics', async function () {
      // given
      let finish: $TSFixMe;

      const done = new Promise(function (resolve) {
        finish = resolve;
      });
      const messages: $TSFixMe = [];
      await registerWithPlugin((data: $TSFixMe) => {
        messages.push(data);
        finish();
      });

      const method = 'GET';
      const url = '/';
      const headers = {
        authorization: generateValidRequestAuthorizationHeader(),
      };

      // when
      const response = await httpTestServer.request(method, url, null, null, headers);
      await done;

      // then
      expect(response.statusCode).to.equal(200);
      expect(messages).to.have.lengthOf(1);
      expect(messages[0].req.version).to.equal('development');
      expect(messages[0].req.user_id).to.equal(1234);
      expect(messages[0].req.route).to.equal('/');
      expect(messages[0].req.metrics).to.deep.equal({ knexQueryCount: 1 });
    });
  });
});
