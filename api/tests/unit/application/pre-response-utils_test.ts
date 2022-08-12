// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, hFake } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'errorManag... Remove this comment to see the full error message
const errorManager = require('../../../lib/application/error-manager');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BaseHttpEr... Remove this comment to see the full error message
const { BaseHttpError } = require('../../../lib/application/http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handleDoma... Remove this comment to see the full error message
const { handleDomainAndHttpErrors } = require('../../../lib/application/pre-response-utils');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainErro... Remove this comment to see the full error message
const { DomainError } = require('../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | PreResponse-utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handleDomainAndHttpErrors', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(errorManager, 'handle').resolves();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should continue the process when not DomainError or BaseHttpError', async function () {
      // given
      const request = {
        response: {
          statusCode: 200,
        },
      };
      const expectedString = 'Symbol(continue)';

      // when
      const response = await handleDomainAndHttpErrors(request, hFake);

      // then
      expect(typeof response).to.be.equal('symbol');
      expect(response.toString()).to.be.equal(expectedString);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should manage DomainError', async function () {
      const request = {
        response: new DomainError('Error message'),
      };

      // when
      await handleDomainAndHttpErrors(request, hFake);

      // then
      expect(errorManager.handle).to.have.been.calledWithExactly(request, hFake, request.response);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should manage BaseHttpError', async function () {
      const request = {
        response: new BaseHttpError('Error message'),
      };

      // when
      await handleDomainAndHttpErrors(request, hFake);

      // then
      expect(errorManager.handle).to.have.been.calledWithExactly(request, hFake, request.response);
    });
  });
});
