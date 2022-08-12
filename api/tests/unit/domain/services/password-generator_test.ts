// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'service'.
const service = require('../../../../lib/domain/services/password-generator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | password-generator', function () {
  let generatedPassword;

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#generateSimplePassword', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a length of 8 characters', function () {
      // given & when
      generatedPassword = service.generateSimplePassword();

      // then
      expect(generatedPassword.length).to.equal(8);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not contains hard to read characters', function () {
      // given
      const hardToReadCharacters = '[ilo]';

      // when
      generatedPassword = service.generateSimplePassword();

      // then
      expect(RegExp(hardToReadCharacters).test(generatedPassword)).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should contains 6 lowercase letters and two digits', function () {
      // given & when
      generatedPassword = service.generateSimplePassword();

      // then
      expect(RegExp('^[a-z]{6}[0-9]{2}$').test(generatedPassword)).to.be.true;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#generateComplexPassword', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a length of 32 characters', function () {
      // given
      sinon.stub(randomString, 'generate');

      // when
      generatedPassword = service.generateComplexPassword();

      // then
      expect(randomString.generate).to.have.been.calledWith({
        length: 32,
        charset: 'alphanumeric',
      });
    });
  });
});
