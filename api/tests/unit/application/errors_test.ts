// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BaseHttpEr... Remove this comment to see the full error message
const { BaseHttpError, MissingQueryParamError } = require('../../../lib/application/http-errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | HTTP Errors', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#BaseHttpError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a title, message, and errorCode property', function () {
      // given
      const expectedTitle = 'Default Bad Request';
      const expectedMessage = 'Boom...';
      const expectedErrorCode = 400;

      // when
      const httpError = new BaseHttpError('Boom...');

      // then
      expect(httpError.title).to.equal(expectedTitle);
      expect(httpError.message).to.equal(expectedMessage);
      expect(httpError.status).to.equal(expectedErrorCode);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#MissingQueryParamError', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should export an decendant instance of Infrastructure Error', function () {
      // when
      const missingQueryParamError = new MissingQueryParamError('assessmentId');

      // then
      expect(missingQueryParamError).to.be.an.instanceof(BaseHttpError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a title, message, and errorCode property', function () {
      // given
      const expectedTitle = 'Missing Query Parameter';
      const expectedMessage = 'Missing assessmentId query parameter.';
      const expectedErrorCode = 400;

      // when
      const missingQueryParamError = new MissingQueryParamError('assessmentId');

      // then
      expect(missingQueryParamError.title).to.equal(expectedTitle);
      expect(missingQueryParamError.message).to.equal(expectedMessage);
      expect(missingQueryParamError.status).to.equal(expectedErrorCode);
    });
  });
});
