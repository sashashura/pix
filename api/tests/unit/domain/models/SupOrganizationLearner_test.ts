// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
const SupOrganizationLearner = require('../../../../lib/domain/models/SupOrganizationLearner');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | SupOrganizationLearner', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validate', function () {
    const buildOrganizationLearner = (attributes: $TSFixMe) => new SupOrganizationLearner(attributes);

    const validAttributes = {
      studentNumber: 'A12345',
      firstName: 'Oren',
      lastName: 'Ishii',
      birthdate: '2020-01-01',
      organizationId: 123,
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all required fields are presents', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('is valid', async function () {
        try {
          new SupOrganizationLearner(validAttributes);
        } catch (e) {
          expect.fail('supOrganizationLearner is valid when all required fields are present');
        }
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    ['firstName', 'lastName', 'birthdate', 'studentNumber'].forEach((field) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`throw an error when ${field} is required`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, [field]: undefined });

        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('required');
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      'studentNumber',
      'firstName',
      'middleName',
      'thirdName',
      'lastName',
      'preferredLastName',
      'email',
      'diploma',
      'department',
      'educationalTeam',
      'group',
      'studyScheme',
    ].forEach((field) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`throw an error when string ${field} exceeds 255 characters`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, [field]: '1'.repeat(256) });

        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('max_length');
        expect((error as $TSFixMe).limit).to.equal(255);
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      'studentNumber',
      'firstName',
      'middleName',
      'thirdName',
      'lastName',
      'preferredLastName',
      'email',
      'diploma',
      'department',
      'educationalTeam',
      'group',
      'studyScheme',
    ].forEach((field) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`throw an error when ${field} is not a string`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, [field]: null });

        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('not_a_string');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throw an error when organizationId is not an integer', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, organizationId: 12.5 });

      expect((error as $TSFixMe).key).to.equal('organizationId');
      expect((error as $TSFixMe).why).to.equal('not_an_integer');
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when birthdate is not a date', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, birthdate: null });

        expect((error as $TSFixMe).key).to.equal('birthdate');
        expect((error as $TSFixMe).why).to.equal('required');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when birthdate has not a valid format', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, birthdate: '2020/02/01' });

        expect((error as $TSFixMe).key).to.equal('birthdate');
        expect((error as $TSFixMe).why).to.equal('date_format');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when birthdate is null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, birthdate: null });

        expect((error as $TSFixMe).key).to.equal('birthdate');
        expect((error as $TSFixMe).why).to.equal('required');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when email is not correctly formed', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an error', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, email: 'sdfsfsdf' });

        expect((error as $TSFixMe).key).to.equal('email');
        expect((error as $TSFixMe).why).to.equal('email_format');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('student number', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when student number is not correctly formed', function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        ['#123457', '1 23457', '1.23457', '1,23457E+11', 'gégé'].forEach((value) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`throw an error when student number is ${value}`, async function () {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const error = await catchErr(buildOrganizationLearner)({ ...validAttributes, studentNumber: value });

            expect((error as $TSFixMe).why).to.equal('student_number_format');
            expect((error as $TSFixMe).key).to.equal('studentNumber');
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when student number is correctly formed', function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        ['123456', '1234aA', '1-a-B', '1_a_B'].forEach((value) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`throw an error when student number is ${value}`, async function () {
            try {
              await buildOrganizationLearner({ ...validAttributes, studentNumber: value });
            } catch (e) {
              expect.fail('supOrganizationLearner is valid when student number is correctly formed');
            }
          });
        });
      });
    });
  });
});
