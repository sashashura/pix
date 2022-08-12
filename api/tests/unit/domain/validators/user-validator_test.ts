// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userValida... Remove this comment to see the full error message
const userValidator = require('../../../../lib/domain/validators/user-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MISSING_VA... Remove this comment to see the full error message
const MISSING_VALUE = '';

function _assertErrorMatchesWithExpectedOne(entityValidationErrors: $TSFixMe, expectedError: $TSFixMe) {
  expect(entityValidationErrors).to.be.instanceOf(EntityValidationError);
  expect(entityValidationErrors.invalidAttributes).to.have.lengthOf(1);
  expect(entityValidationErrors.invalidAttributes[0]).to.deep.equal(expectedError);
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Validators | user-validator', function () {
  let user: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validation is for normal user', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        user = new User({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.net',
          cgu: true,
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when validation is successful', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not throw any error', function () {
          expect(userValidator.validate({ user })).to.not.throw;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user data validation fails', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when user is undefined', function () {
          // given
          const expectedError = {
            attribute: undefined,
            message: 'EMPTY_INPUT',
          };

          // when
          try {
            userValidator.validate({ user: undefined });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "first name" when first name is missing', function () {
          // given
          const expectedError = {
            attribute: 'firstName',
            message: 'EMPTY_FIRST_NAME',
          };
          user.firstName = MISSING_VALUE;

          // when
          try {
            userValidator.validate({ user });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "last name" when last name is missing', function () {
          // given
          const expectedError = {
            attribute: 'lastName',
            message: 'EMPTY_LAST_NAME',
          };
          user.lastName = MISSING_VALUE;

          // when
          try {
            userValidator.validate({ user });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "cgu" when cgu is false', function () {
          // given
          const expectedError = {
            attribute: 'cgu',
            message: 'ACCEPT_CGU',
          };
          user.cgu = 'false';

          // when
          try {
            userValidator.validate({ user });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "email" when email is missing', function () {
          // given
          const expectedError = {
            attribute: 'email',
            message: 'EMPTY_EMAIL',
          };
          user.email = MISSING_VALUE;

          // when
          try {
            userValidator.validate({ user });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "email" when email is invalid', function () {
          // given
          const expectedError = {
            attribute: 'email',
            message: 'WRONG_EMAIL_FORMAT',
          };
          user.email = 'invalid_email';

          // when
          try {
            userValidator.validate({ user });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when neither email nor username are defined', async function () {
          // given
          const expectedError = {
            attribute: undefined,
            message: 'FILL_USERNAME_OR_EMAIL',
          };

          user.email = undefined;
          user.username = undefined;

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const errors = await catchErr(userValidator.validate)({ user });

          // then
          _assertErrorMatchesWithExpectedOne(errors, expectedError);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with errors on all fields (but only once by field) when all fields are missing', async function () {
          // given
          user = {
            firstName: '',
            lastName: '',
            email: '',
          };

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(userValidator.validate)({ user });

          // then
expect((error as $TSFixMe).invalidAttributes).to.have.lengthOf(4);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with errors on firstName, lastName and email when firstName, lastName and email have a maximum length of 255', async function () {
          // given
          const expectedFirstNameError = {
            attribute: 'firstName',
            message: 'MAX_SIZE_FIRST_NAME',
          };
          const expectedLastNameError = {
            attribute: 'lastName',
            message: 'MAX_SIZE_LAST_NAME',
          };
          const expectedMaxLengthEmailError = {
            attribute: 'email',
            message: 'MAX_SIZE_EMAIL',
          };

          user = {
            firstName: 'John'.repeat(70),
            lastName: 'Doe'.repeat(90),
            email: 'john.doe'.repeat(32) + '@example.net',
            cgu: true,
          };

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const errors = await catchErr(userValidator.validate)({ user });

          // then
expect((errors as $TSFixMe).invalidAttributes).to.have.lengthOf(3);
          expect(errors).to.be.instanceOf(EntityValidationError);
          expect((errors as $TSFixMe).invalidAttributes[0]).to.deep.equal(expectedFirstNameError);
          expect((errors as $TSFixMe).invalidAttributes[1]).to.deep.equal(expectedLastNameError);
          expect((errors as $TSFixMe).invalidAttributes[2]).to.deep.equal(expectedMaxLengthEmailError);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "mustValidateTermsOfService" when incorrect', async function () {
          // given
          const expectedError = {
            attribute: 'mustValidateTermsOfService',
            message: '"mustValidateTermsOfService" must be a boolean',
          };
          user.mustValidateTermsOfService = 'not_a_boolean';

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const errors = await catchErr(userValidator.validate)({ user });

          // then
          _assertErrorMatchesWithExpectedOne(errors, expectedError);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "hasSeenAssessmentInstructions" when incorrect', async function () {
          // given
          const expectedError = {
            attribute: 'hasSeenAssessmentInstructions',
            message: '"hasSeenAssessmentInstructions" must be a boolean',
          };

          user.hasSeenAssessmentInstructions = 1;

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const errors = await catchErr(userValidator.validate)({ user });

          // then
          _assertErrorMatchesWithExpectedOne(errors, expectedError);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validation is for student dependent user', function () {
      const cguRequired = false;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        user = new User({
          firstName: 'John',
          lastName: 'Doe',
          username: 'john.doe1212',
          password: 'Password1234',
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when validation is successful', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not throw any error', function () {
          expect(userValidator.validate({ user, cguRequired })).to.not.throw;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user data validation fails', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when user is undefined', function () {
          // given
          const expectedError = {
            attribute: undefined,
            message: 'EMPTY_INPUT',
          };

          // when
          try {
            userValidator.validate({ user: undefined, cguRequired });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "first name" when first name is missing', function () {
          // given
          const expectedError = {
            attribute: 'firstName',
            message: 'EMPTY_FIRST_NAME',
          };
          user.firstName = MISSING_VALUE;

          // when
          try {
            userValidator.validate({ user, cguRequired });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "last name" when last name is missing', function () {
          // given
          const expectedError = {
            attribute: 'lastName',
            message: 'EMPTY_LAST_NAME',
          };
          user.lastName = MISSING_VALUE;

          // when
          try {
            userValidator.validate({ user, cguRequired });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error on field "username" when username is missing', function () {
          // given
          const expectedError = {
            attribute: 'username',
            message: 'EMPTY_USERNAME',
          };
          user.username = MISSING_VALUE;

          // when
          try {
            userValidator.validate({ user, cguRequired });
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with errors on all fields (but only once by field) when all fields are missing', async function () {
          // given
          user = {
            firstName: '',
            lastName: '',
            username: '',
          };

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(userValidator.validate)({ user, cguRequired });

          // then
expect((error as $TSFixMe).invalidAttributes).to.have.lengthOf(3);
        });
      });
    });
  });
});
