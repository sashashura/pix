// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Stage'.
const Stage = require('../../../../lib/domain/models/Stage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'stageValid... Remove this comment to see the full error message
const stageValidator = require('../../../../lib/domain/validators/stage-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MISSING_VA... Remove this comment to see the full error message
const MISSING_VALUE = '';

function _assertErrorMatchesWithExpectedOne(entityValidationErrors: $TSFixMe, expectedError: $TSFixMe) {
  expect(entityValidationErrors).to.be.instanceOf(EntityValidationError);
  expect(entityValidationErrors.invalidAttributes).to.have.lengthOf(1);
  expect(entityValidationErrors.invalidAttributes[0]).to.deep.equal(expectedError);
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Validators | stage-validator', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validate', function () {
    let stage: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      stage = new Stage({
        title: 'My title',
        threshold: 42,
        targetProfileId: 3,
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validation is successful ', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw any error', function () {
        expect(stageValidator.validate({ stage })).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when stage data validation fails', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with error when title is missing', async function () {
        // given
        const expectedError = {
          attribute: 'title',
          message: 'STAGE_TITLE_IS_REQUIRED',
        };
        stage.title = MISSING_VALUE;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const errors = await catchErr(stageValidator.validate)({ stage });

        // then
        _assertErrorMatchesWithExpectedOne(errors, expectedError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with error when threshold is missing', async function () {
        // given
        const expectedError = {
          attribute: 'threshold',
          message: 'STAGE_THRESHOLD_IS_REQUIRED',
        };
        stage.threshold = MISSING_VALUE;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const errors = await catchErr(stageValidator.validate)({ stage });

        // then
        _assertErrorMatchesWithExpectedOne(errors, expectedError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with error when threshold is a string', async function () {
        // given
        const expectedError = {
          attribute: 'threshold',
          message: 'STAGE_THRESHOLD_IS_REQUIRED',
        };
        stage.threshold = 'test';

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const errors = await catchErr(stageValidator.validate)({ stage });

        // then
        _assertErrorMatchesWithExpectedOne(errors, expectedError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with error when targetProfileId is missing', async function () {
        // given
        const expectedError = {
          attribute: 'targetProfileId',
          message: 'STAGE_TARGET_PROFILE_IS_REQUIRED',
        };
        stage.targetProfileId = MISSING_VALUE;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const errors = await catchErr(stageValidator.validate)({ stage });

        // then
        _assertErrorMatchesWithExpectedOne(errors, expectedError);
      });
    });
  });
});
