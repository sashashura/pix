// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/prescribers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Prescribers | prescriber-controller', function () {
  let sandbox: $TSFixMe;
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(securityPreHandlers, 'checkRequestedUserIsAuthenticatedUser');
    sandbox.stub(usecases, 'getPrescriber');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sandbox.restore();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    const method = 'GET';
    const url = '/api/prescription/prescribers/1234';
    const auth = { credentials: {}, strategy: {} };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.returns(true);
        (auth.credentials as $TSFixMe).userId = '1234';
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        const prescriber = domainBuilder.buildPrescriber();
        usecases.getPrescriber.resolves(prescriber);

        // when
        const response = await httpTestServer.request(method, url, null, auth);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => {
          return Promise.resolve(h.response().code(403).takeover());
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 403 HTTP response', async function () {
        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
