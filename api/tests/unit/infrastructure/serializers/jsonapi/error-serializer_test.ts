// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JSONAPIErr... Remove this comment to see the full error message
const JSONAPIError = require('jsonapi-serializer').Error;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingQue... Remove this comment to see the full error message
const { MissingQueryParamError, ConflictError } = require('../../../../../lib/application/http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/error-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | error-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a infrastructure error object into JSONAPIError', function () {
      // given
      const error = new MissingQueryParamError('assessmentId');
      const expectedJSONAPIError = JSONAPIError({
        status: '400',
        title: 'Missing Query Parameter',
        detail: 'Missing assessmentId query parameter.',
      });

      // when
      const serializedError = serializer.serialize(error);

      // then
      expect(serializedError).to.deep.equal(expectedJSONAPIError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a conflict error object into JSONAPIError', function () {
      // given
      const error = new ConflictError('error detail', 'code', { shortCode: 'shortCode', value: 'value' });
      const expectedJSONAPIError = JSONAPIError({
        status: '409',
        title: 'Conflict',
        detail: 'error detail',
        code: 'code',
        meta: { shortCode: 'shortCode', value: 'value' },
      });

      // when
      const serializedError = serializer.serialize(error);

      // then
      expect(serializedError).to.deep.equal(expectedJSONAPIError);
    });
  });
});
