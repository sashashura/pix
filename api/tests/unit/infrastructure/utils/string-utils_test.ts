// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNumeric'... Remove this comment to see the full error message
  isNumeric,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cleanStrin... Remove this comment to see the full error message
  cleanStringAndParseFloat,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getArrayOf... Remove this comment to see the full error message
  getArrayOfStrings,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'splitIntoW... Remove this comment to see the full error message
  splitIntoWordsAndRemoveBackspaces,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
  normalizeAndSortChars,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalize'... Remove this comment to see the full error message
  normalize,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'toArrayOfF... Remove this comment to see the full error message
  toArrayOfFixedLengthStringsConservingWords,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/infrastructure/utils/string-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | string-utils', function () {
  const zeroWidthSpaceChar = '​';

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isNumeric', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { case: 'abc', expectedResult: false },
      { case: '123', expectedResult: true },
      { case: '12.0', expectedResult: true },
      { case: '13,0', expectedResult: true },
      { case: 'abc.0', expectedResult: false },
      { case: 'abc.c', expectedResult: false },
      { case: '123.a', expectedResult: false },
      { case: '123.897', expectedResult: true },
      { case: '123.000', expectedResult: true },
      { case: '0.123', expectedResult: true },
      { case: '0,123', expectedResult: true },
      { case: '25 000', expectedResult: true },
    ].forEach((data) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${data.expectedResult} with ${data.case}`, function () {
        // When
        const result = isNumeric(data.case);
        // Then
        expect(result).to.be.equal(data.expectedResult);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#cleanStringAndParseFloat', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { case: '0123', expectedResult: 123 },
      { case: '1,23', expectedResult: 1.23 },
      { case: '01,23', expectedResult: 1.23 },
      { case: '1.23', expectedResult: 1.23 },
      { case: '1.00', expectedResult: 1.0 },
      { case: '1.00', expectedResult: 1 },
      { case: '00025 000', expectedResult: 25000 },
    ].forEach((data) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${data.expectedResult} with ${data.case}`, function () {
        // When
        const result = cleanStringAndParseFloat(data.case);
        // Then
        expect(result).to.be.equal(data.expectedResult);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#splitIntoWordsAndRemoveBackspaces', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { case: 'abc', expectedResult: ['abc'] },
      { case: 'qvak\nqwak\nanything\n', expectedResult: ['qvak', 'qwak', 'anything'] },
      { case: 'wîth àccénts êêê', expectedResult: ['wîth àccénts êêê'] },
      { case: ',.!p-u-n-c-t', expectedResult: [',.!p-u-n-c-t'] },
      { case: 'variant 1\nvariant 2\nvariant 3\n', expectedResult: ['variant 1', 'variant 2', 'variant 3'] },
    ].forEach((data) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return ${data.expectedResult} with ${data.case}`, function () {
        // When
        const result = splitIntoWordsAndRemoveBackspaces(data.case);
        // Then
        expect(result).to.be.deep.equal(data.expectedResult);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#normalizeAndSortChars', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should normalize and sort chars of a string with non canonical, zero-width and special characters: "Féd '. 4àBç - 2 (îHg)K${zeroWidthSpaceChar}J"`, function () {
      expect(normalizeAndSortChars("Féd '. 4àBç - 2 (îHg)K​J")).to.equal('24ABCDEFGHIJK');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#normalize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should normalize chars of a string with non canonical, zero-width and special characters: "Féd '. 4àBç - 2 (îHg)K${zeroWidthSpaceChar}J"`, function () {
      expect(normalize("Féd '. 4àBç - 2 (îHg)K​J")).to.equal('FED4ABC2IHGKJ');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getArrayOfStrings', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('given value is undefined', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', function () {
        // when
        const array = getArrayOfStrings(undefined);

        // then
        expect(array).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('given value has only one string', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return array of 1', function () {
        // when
        const array = getArrayOfStrings('un');

        // then
        expect(array).to.deep.equal(['UN']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('given value has more than one string', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an array containing the strings, trimmed and uppercase', function () {
        // when
        const array = getArrayOfStrings('un, dos');

        // then
        expect(array).to.deep.equal(['UN', 'DOS']);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#toArrayOfFixedLengthStringsConservingWords', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array containing an empty string when string parameter is empty', function () {
      // given
      const stringToSplit = '';

      // when
      const result = toArrayOfFixedLengthStringsConservingWords(stringToSplit, 10);

      // then
      expect(result).to.deep.equal(['']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array containing the string parameter when maxLength is lower or equal to string length', function () {
      // given
      const stringToSplit = 'Ceci est un test';

      // when
      const result = toArrayOfFixedLengthStringsConservingWords(stringToSplit, 16);

      // then
      expect(result).to.deep.equal(['Ceci est un test']);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of limited length strings conserving word', function () {
      // given
      const stringToSplit = 'Ceci est une chaîne de caractère permettant de tester la fonction.';

      // when
      const result = toArrayOfFixedLengthStringsConservingWords(stringToSplit, 10);

      // then
      expect(result).to.deep.equal([
        'Ceci est',
        'une chaîne',
        'de',
        'caractère',
        'permettant',
        'de tester',
        'la',
        'fonction.',
      ]);
    });
  });
});
