// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationCreationValidator = require('../../../../lib/domain/validators/organization-creation-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MISSING_VA... Remove this comment to see the full error message
const MISSING_VALUE = '';

function _assertErrorMatchesWithExpectedOne(entityValidationErrors: $TSFixMe, expectedError: $TSFixMe) {
  expect(entityValidationErrors).to.be.instanceOf(EntityValidationError);
  expect(entityValidationErrors.invalidAttributes).to.have.lengthOf(1);
  expect(entityValidationErrors.invalidAttributes[0]).to.deep.equal(expectedError);
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Validators | organization-validator', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when validation is successful', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw any error', function () {
        // given
        const organizationCreationParams = { name: 'ACME', type: 'PRO', documentationUrl: 'https://kingArthur.com' };

        // when/then
        expect(organizationCreationValidator.validate(organizationCreationParams)).to.not.throw;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when organization data validation fails', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on name attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when name is missing', function () {
          // given
          const expectedError = {
            attribute: 'name',
            message: 'Le nom n’est pas renseigné.',
          };
          const organizationCreationParams = { name: MISSING_VALUE, type: 'PRO' };

          try {
            // when
            organizationCreationValidator.validate(organizationCreationParams);
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on type attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when type is missing', function () {
          // given
          const expectedError = [
            {
              attribute: 'type',
              message: 'Le type de l’organisation doit avoir l’une des valeurs suivantes: SCO, SUP, PRO.',
            },
            {
              attribute: 'type',
              message: 'Le type n’est pas renseigné.',
            },
          ];

          const organizationCreationParams = { name: 'ACME', type: MISSING_VALUE };

          try {
            // when
            organizationCreationValidator.validate(organizationCreationParams);
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
expect((errors as $TSFixMe).invalidAttributes).to.have.length(2);
            expect((errors as $TSFixMe).invalidAttributes).to.have.deep.equal(expectedError);
          }
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when type value is not SUP, SCO or PRO', function () {
          // given
          const expectedError = {
            attribute: 'type',
            message: 'Le type de l’organisation doit avoir l’une des valeurs suivantes: SCO, SUP, PRO.',
          };
          const organizationCreationParams = { name: 'ACME', type: 'PTT' };

          try {
            // when
            organizationCreationValidator.validate(organizationCreationParams);
            expect.fail('should have thrown an error');
          } catch (errors) {
            // then
            _assertErrorMatchesWithExpectedOne(errors, expectedError);
          }
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        ['SUP', 'SCO', 'PRO'].forEach((type) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should not throw with ${type} as type`, function () {
            // given
            const organizationCreationParams = { name: 'ACME', type };

            // when/then
            return expect(organizationCreationValidator.validate(organizationCreationParams)).to.not.throw;
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('on documentationUrl attribute', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reject with error when documentationUrl is invalide', async function () {
          // given
          const organizationCreationParams = { name: 'ACME', type: 'PRO', documentationUrl: 'invalidUrl' };
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(organizationCreationValidator.validate)(organizationCreationParams);

          // then
expect((error as $TSFixMe).invalidAttributes[0].attribute).to.equal('documentationUrl');
          expect((error as $TSFixMe).invalidAttributes[0].message).to.equal('Le lien vers la documentation n’est pas valide.');
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject with errors on all fields (but only once by field) when all fields are missing', function () {
        // given
        const organizationCreationParams = { name: MISSING_VALUE, type: MISSING_VALUE };

        try {
          // when
          organizationCreationValidator.validate(organizationCreationParams);
          expect.fail('should have thrown an error');
        } catch (errors) {
          // then
expect((errors as $TSFixMe).invalidAttributes).to.have.lengthOf(3);
        }
      });
    });
  });
});
