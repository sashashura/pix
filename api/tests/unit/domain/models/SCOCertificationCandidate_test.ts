// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SCOCertifi... Remove this comment to see the full error message
const SCOCertificationCandidate = require('../../../../lib/domain/models/SCOCertificationCandidate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
const { InvalidCertificationCandidate } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | SCO Certification Candidate', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('validate', function () {
    const buildSCOCertificationCandidate = (attributes: $TSFixMe) => new SCOCertificationCandidate(attributes);
    const validAttributes = {
      firstName: 'Oren',
      lastName: 'Ishii',
      birthdate: '2010-01-01',
      sex: 'F',
      birthINSEECode: '75101',
      sessionId: 123,
      organizationLearnerId: 456,
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all required fields are presents', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be ok when object is valid', function () {
        try {
          buildSCOCertificationCandidate(validAttributes);
        } catch (e) {
          expect.fail('scoCertificationCandidate is valid when all required fields are present');
        }
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    ['firstName', 'lastName'].forEach((field) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error when field ${field} is not a string`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, [field]: 123 });

        expect(error).to.be.instanceOf(InvalidCertificationCandidate);
        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('not_a_string');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error when field ${field} is not present`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, [field]: undefined });

        expect(error).to.be.instanceOf(InvalidCertificationCandidate);
        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('required');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error when field ${field} is not present because null`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, [field]: null });

        expect(error).to.be.instanceOf(InvalidCertificationCandidate);
        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('required');
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    ['sex', 'birthINSEECode'].forEach((field) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error when field ${field} is not a string`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, [field]: 123 });

        expect(error).to.be.instanceOf(InvalidCertificationCandidate);
        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('not_a_string');
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    ['sessionId', 'organizationLearnerId'].forEach((field) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error when field ${field} is not a number`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, [field]: 'salut' });

        expect(error).to.be.instanceOf(InvalidCertificationCandidate);
        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('not_a_number');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error when field ${field} is not present`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, [field]: undefined });

        expect(error).to.be.instanceOf(InvalidCertificationCandidate);
        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('required');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error when field ${field} is not present because null`, async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, [field]: null });

        expect(error).to.be.instanceOf(InvalidCertificationCandidate);
        expect((error as $TSFixMe).key).to.equal(field);
        expect((error as $TSFixMe).why).to.equal('required');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should validate when birthCity is an empty string', async function () {
      try {
        buildSCOCertificationCandidate({
          ...validAttributes,
          birthCity: '',
        });
      } catch (e) {
        expect.fail('scoCertificationCandidate is valid when all required fields are present');
      }
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when birthdate is not a date', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(buildSCOCertificationCandidate)({
        ...validAttributes,
        birthdate: 'je mange des fruits',
      });

      expect(error).to.be.instanceOf(InvalidCertificationCandidate);
      expect((error as $TSFixMe).key).to.equal('birthdate');
      expect((error as $TSFixMe).why).to.equal('date_format');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when birthdate is not a valid format', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, birthdate: '2020/02/02' });

      expect(error).to.be.instanceOf(InvalidCertificationCandidate);
      expect((error as $TSFixMe).key).to.equal('birthdate');
      expect((error as $TSFixMe).why).to.equal('date_format');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when birthdate is null', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, birthdate: null });

      expect(error).to.be.instanceOf(InvalidCertificationCandidate);
      expect((error as $TSFixMe).key).to.equal('birthdate');
      expect((error as $TSFixMe).why).to.equal('required');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error when birthdate is not present', async function () {
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(buildSCOCertificationCandidate)({ ...validAttributes, birthdate: undefined });

      expect(error).to.be.instanceOf(InvalidCertificationCandidate);
      expect((error as $TSFixMe).key).to.equal('birthdate');
      expect((error as $TSFixMe).why).to.equal('required');
    });
  });
});
