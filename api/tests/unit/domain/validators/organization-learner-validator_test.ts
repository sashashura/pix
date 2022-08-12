// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkValid... Remove this comment to see the full error message
  checkValidation,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRANCE_COU... Remove this comment to see the full error message
  FRANCE_COUNTRY_CODE,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/validators/organization-learner-validator');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Organization Learner validator', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#checkValidation', function () {
    const validAttributes = {
      nationalIdentifier: '12345',
      firstName: 'Ellen',
      lastName: 'Ripley',
      birthdate: '1979-05-25',
      organizationId: 1,
      birthCity: 'city1',
      birthCityCode: 'city1',
      birthProvinceCode: '10',
      birthCountryCode: '99125',
      status: 'ST',
      MEFCode: 'ABCDE',
      division: 'EDCBA',
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all required fields are presents', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('is valid', async function () {
        try {
          checkValidation(validAttributes);
        } catch (e) {
          expect.fail('OrganizationLearner is valid when all required fields are present');
        }
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('required fields', function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      [
        'firstName',
        'lastName',
        'birthdate',
        'nationalIdentifier',
        'birthProvinceCode',
        'birthProvinceCode',
        'status',
        'MEFCode',
        'division',
        'organizationId',
      ].forEach((field) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`throw an error when ${field} is missing`, async function () {
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(checkValidation)({ ...validAttributes, [field]: undefined });

          expect((error as $TSFixMe).key).to.equal(field);
          expect((error as $TSFixMe).why).to.equal('required');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('fields with a a max length of 255 characters', function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      [
        'firstName',
        'middleName',
        'thirdName',
        'lastName',
        'preferredLastName',
        'nationalIdentifier',
        'birthCity',
        'MEFCode',
        'division',
      ].forEach((field) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`throw an error when ${field} has more than 255 characters`, async function () {
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(checkValidation)({ ...validAttributes, [field]: '1'.repeat(256) });

          expect((error as $TSFixMe).key).to.equal(field);
          expect((error as $TSFixMe).why).to.equal('max_length');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('birthProvinceCode', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birthProvinceCode has more than 3 characters', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({ ...validAttributes, birthProvinceCode: '1234' });

        expect((error as $TSFixMe).key).to.equal('birthProvinceCode');
        expect((error as $TSFixMe).why).to.equal('max_length');
        expect((error as $TSFixMe).limit).to.equal(3);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birthProvinceCode has lass than 2 characters', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({ ...validAttributes, birthProvinceCode: '1' });
        expect((error as $TSFixMe).key).to.equal('birthProvinceCode');
        expect((error as $TSFixMe).why).to.equal('min_length');
        expect((error as $TSFixMe).limit).to.equal(2);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('birthCountryCode', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('is valid', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('respects INSEE Code, only number', async function () {
          try {
            checkValidation({ ...validAttributes, birthCountryCode: '99123' });
          } catch (e) {
            expect.fail('OrganizationLearner is valid birthCountryCode respect INSEE code');
          }
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birthCountryCode before birthCityCode', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({
          ...validAttributes,
          birthCityCode: '',
          birthCountryCode: '12345',
        });

        expect((error as $TSFixMe).key).to.equal('birthCountryCode');
        expect((error as $TSFixMe).why).to.equal('not_valid_insee_code');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birthCountryCode before birthCity', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({ ...validAttributes, birthCity: '', birthCountryCode: '12345' });

        expect((error as $TSFixMe).key).to.equal('birthCountryCode');
        expect((error as $TSFixMe).why).to.equal('not_valid_insee_code');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birthCountryCode has not 5 characters', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({ ...validAttributes, birthCountryCode: '123456' });

        expect((error as $TSFixMe).key).to.equal('birthCountryCode');
        expect((error as $TSFixMe).why).to.equal('length');
        expect((error as $TSFixMe).limit).to.equal(5);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birthCountryCode not start with 99', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({ ...validAttributes, birthCountryCode: '88123' });

        expect((error as $TSFixMe).key).to.equal('birthCountryCode');
        expect((error as $TSFixMe).why).to.equal('not_valid_insee_code');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birthCountryCode contains letter', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({ ...validAttributes, birthCountryCode: '2B122' });

        expect((error as $TSFixMe).key).to.equal('birthCountryCode');
        expect((error as $TSFixMe).why).to.equal('not_valid_insee_code');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('status', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("throw an error when status is not 'ST'", async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({ ...validAttributes, status: 'AA' });

        expect((error as $TSFixMe).key).to.equal('status');
        expect((error as $TSFixMe).why).to.equal('bad_values');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("is valid when status is 'ST'", async function () {
        try {
          checkValidation({ ...validAttributes, status: 'ST' });
        } catch (e) {
          expect.fail("OrganizationLearner is valid when status is 'ST'");
        }
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("is valid when status is 'AP'", async function () {
        try {
          checkValidation({ ...validAttributes, nationalIdentifier: '0123456789F', status: 'AP' });
        } catch (e) {
          expect.fail("OrganizationLearner is valid when status is 'AP'");
        }
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('birthdate', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when birthdate is not a date', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(checkValidation)({ ...validAttributes, birthdate: '123456' });

          expect((error as $TSFixMe).key).to.equal('birthdate');
          expect((error as $TSFixMe).why).to.equal('not_a_date');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when birthdate has not a valid format', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(checkValidation)({ ...validAttributes, birthdate: '2020/01/01' });

          expect((error as $TSFixMe).key).to.equal('birthdate');
          expect((error as $TSFixMe).why).to.equal('not_a_date');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when birthdate is null', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an error', async function () {
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(checkValidation)({ ...validAttributes, birthdate: null });

          expect((error as $TSFixMe).key).to.equal('birthdate');
          expect((error as $TSFixMe).why).to.equal('required');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('birthCity', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throw an error when birth country is not France and birthCity is undefined', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkValidation)({
          ...validAttributes,
          birthCountryCode: '99125',
          birthCity: undefined,
        });

        expect((error as $TSFixMe).key).to.equal('birthCity');
        expect((error as $TSFixMe).why).to.equal('required');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('is valid when birthCity is undefined and birthCountry is France', async function () {
        try {
          checkValidation({
            ...validAttributes,
            birthCountryCode: FRANCE_COUNTRY_CODE,
            birthCityCode: '51430',
            birthCity: undefined,
          });
        } catch (e) {
          expect.fail('OrganizationLearner is valid when birthCity is undefined and birthCountry is France');
        }
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('birthCityCode', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('is valid', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when birthCountryCode equal to France', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('respects INSEE Code, with one letter', async function () {
            try {
              checkValidation({ ...validAttributes, birthCountryCode: FRANCE_COUNTRY_CODE, birthCityCode: '2B125' });
            } catch (e) {
              expect.fail('OrganizationLearner is valid birthCityCode respect INSEE code, like Corsica');
            }
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('respects INSEE Code, only number', async function () {
            try {
              checkValidation({ ...validAttributes, birthCountryCode: FRANCE_COUNTRY_CODE, birthCityCode: '13125' });
            } catch (e) {
              expect.fail('OrganizationLearner is valid birthCityCode respect INSEE code, like Corsica');
            }
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when birthCountryCode not equal to France', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('is valid with birthCityCode undefined', async function () {
            try {
              checkValidation({ ...validAttributes, birthCountryCode: '99125', birthCityCode: undefined });
            } catch (e) {
              expect.fail('OrganizationLearner is valid when birthCity is undefined and birthCountry is not France');
            }
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('is invalid', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when birthCountryCode is equal to France', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throw an error with a birthCityCode of 5 characters', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(checkValidation)({
              ...validAttributes,
              birthCountryCode: FRANCE_COUNTRY_CODE,
              birthCityCode: '123456',
            });

            expect((error as $TSFixMe).key).to.equal('birthCityCode');
            expect((error as $TSFixMe).why).to.equal('length');
            expect((error as $TSFixMe).limit).to.equal(5);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error with a birthCityCode which has a letter not in second character', async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(checkValidation)({
              ...validAttributes,
              birthCountryCode: FRANCE_COUNTRY_CODE,
              birthCityCode: '21B22',
            });

            expect((error as $TSFixMe).key).to.equal('birthCityCode');
            expect((error as $TSFixMe).why).to.equal('not_valid_insee_code');
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when birthCountryCode is not equal to France', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an error with a birthCityCode of 256 characters', async function () {
            const stringOf256Char =
              'hZSJIp6WBhnZFxsnTxEQo1oSoWkRDSB8nQsbScrK9IfAmVGb1PFNdX333k6Tsn6YKHfebdRg2VryzQcY06GTm1sYIN9Y3B0uy1ZsZIFpZ3cQNLxnawaUfVQFylq1GFba9LNDowH7lISfn7HJbdf3hNawofdCbVNgRdw7ZAN8XdggDJUgyAs91GpQ6vCkrxa08AMYTI8QClkhUVazVGgwndtwN4EBG23K2AfayHKWVi6jSlPOgUrx4tgSAcxELxW2';
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(checkValidation)({ ...validAttributes, birthCityCode: stringOf256Char });

            expect((error as $TSFixMe).key).to.equal('birthCityCode');
            expect((error as $TSFixMe).why).to.equal('max_length');
            expect((error as $TSFixMe).limit).to.equal(255);
          });
        });
      });
    });
  });
});
