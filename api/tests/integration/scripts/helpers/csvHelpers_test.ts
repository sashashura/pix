// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
const { FileValidationError, NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCsvHe... Remove this comment to see the full error message
const { checkCsvHeader, parseCsvWithHeaderAndRequiredFields } = require('../../../../scripts/helpers/csvHelpers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | Helpers | csvHelpers.js', function () {
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const withValidHeaderFilePath = `${__dirname}/files/withValidHeader-test.csv`;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkCsvHeader', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw NotFoundError if file does not exist', async function () {
      // given
      const nonExistentFile = 'nonExistentFile.csv';
      const requiredFieldNames = ['createdBy'];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkCsvHeader)({
        filePath: nonExistentFile,
        requiredFieldNames,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw FileValidationError if required field names are empty', async function () {
      // given
      const requiredFieldNames: $TSFixMe = [];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkCsvHeader)({
        filePath: withValidHeaderFilePath,
        requiredFieldNames,
      });

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).code).to.equal('MISSING_REQUIRED_FIELD_NAMES');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw FileValidationError if required header field names are not present', async function () {
      // given
      const requiredFieldNames = ['foo'];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkCsvHeader)({
        filePath: withValidHeaderFilePath,
        requiredFieldNames,
      });

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).code).to.equal('MISSING_REQUIRED_FIELD_NAMES');
      expect((error as $TSFixMe).meta).to.equal('Headers missing: foo');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw if required header field names are present', async function () {
      // given
      const requiredFieldNames = ['name', 'createdBy'];

      // then
      expect(
        await checkCsvHeader({
          filePath: withValidHeaderFilePath,
          requiredFieldNames,
        })
      ).to.not.throw;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('parseCsvWithHeaderAndRequiredFields', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw FileValidationError if required field value is empty', async function () {
      // given
      const requiredFieldNames = ['createdBy', 'provinceCode'];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(parseCsvWithHeaderAndRequiredFields)({
        filePath: withValidHeaderFilePath,
        requiredFieldNames,
      });

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).code).to.equal('MISSING_REQUIRED_FIELD_VALUES');
      expect((error as $TSFixMe).meta).to.equal('Field values are required: createdBy,provinceCode');
    });
  });
});
