// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'HttpTestSe... Remove this comment to see the full error message
const HttpTestServer = require('../../tooling/server/http-test-server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Tooling | Http-test-server', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    let server: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'before'.
    before(function () {
      server = new HttpTestServer();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create hapi server', function () {
      // then
      expect(server.hapiServer).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Should use pre-response-utils function', function () {
      // then
      expect(server.hapiServer._core.extensions.route.onPreResponse.nodes[0].func.name).to.equal(
        'handleDomainAndHttpErrors'
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#register', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw error if route is invalid', async function () {
      const invalidRoute = {
        name: 'foo-route',
        register: async function (server: $TSFixMe) {
          server.route([
            {
              method: 'GET',
            },
          ]);
        },
      };

      const server = new HttpTestServer();

      let registerError;
      try {
        await server.register(invalidRoute);
      } catch (error) {
        registerError = error;
      }

      expect((registerError as $TSFixMe).message).to.contain('Invalid route options (GET )');
    });
  });
});
