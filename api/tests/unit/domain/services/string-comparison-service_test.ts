// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'areTwoStri... Remove this comment to see the full error message
  areTwoStringsCloseEnough,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSmalles... Remove this comment to see the full error message
  getSmallestLevenshteinDistance,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSmalles... Remove this comment to see the full error message
  getSmallestLevenshteinRatio,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getLevensh... Remove this comment to see the full error message
  getLevenshteinRatio,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isOneStrin... Remove this comment to see the full error message
  isOneStringCloseEnoughFromMultipleStrings,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/services/string-comparison-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Validation Comparison', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getSmallestLevenshteinDistance', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Should return levenshtein distance if only one alternative is given', function () {
      const successfulCases = [
        { should: 'If both are empty', arg1: '', arg2: [''], output: 0 },
        { should: 'If both are same', arg1: 'a', arg2: ['a'], output: 0 },
        { should: 'If they have one different character', arg1: 'a', arg2: ['ab'], output: 1 },
        { should: 'If they have two different characters', arg1: 'book', arg2: ['back'], output: 2 },
      ];

      // eslint-disable-next-line mocha/no-setup-in-describe
      successfulCases.forEach(function (testCase) {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`${
          testCase.should
        } for example arg1 ${JSON.stringify(testCase.arg1)} and arg2 ${JSON.stringify(testCase.arg2)} => ${testCase.output}`, function () {
          expect(getSmallestLevenshteinDistance(testCase.arg1, testCase.arg2)).to.equal(testCase.output);
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Should return the smallest levenshtein distance if many alternatives are given', function () {
      const successfulCases = [
        { should: 'If the smallest difference is 0', arg1: '', arg2: ['', 'a'], output: 0 },
        { should: 'If the smallest difference is 0, with non empty args', arg1: 'a', arg2: ['a', 'ab'], output: 0 },
        {
          should: 'If the smallest difference is 1, smallest is at position 0 in array',
          arg1: 'a',
          arg2: ['ab', 'abdcef'],
          output: 1,
        },
        {
          should: 'If the smallest difference is 1, smallest is at position 1 in array',
          arg1: 'a',
          arg2: ['abdcef', 'ab'],
          output: 1,
        },
        {
          should: 'If the smallest difference is 1, with 3 differents String as arg2',
          arg1: 'a',
          arg2: ['abcdef', 'ab', 'azerty'],
          output: 1,
        },
        { should: 'If the difference is 2 for all elements', arg1: 'book', arg2: ['back', 'buck'], output: 2 },
      ];

      // eslint-disable-next-line mocha/no-setup-in-describe
      successfulCases.forEach(function (testCase) {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`${
          testCase.should
        } for example arg1 ${JSON.stringify(testCase.arg1)} and arg2 ${JSON.stringify(testCase.arg2)} => ${testCase.output}`, function () {
          expect(getSmallestLevenshteinDistance(testCase.arg1, testCase.arg2)).to.equal(testCase.output);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getSmallestLevenshteinRatio', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { scenario: 'the inputString is the only reference', inputString: 'a1', references: ['a1'], expected: 0 },
      { scenario: 'the inputString is a reference', inputString: 'a', references: ['a', 'b'], expected: 0 },
      { scenario: 'there is 3/4 good character', inputString: 'faco', references: ['face', 'faac'], expected: 1 / 4 },
      {
        scenario: 'the best ratio is 3/4 good character on one the references',
        inputString: 'faco',
        references: ['face', 'allo'],
        expected: 1 / 4,
      },
      {
        scenario: 'the inputString has nothing to see compared to references',
        inputString: 'Linkedin',
        references: ['Viadeo', 'Instagram'],
        expected: 3 / 4,
      },
      {
        scenario: 'the inputString has one mistake over 10 characters',
        inputString: 'abbbbbbbbb',
        references: ['bbbbbbbbbb'],
        expected: 1 / 10,
      },
    ].forEach((testCase) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(testCase.scenario, function () {
        // then
        expect(getSmallestLevenshteinRatio(testCase.inputString, testCase.references)).to.equal(testCase.expected);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getLevenshteinRatio', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { scenario: 'the inputString is the reference', inputString: 'a1', reference: 'a1', expected: 0 },
      { scenario: 'there is 3/4 good character', inputString: 'faco', reference: 'face', expected: 1 / 4 },
      { scenario: 'the best ratio is 3/4 good character', inputString: 'faco', reference: 'face', expected: 1 / 4 },
      {
        scenario: 'the inputString has nothing to see compared to reference',
        inputString: 'Linkedin',
        reference: 'Viadeo',
        expected: 3 / 4,
      },
      {
        scenario: 'the inputString has one mistake over 10 characters',
        inputString: 'abbbbbbbbb',
        reference: 'bbbbbbbbbb',
        expected: 1 / 10,
      },
    ].forEach((testCase) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(testCase.scenario, function () {
        // then
        expect(getLevenshteinRatio(testCase.inputString, testCase.reference)).to.equal(testCase.expected);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('areTwoStringsCloseEnough', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the distance between two strings is more than MAX_ACCEPTABLE_RATIO', function () {
      // given
      const MAX_ACCEPTABLE_RATIO = 0;
      const inputString = 'aaaaaa';
      const referenceString = '12KBKHBHB65';

      // when
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line mocha/no-setup-in-describe
      const actual = areTwoStringsCloseEnough(inputString, referenceString, MAX_ACCEPTABLE_RATIO);

      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', function () {
        expect(actual).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the distance between two strings is equal or less than MAX_ACCEPTABLE_RATIO', function () {
      // given
      const MAX_ACCEPTABLE_RATIO = 1;
      const inputString = 'aaaaaa';
      const referenceString = 'àaaaaa';

      // when
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line mocha/no-setup-in-describe
      const actual = areTwoStringsCloseEnough(inputString, referenceString, MAX_ACCEPTABLE_RATIO);

      // then
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', function () {
        expect(actual).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('isOneStringCloseEnoughFromMultipleStrings', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the distance from every string referenced to the input is more than MAX_ACCEPTABLE_RATIO',
      function () {
        // given
        const MAX_ACCEPTABLE_RATIO = 0;
        const inputString = 'aaaaaa';
        const references = ['12KBKHBHB65', 'Jacques'];

        // when
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line mocha/no-setup-in-describe
        const actual = isOneStringCloseEnoughFromMultipleStrings(inputString, references, MAX_ACCEPTABLE_RATIO);

        // then
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false', function () {
          expect(actual).to.be.false;
        });
      }
    );

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'when the distance from one string referenced to the input is equal or less than MAX_ACCEPTABLE_RATIO',
      function () {
        // given
        const MAX_ACCEPTABLE_RATIO = 1;
        const inputString = 'aaaaaa';
        const references = ['àaaaaa', 'bbbbbbb', 'aaaaab'];

        // when
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line mocha/no-setup-in-describe
        const actual = isOneStringCloseEnoughFromMultipleStrings(inputString, references, MAX_ACCEPTABLE_RATIO);

        // then
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return true', function () {
          expect(actual).to.be.true;
        });
      }
    );
  });
});
