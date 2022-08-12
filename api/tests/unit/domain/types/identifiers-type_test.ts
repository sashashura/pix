// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userId'.
const { userId, competenceId } = require('../../../../lib/domain/types/identifiers-type');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Type | identifier-types', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#userId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id is valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not reject', function () {
        // given
        const validId = 1;

        // when
        const { error } = userId.validate(validId);

        // then
        expect(error).to.be.undefined;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject outside of lower bound', async function () {
        // given
        const lowerBoundOutOfRangeId = 0;

        // when
        const { error } = userId.validate(lowerBoundOutOfRangeId);

        // then
        expect(error.message).to.equal('"value" must be greater than or equal to 1');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject outside of upper bound', async function () {
        // given
        const upperBoundOutOfRangeId = 2147483648;

        // when
        const { error } = userId.validate(upperBoundOutOfRangeId);

        // then
        expect(error.message).to.equal('"value" must be less than or equal to 2147483647');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#competenceId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id is valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not reject', function () {
        // given
        const validId = '1234567890123456';

        // when then
const { error } = (competenceId as $TSFixMe).validate(validId);

        // then
        expect(error).to.be.undefined;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when id is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject when empty', async function () {
        // given
        const emptyString = '';

        // when
const { error } = (competenceId as $TSFixMe).validate(emptyString);

        // then
        expect(error.message).to.equal('"value" is not allowed to be empty');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject when too large', async function () {
        // given
        const tooLargeString = 'A'.repeat(256);

        // when
const { error } = (competenceId as $TSFixMe).validate(tooLargeString);

        // then
        expect(error.message).to.equal('"value" length must be less than or equal to 255 characters long');
      });
    });
  });
});
