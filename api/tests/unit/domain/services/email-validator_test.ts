// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'service'.
const service = require('../../../../lib/domain/services/email-validator');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | email-validator', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return false when email is not provided', function () {
    expect(service.emailIsValid()).to.be.false;
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  [
    '',
    ' ',
    null,
    'INVALID_EMAIL',
    'INVALID_EMAIL@',
    'INVALID_EMAIL@pix',
    'INVALID_EMAIL@pix.',
    '@pix.fr',
    '@pix',
  ].forEach(function (badEmail) {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should return false when email is invalid: ${badEmail}`, function () {
      expect(service.emailIsValid(badEmail)).to.be.false;
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  [
    'follower@pix.fr',
    'follower@pix.fr ',
    ' follower@pix.fr',
    ' follower@pix.fr ',
    ' follower-beta@pix.fr ',
    ' follower_beta@pix.fr ',
    'follower+beta@pix.fr',
    'follower+beta@pix.gouv.fr',
    'follower+beta@pix.beta.gouv.fr',
  ].forEach(function (validEmail) {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it(`should return true if provided email is valid: ${validEmail}`, function () {
      expect(service.emailIsValid(validEmail)).to.be.true;
    });
  });
});
