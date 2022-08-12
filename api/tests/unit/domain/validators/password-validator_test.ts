// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'passwordVa... Remove this comment to see the full error message
const passwordValidator = require('../../../../lib/domain/validators/password-validator');

function _assertErrorMatchesWithExpectedOne(entityValidationErrors: $TSFixMe, expectedError: $TSFixMe) {
  expect(entityValidationErrors).to.be.instanceOf(EntityValidationError);
  expect(entityValidationErrors.invalidAttributes).to.have.lengthOf(1);
  expect(entityValidationErrors.invalidAttributes[0]).to.deep.equal(expectedError);
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Validators | password-validator', function () {
  let password;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validation is successful', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw any error', function () {
        // when
        password = 'Pix12345';

        // then
        expect(passwordValidator.validate(password)).to.not.throw;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validation fails', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with error on field "password" when password is missing', async function () {
        // given
        password = '';

        const expectedError = {
          attribute: 'password',
          message: 'Votre mot de passe n’est pas renseigné.',
        };

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const errors = await catchErr(passwordValidator.validate)(password);

        // then
        _assertErrorMatchesWithExpectedOne(errors, expectedError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with error on field "password" when password is invalid', async function () {
        // given
        password = 'invalid';

        const expectedError = {
          attribute: 'password',
          message:
            'Votre mot de passe doit contenir 8 caractères au minimum et comporter au moins une majuscule, une minuscule et un chiffre.',
        };

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const errors = await catchErr(passwordValidator.validate)(password);

        // then
        _assertErrorMatchesWithExpectedOne(errors, expectedError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with errors on password when password have a maximum length of 255', async function () {
        // given
        password = 'Password1234'.repeat(22);

        const expectedError = {
          attribute: 'password',
          message: 'Votre mot de passe ne doit pas dépasser les 255 caractères.',
        };

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const errors = await catchErr(passwordValidator.validate)(password);

        // then
        _assertErrorMatchesWithExpectedOne(errors, expectedError);
      });
    });
  });
});
