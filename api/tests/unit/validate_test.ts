// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pick'.
const { pick } = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, hFake } = require('../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadRequest... Remove this comment to see the full error message
const { BadRequestError } = require('../../lib/application/http-errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'handleFail... Remove this comment to see the full error message
const { handleFailAction } = require('../../lib/validate');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Validate', function () {
  let expectedResponse: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    const { title: defaultTitle, status: defaultStatus } = new BadRequestError();

    expectedResponse = {
      source: {
        errors: [
          {
            status: defaultStatus.toString(),
            title: defaultTitle,
          },
        ],
      },
      statusCode: defaultStatus,
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should generate a response with BadRequest default error's title, status and statusCode", function () {
    // given
    const error = undefined;

    // when
    const response = handleFailAction(null, hFake, error);

    // then
    expect(pick(response, ['source', 'statusCode'])).deep.equal(expectedResponse);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should generate a response with BadRequest default parameters and detail error message', function () {
    // given
    const expectedErrorMessage = 'This is a specific error message';
    const error = {
      details: [{ message: expectedErrorMessage }],
    };

    expectedResponse.source.errors[0].detail = expectedErrorMessage;

    // when
    const response = handleFailAction(null, hFake, error);

    // then
    expect(pick(response, ['source', 'statusCode'])).deep.equal(expectedResponse);
  });
});
