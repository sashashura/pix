// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Reproducib... Remove this comment to see the full error message
const { ReproducibilityRate } = require('../../../../lib/domain/models/ReproducibilityRate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MINIMUM_RE... Remove this comment to see the full error message
const { MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED } = require('../../../../lib/domain/constants');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | ReproducibilityRate', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#static from', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is equal to 0% non non-neutralizedAnswers', function () {
      // when
      const reproducibilityRate = ReproducibilityRate.from({
        numberOfNonNeutralizedChallenges: 0,
        numberOfCorrectAnswers: 0,
      });

      // then
      expect(reproducibilityRate.value).to.equal(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is equal to 0% non correct answers', function () {
      // when
      const reproducibilityRate = ReproducibilityRate.from({
        numberOfNonNeutralizedChallenges: 1,
        numberOfCorrectAnswers: 0,
      });

      // then
      expect(reproducibilityRate.value).to.equal(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is equal to 50% if 1 answer is correct 2 non-neutralized challenges', function () {
      // when
      const reproducibilityRate = ReproducibilityRate.from({
        numberOfNonNeutralizedChallenges: 2,
        numberOfCorrectAnswers: 1,
      });

      // then
      expect(reproducibilityRate.value).to.equal(50);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is equal to 33% if 1 correct answer and 3 non-neutralized challenges', function () {
      // when
      const reproducibilityRate = ReproducibilityRate.from({
        numberOfNonNeutralizedChallenges: 3,
        numberOfCorrectAnswers: 1,
      });

      // then
      expect(reproducibilityRate.value).to.equal(33);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isEnoughToBeCertified', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should be true if reproducibility rate value is above ${MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED}`, function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({
        value: MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED + 1,
      });

      // when
      const isEnoughToBeCertified = reproducibilityRate.isEnoughToBeCertified();

      // then
      expect(isEnoughToBeCertified).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should be true if reproducibility rate value is equal ${MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED}`, function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({
        value: MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED,
      });

      // when
      const isEnoughToBeCertified = reproducibilityRate.isEnoughToBeCertified();

      // then
      expect(isEnoughToBeCertified).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should be false if reproducibility rate value is under ${MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED}`, function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({
        value: MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED - 1,
      });

      // when
      const isEnoughToBeCertified = reproducibilityRate.isEnoughToBeCertified();

      // then
      expect(isEnoughToBeCertified).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isEqualOrAbove', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if reproducibility rate value is above given value', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({
        value: 43,
      });

      // when
      const isEqualOrAbove = reproducibilityRate.isEqualOrAbove(42);

      // then
      expect(isEqualOrAbove).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be true if reproducibility rate value is equal given value', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({
        value: 42,
      });

      // when
      const isEqualOrAbove = reproducibilityRate.isEqualOrAbove(42);

      // then
      expect(isEqualOrAbove).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should be false if reproducibility rate value is under given value', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({
        value: 41,
      });

      // when
      const isEqualOrAbove = reproducibilityRate.isEqualOrAbove(42);

      // then
      expect(isEqualOrAbove).to.be.false;
    });
  });
});
