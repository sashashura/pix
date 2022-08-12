// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, HttpTestServer } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, UserNotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/account-recovery');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Account-Recovery | account-recovery-controller', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon.stub(usecases, 'getAccountRecoveryDetails');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkAccountRecoveryDemand', function () {
    const method = 'GET';
    const url = '/api/account-recovery/FfgpFXgyuO062nPUPwcb8Wy3KcgkqR2p2GyEuGVaNI4';

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 200', async function () {
        // given
        usecases.getAccountRecoveryDetails.resolves({ id: 1, email: 'email@example.net', firstName: 'Gertrude' });

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when TemporaryKey not found', async function () {
        // given
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        usecases.getAccountRecoveryDetails.rejects(new NotFoundError());

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond an HTTP response with status code 404 when UserNotFoundError', async function () {
        // given
        usecases.getAccountRecoveryDetails.rejects(new UserNotFoundError());

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });
  });
});
