// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerParser = require('../../../../../lib/infrastructure/serializers/csv/organization-learner-parser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearnerColumns = require('../../../../../lib/infrastructure/serializers/csv/organization-learner-columns');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../../tooling/i18n/i18n');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = getI18n();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationLearnerCsvColumns = new OrganizationLearnerColumns(i18n).columns
  .map((column: $TSFixMe) => column.label)
  .join(';');
const COL_TO_REMOVE = 'Code sexe*';
const organizationLearnerCsvColumnsWithoutSexCode = new OrganizationLearnerColumns(i18n).columns
  .map((column: $TSFixMe) => column.label)
  .filter((col: $TSFixMe) => col !== COL_TO_REMOVE)
  .join(';');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | OrganizationLearnerParser', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the header is not correctly formed', function () {
    const organizationId = 123;

    const fieldList = [
      'Identifiant unique*',
      'Nom de famille*',
      'Date de naissance (jj/mm/aaaa)*',
      'Code département naissance*',
      'Code pays naissance*',
      'Statut*',
      'Code MEF*',
      'Division*',
    ];
    // eslint-disable-next-line mocha/no-setup-in-describe
    fieldList.forEach((field) => {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(`when the ${field} column is missing`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an CsvImportError', async function () {
          let input = organizationLearnerCsvColumns.replace(`${field}`, '');
          input = input.replace(';;', ';');
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new OrganizationLearnerParser(encodedInput, organizationId, i18n);

          const error = await catchErr(parser.parse, parser)();

          expect((error as $TSFixMe).code).to.equal('HEADER_REQUIRED');
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the Premier prénom* column is missing', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an CsvImportError', async function () {
        const input = organizationLearnerCsvColumns.replace('Premier prénom*;', '');
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new OrganizationLearnerParser(encodedInput, organizationId, i18n);

        const error = await catchErr(parser.parse, parser)();

        expect((error as $TSFixMe).code).to.equal('ENCODING_NOT_SUPPORTED');
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the header is correctly formed', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no line', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns no organization learners', function () {
        const input = organizationLearnerCsvColumns;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new OrganizationLearnerParser(encodedInput, 123, i18n);

        const { learners } = parser.parse();

        expect(learners).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are lines', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the data are correct', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context("when csv has 'Sex code' column", function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('returns an organization learner for each line', function () {
            const input = `${organizationLearnerCsvColumns}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
            456F;O-Ren;;;Ishii;Cottonmouth;2;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
            `;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, 456, i18n);

            const { learners } = parser.parse();
            expect(learners).to.have.lengthOf(2);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('returns an organization learner for each line using the CSV column', function () {
            const input = `${organizationLearnerCsvColumns}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;M;01/01/1970;97422;;974;99100;ST;MEF1;Division 1;
            0123456789F;O-Ren;;;Ishii;Cottonmouth;f;01/01/1980;;Shangai;99;99132;AP;MEF1;Division 2;
            `;
            const organizationId = 789;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, organizationId, i18n);

            const { learners } = parser.parse();
            expect(learners[0]).to.includes({
              nationalStudentId: '123F',
              firstName: 'Beatrix',
              middleName: 'The',
              thirdName: 'Bride',
              lastName: 'Kiddo',
              preferredLastName: 'Black Mamba',
              sex: 'M',
              birthdate: '1970-01-01',
              birthCityCode: '97422',
              birthProvinceCode: '974',
              birthCountryCode: '100',
              status: 'ST',
              MEFCode: 'MEF1',
              division: 'Division 1',
              organizationId,
            });

            expect(learners[1]).to.includes({
              nationalStudentId: '0123456789F',
              firstName: 'O-Ren',
              lastName: 'Ishii',
              preferredLastName: 'Cottonmouth',
              sex: 'F',
              birthdate: '1980-01-01',
              birthCity: 'Shangai',
              birthProvinceCode: '99',
              birthCountryCode: '132',
              status: 'AP',
              MEFCode: 'MEF1',
              division: 'Division 2',
              organizationId,
            });
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context("when csv does not have 'Sex code' column", function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('returns an organization learner for each line', function () {
            const input = `${organizationLearnerCsvColumnsWithoutSexCode}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
            456F;O-Ren;;;Ishii;Cottonmouth;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
            `;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, 456, i18n);

            const { learners } = parser.parse();
            expect(learners).to.have.lengthOf(2);
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('returns organization learner for each line using the CSV column', function () {
            const input = `${organizationLearnerCsvColumnsWithoutSexCode}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;974;99100;ST;MEF1;Division 1;
            0123456789F;O-Ren;;;Ishii;Cottonmouth;01/01/1980;;Shangai;99;99132;AP;MEF1;Division 2;
            `;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, 456, i18n);

            const { learners } = parser.parse();
            expect(learners[0]).to.includes({
              nationalStudentId: '123F',
              firstName: 'Beatrix',
              middleName: 'The',
              thirdName: 'Bride',
              lastName: 'Kiddo',
              preferredLastName: 'Black Mamba',
              sex: null,
              birthdate: '1970-01-01',
              birthCityCode: '97422',
              birthProvinceCode: '974',
              birthCountryCode: '100',
              status: 'ST',
              MEFCode: 'MEF1',
              division: 'Division 1',
              organizationId: 456,
            });

            expect(learners[1]).to.includes({
              nationalStudentId: '0123456789F',
              firstName: 'O-Ren',
              lastName: 'Ishii',
              preferredLastName: 'Cottonmouth',
              sex: null,
              birthdate: '1980-01-01',
              birthCity: 'Shangai',
              birthProvinceCode: '99',
              birthCountryCode: '132',
              status: 'AP',
              MEFCode: 'MEF1',
              division: 'Division 2',
              organizationId: 456,
            });
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when division has spaces', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should trim division', function () {
            const input = `${organizationLearnerCsvColumns}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/01/1970;97422;;200;99100;ST;MEF1;  Division 1 ;
            `;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, 456, i18n);

            const { learners } = parser.parse();
            expect(learners[0].division).to.equal('Division 1');
          });

          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should remove extra space on division', function () {
            const input = `${organizationLearnerCsvColumns}
            123F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/01/1970;97422;;200;99100;ST;MEF1;Division     1;
            `;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, 456, i18n);

            const { learners } = parser.parse();
            expect(learners[0].division).to.equal('Division 1');
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('When the organization is Agriculture and file contain status AP', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return organization learner with nationalStudentId', function () {
            const input = `${organizationLearnerCsvColumns}
            0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/01/1970;97422;;974;99100;AP;MEF1;Division 1;
            `;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, 123, i18n);

            const { learners } = parser.parse();
            expect(learners[0]).to.includes({
              nationalStudentId: '0123456789F',
              status: 'AP',
            });
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the data are not correct', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an EntityValidationError with malformated birthCountryCode', async function () {
          //given
          const wrongData = 'FRANC';
          const input = `${organizationLearnerCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/01/1980;97422;;200;${wrongData};ST;MEF1;Division 1;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new OrganizationLearnerParser(encodedInput, 123, i18n);

          const error = await catchErr(parser.parse, parser)();

          //then
expect((error as $TSFixMe).code).to.equal('INSEE_CODE_INVALID');
          expect((error as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'Code pays naissance*' });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an EntityValidationError with malformated birthCityCode', async function () {
          //given
          const wrongData = 'A1234';
          const input = `${organizationLearnerCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/01/1980;${wrongData};;974;99100;ST;MEF1;Division 1;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new OrganizationLearnerParser(encodedInput, 123, i18n);

          const error = await catchErr(parser.parse, parser)();

          //then
          expect(error).to.be.an.instanceOf(CsvImportError);
          expect((error as $TSFixMe).code).to.equal('INSEE_CODE_INVALID');
          expect((error as $TSFixMe).meta).to.deep.equal({ line: 2, field: 'Code commune naissance**' });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('When the organization is Agriculture and file contain status AP', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should return organization learner with nationalStudentId', function () {
            const input = `${organizationLearnerCsvColumns}
            0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/01/1970;97422;;974;99100;AP;MEF1;Division 1;
            `;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new OrganizationLearnerParser(encodedInput, 123, i18n);

            const { learners } = parser.parse();
            expect(learners[0]).to.includes({
              nationalStudentId: '0123456789F',
              status: 'AP',
            });
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('When csv has duplicates on national identifier', function () {
          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when organization is SCO', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('should throw an CsvImportError even with different status', async function () {
              const input = `${organizationLearnerCsvColumns}
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/05/1986;97422;;200;99100;ST;MEF1;Division 1;
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;1;01/05/1986;97422;;200;99100;AP;MEF1;Division 1;
              `;

              const encodedInput = iconv.encode(input, 'utf8');
              const parser = new OrganizationLearnerParser(encodedInput, 123, i18n);

              const error = await catchErr(parser.parse, parser)();

              //then
expect((error as $TSFixMe).code).to.equal('IDENTIFIER_UNIQUE');
              expect((error as $TSFixMe).meta).to.deep.equal({ line: 3, field: 'Identifiant unique*' });
            });
          });
        });
      });
    });
  });
});
