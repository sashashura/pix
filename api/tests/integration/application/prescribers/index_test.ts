// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'prescriber... Remove this comment to see the full error message
const prescriberController = require('../../../../lib/application/prescribers/prescriber-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/prescribers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Prescribers | Routes', function () {
  let httpTestServer: $TSFixMe;
  const method = 'GET';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(securityPreHandlers, 'checkRequestedUserIsAuthenticatedUser');

    sinon.stub(prescriberController, 'get').returns('ok');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/prescription/prescribers/{id}', function () {
    const auth = { credentials: {}, strategy: {} };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
(auth.credentials as $TSFixMe).userId = '1234';
      securityPreHandlers.checkRequestedUserIsAuthenticatedUser.callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));
      const url = '/api/prescription/prescribers/123';

      // when
      const response = await httpTestServer.request(method, url, null, auth);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 400 when id in param is not a number"', async function () {
      // given
      const url = '/api/prescription/prescribers/NOT_A_NUMBER';

      // when
      const response = await httpTestServer.request(method, url);

      // then
      expect(response.statusCode).to.equal(400);
    });
  });
});
