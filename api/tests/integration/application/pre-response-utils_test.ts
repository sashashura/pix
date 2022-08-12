// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const { expect, hFake } = require('../../test-helper');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
  BadRequestError,
  ConflictError,
  ForbiddenError,
  BaseHttpError,
  MissingQueryParamError,
  NotFoundError,
  PreconditionFailedError,
  UnauthorizedError,
  UnprocessableEntityError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../lib/application/http-errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handleDoma... Remove this comment to see the full error message
const { handleDomainAndHttpErrors } = require('../../../lib/application/pre-response-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | PreResponse-utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handleDomainAndHttpErrors', function () {
    const invalidAttributes = [
      {
        attribute: 'type',
        message: 'Error message',
      },
    ];

    const successfulCases = [
      {
        should: 'should return HTTP code 400 when BadRequestError',
        response: new BadRequestError('Error message'),
        expectedStatusCode: 400,
      },
      {
        should: 'should return HTTP code 400 when MissingQueryParamError',
        response: new MissingQueryParamError('Error message'),
        expectedStatusCode: 400,
      },
      {
        should: 'should return HTTP code 401 when UnauthorizedError',
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        response: new UnauthorizedError('Error message'),
        expectedStatusCode: 401,
      },
      {
        should: 'should return HTTP code 403 when ForbiddenError',
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        response: new ForbiddenError('Error message'),
        expectedStatusCode: 403,
      },
      {
        should: 'should return HTTP code 404 when NotFoundError',
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        response: new NotFoundError('Error message'),
        expectedStatusCode: 404,
      },
      {
        should: 'should return HTTP code 409 when ConflictError',
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        response: new ConflictError('Error message'),
        expectedStatusCode: 409,
      },
      {
        should: 'should return HTTP code 412 when PreconditionFailedError',
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        response: new PreconditionFailedError('Error message'),
        expectedStatusCode: 412,
      },
      {
        should: 'should return HTTP code 422 when EntityValidationError',
        response: new EntityValidationError({ invalidAttributes }),
        expectedStatusCode: 422,
      },
      {
        should: 'should return HTTP code 422 when UnprocessableEntityError',
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
        response: new UnprocessableEntityError('Error message'),
        expectedStatusCode: 422,
      },
      {
        should: 'should return HTTP code 400 when BaseHttpError',
        response: new BaseHttpError('Error message'),
        expectedStatusCode: 400,
      },
    ];

    // eslint-disable-next-line mocha/no-setup-in-describe
    successfulCases.forEach((testCase) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(testCase.should, async function () {
        // given
        const request = {
          response: testCase.response,
        };

        // when
        const response = await handleDomainAndHttpErrors(request, hFake);

        // then
        expect(response.statusCode).to.equal(testCase.expectedStatusCode);
      });
    });
  });
});
