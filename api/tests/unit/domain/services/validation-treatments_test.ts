// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeA... Remove this comment to see the full error message
  normalizeAndRemoveAccents,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'removeSpec... Remove this comment to see the full error message
  removeSpecialCharacters,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'applyPreTr... Remove this comment to see the full error message
  applyPreTreatments,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'applyTreat... Remove this comment to see the full error message
  applyTreatments,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/services/validation-treatments');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Validation Treatments', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#normalizeAndRemoveAccents', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { description: 'white spaces', input: '  foo  bar  ', expected: 'foobar' },
      { description: 'unbreakable spaces', input: 'unbreakable spaces', expected: 'unbreakablespaces' },
      { description: 'accents', input: 'àâäéèêëîïôöòûùüñń', expected: 'aaaeeeeiiooouuunn' },
      { description: 'cédille', input: 'hameçon', expected: 'hamecon' },
      { description: 'case', input: 'SHI-fu-Mi', expected: 'shi-fu-mi' },
    ].forEach((scenario) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return the given string without "${scenario.description}"`, function () {
        expect(normalizeAndRemoveAccents(scenario.input)).to.equal(scenario.expected);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not modify æ and œ', function () {
      expect(normalizeAndRemoveAccents('æ/œ')).to.equal('æ/œ');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return (a copy of) the given string unmodified if it contains no concerned characters', function () {
      expect(normalizeAndRemoveAccents('shi-foo-bar')).to.equal('shi-foo-bar');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#removeSpecialCharacters', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { description: 'all point types', input: '?Allo?,:;.', expected: 'Allo' },
      { description: 'slashs', input: '\\o/', expected: 'o' },
      { description: 'quotes', input: '"quotes"', expected: 'quotes' },
      { description: 'underscore and dashes', input: 'Shi-fu_mi', expected: 'Shifumi' },
      { description: 'parenthesis', input: '(anyway)', expected: 'anyway' },
    ].forEach((scenario) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return the given string without "${scenario.description}"`, function () {
        expect(removeSpecialCharacters(scenario.input)).to.equal(scenario.expected);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return (a copy of) the given string unmodified if it contains no concerned characters', function () {
      expect(removeSpecialCharacters('shi foo bar')).to.equal('shi foo bar');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the good result even for complex phrase', function () {
      expect(
        removeSpecialCharacters('Th!!is., -/ is #! an $ % ^ & * example ;: {} of a = -_ string with `~)() punctuation')
      ).to.equal('This is an example of a string with punctuation');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#applyPreTreatments', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a copy of the given string with unbreakable spaces replaced by normal spaces', function () {
      // given
      const stringWithUnbreakableSpaces = ' Shi Foo-Bar ';
      const sameStringWithNormalSpaces = ' Shi Foo-Bar ';

      // when
      const actual = applyPreTreatments(stringWithUnbreakableSpaces);

      // then
      expect(actual).to.equal(sameStringWithNormalSpaces);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#applyTreatments with enabled Treatments', function () {
    const input = ' Shi Foo-Bar ';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the given string without applying any treatment when the enabled treatments array is not defined', function () {
      expect(applyTreatments(input)).to.equal(input);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the given string without applying any treatment when the enabled treatments array is empty', function () {
      expect(applyTreatments(input, [])).to.equal(input);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the given string without applying any treatment when the enabled treatments array does not contain "t1" nor "t2"', function () {
      expect(applyTreatments(input, ['t1000'])).to.equal(input);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a string with "t1" applied if it is set as enabled treatment', function () {
      expect(applyTreatments(input, ['t1'])).to.equal('shifoo-bar');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a string with "t2" applied if it is set as enabled treatment', function () {
      expect(applyTreatments(input, ['t2'])).to.equal(' Shi FooBar ');
    });
  });
});
