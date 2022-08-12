// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, FileValidationError } = require('../../../../lib/domain/errors');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCsvEx... Remove this comment to see the full error message
  checkCsvExtensionFile,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsv'.
  parseCsv,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'readCsvFil... Remove this comment to see the full error message
  readCsvFile,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'parseCsvWi... Remove this comment to see the full error message
  parseCsvWithHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCsvHe... Remove this comment to see the full error message
  checkCsvHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../scripts/helpers/csvHelpers');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Scripts | Helpers | csvHelpers.js', function () {
  const notExistFilePath = 'notExist.csv';
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const emptyFilePath = `${__dirname}/files/organizations-empty-file.csv`;
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const badExtensionFilePath = `${__dirname}/files/bad_extension.html`;
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const validFilePath = `${__dirname}/files/valid-organizations-test.csv`;
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const utf8FilePath = `${__dirname}/files/utf8_excel-test.csv`;
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  const withHeaderFilePath = `${__dirname}/files/withHeader-test.csv`;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#readCsvFile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFoundError when file does not exist', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(readCsvFile)(notExistFilePath);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect((error as $TSFixMe).message).to.equal(`File ${notExistFilePath} not found!`);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkCsvExtensionFile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a FileValidationError when file extension is not ".csv"', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkCsvExtensionFile)(badExtensionFilePath);

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).code).to.equal('INVALID_FILE_EXTENSION');
      expect((error as $TSFixMe).meta).to.deep.equal({ fileExtension: '.html' });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw if file is valid', async function () {
      // then
      expect(await checkCsvExtensionFile(validFilePath)).to.not.throw;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#parseCsv', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a NotFoundError when file does not exist', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(parseCsv)(notExistFilePath);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect((error as $TSFixMe).message).to.equal(`File ${notExistFilePath} not found!`);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should parse csv file with 3 lines', async function () {
      // given
      const options = { skipEmptyLines: true };

      // when
      const data = await parseCsv(validFilePath, options);

      // then
      expect(data.length).to.equal(3);
      expect(data[0][2]).to.equal('david.herault@pix.fr');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should cast the unexpected utf8 char add by Excel', async function () {
      // when
      const data = await parseCsv(utf8FilePath);

      // then
      expect(data.length).to.equal(4);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#parseCsvWithHeader', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should parse csv file with header', async function () {
      // given
      const expectedItems = [
        { uai: '0080017A', name: 'Collège Les Pixous' },
        { uai: '0080018B', name: 'Lycée Pix' },
        { uai: '0080040A', name: 'Lycée Tant Pix' },
      ];

      // when
      const items = await parseCsvWithHeader(withHeaderFilePath);

      // then
      expect(items.length).to.equal(3);
      expect(items).to.have.deep.members(expectedItems);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkCsvHeader', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw if headers does not match', async function () {
      // given
      const headers = ['uai', 'Name'];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkCsvHeader)({ filePath: withHeaderFilePath, requiredFieldNames: headers });

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).code).to.equal('MISSING_REQUIRED_FIELD_NAMES');
      expect((error as $TSFixMe).meta).to.equal('Headers missing: Name');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw if headers match', async function () {
      // given
      const headers = ['uai', 'name'];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkCsvHeader)({ filePath: withHeaderFilePath, requiredFieldNames: headers });

      // then
      expect(error).to.be.equal('should have thrown an error');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw if headers empty', async function () {
      // given
      const headers = ['uai', 'name'];

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkCsvHeader)({ filePath: emptyFilePath, requiredFieldNames: headers });

      // then
      expect(error).to.be.instanceOf(FileValidationError);
      expect((error as $TSFixMe).meta).to.equal('File is empty');
    });
  });
});
