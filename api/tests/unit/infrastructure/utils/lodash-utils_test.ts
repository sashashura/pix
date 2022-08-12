// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const original_lodash = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('../../../../lib/infrastructure/utils/lodash-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Utils | lodash-utils', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#scope', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not affect original version of lodash', function () {
      expect(original_lodash.elementAfter).not.to.exist;
      expect(_.elementAfter).to.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#elementAfter', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('for a given array and element in array (but not the last one), should return the element after the one provided', function () {
      expect(_.elementAfter(['a', 'b', 'c', 'd'], 'a')).to.equal('b');
      expect(_.elementAfter(['a', 'b', 'c', 'd'], 'b')).to.equal('c');
      expect(_.elementAfter(['a', 'b', 'c', 'd'], 'c')).to.equal('d');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('for a given array and the LAST element in array, should return undefined', function () {
      expect(_.elementAfter(['a', 'b', 'c', 'd'], 'd')).to.equal(undefined);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('for a given array and an element NOT in array, should return undefined', function () {
      expect(_.elementAfter(['a', 'b', 'c', 'd'], 'z')).to.equal(undefined);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('for an empty array, should return undefined', function () {
      expect(_.elementAfter([], 'z')).to.equal(undefined);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('if first arg is not an array, should return undefined', function () {
      expect(_.elementAfter(new Date(), 'a')).to.equal(undefined);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('if last arg is missing, should return undefined', function () {
      expect(_.elementAfter(['a', 'b', 'c', 'd'])).to.equal(undefined);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('if both args are is missing, should return undefined', function () {
      expect(_.elementAfter()).to.equal(undefined);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#areCSVequivalent', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when no arg are given, should return false', function () {
      expect(_.areCSVequivalent()).to.equal(false);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when two arg are given, but are not string, should return false', function () {
      expect(_.areCSVequivalent(['1,2,3'], ['1,2,3'])).to.equal(false);
      expect(_.areCSVequivalent(new Date(), new Date())).to.equal(false);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when two string are the same, should return true', function () {
      expect(_.areCSVequivalent('1,2,3', '1,2,3')).to.equal(true);
      expect(_.areCSVequivalent('azerty', 'azerty')).to.equal(true);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when element are the same but in different order, should return true', function () {
      expect(_.areCSVequivalent('1,2,3', '3,1,2')).to.equal(true);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when element have space around values, should return true', function () {
      expect(_.areCSVequivalent('2 , blabla, 1', 'blabla ,1,2')).to.equal(true);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#ensureString', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when no input, return an empty String', function () {
      expect(_.ensureString()).to.equal('');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when input is explicitly undefined, return an empty String', function () {
      expect(_.ensureString(undefined)).to.equal('');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when input is explicitly null, return an empty String', function () {
      expect(_.ensureString(null)).to.equal('');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when input is a number (typeof meaning), it returns a toString() version of the input', function () {
      expect(_.ensureString(42)).to.equal('42');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when input is a string (typeof meaning), it returns a toString() version of the input', function () {
      expect(_.ensureString('42')).to.equal('42');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when input is an object (typeof meaning), it returns a toString() version of the input', function () {
      expect(_.ensureString(/[aeiou]+/g)).to.equal('/[aeiou]+/g');
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when input is an boolean (typeof meaning), it returns a toString() version of the input', function () {
      expect(_.ensureString(true)).to.equal('true');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isBlank', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if string is undefined', function () {
      expect(_.isBlank()).to.be.true;
    });

    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    [null, '', ' ', '   ', '\t', '\r\n', '\n'].forEach(function (string) {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return true if string is "${string}"`, function () {
        expect(_.isBlank(string)).to.be.true;
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    ['a', ' a', 'a ', ' a ', '\ta\ta'].forEach(function (string) {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return false if string is "${string}"`, function () {
        expect(_.isBlank(string)).to.be.false;
      });
    });
  });
});
