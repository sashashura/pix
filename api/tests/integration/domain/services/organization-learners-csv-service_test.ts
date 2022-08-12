// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
const { CsvImportError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationLearnersCsvService = require('../../../../lib/domain/services/organization-learners-csv-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = getI18n();

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Services | organization-learners-csv-service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('extractOrganizationLearnersInformation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should parse two organizationLearners information', async function () {
      // given
      const organization = { id: 123, isAgriculture: true };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-csv-with-two-valid-students.csv`;
      const expectedOrganizationLearners = [
        {
          lastName: 'Corse',
          preferredLastName: 'Cottonmouth',
          firstName: 'Léa',
          middleName: 'Jeannette',
          thirdName: 'Klervi',
          birthdate: '1990-01-01',
          birthCityCode: '2A214',
          birthCity: undefined,
          birthCountryCode: '100',
          birthProvinceCode: '2A',
          MEFCode: 'MEF1',
          status: 'AP',
          nationalStudentId: '4581234567F',
          division: 'Division 2',
          sex: null,
        },
        {
          lastName: 'Corse',
          preferredLastName: undefined,
          firstName: 'Léo',
          middleName: undefined,
          thirdName: undefined,
          birthdate: '1990-01-01',
          birthCityCode: undefined,
          birthCity: 'Plymouth',
          birthCountryCode: '132',
          birthProvinceCode: '99',
          MEFCode: 'MEF1',
          status: 'ST',
          nationalStudentId: '4581234567G',
          division: 'Division 1',
          sex: null,
        },
      ];

      // when
      const results = await organizationLearnersCsvService.extractOrganizationLearnersInformation(
        path,
        organization,
        i18n
      );

      //then
      const actualResult = _.map(results, (result: $TSFixMe) => _.omit(result, ['id', 'organizationId', 'userId', 'updatedAt', 'isDisabled'])
      );
      expect(actualResult).to.deep.equal(expectedOrganizationLearners);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when the encoding is not supported it throws an error', async function () {
      // given
      const organization = { id: 123, isAgriculture: true };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-csv-with-unknown-encoding.csv`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersCsvService.extractOrganizationLearnersInformation)(
        path,
        organization,
        i18n
      );

      //then
      expect(error).to.be.instanceof(CsvImportError);
      expect((error as $TSFixMe).code).to.equal('ENCODING_NOT_SUPPORTED');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should abort parsing and reject with duplicate national student id error', async function () {
      // given
      const organization = { id: 123, isAgriculture: true };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-csv-with-duplicate-national-student-id.csv`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersCsvService.extractOrganizationLearnersInformation)(
        path,
        organization,
        i18n
      );

      //then
      expect(error).to.be.instanceof(CsvImportError);
      expect((error as $TSFixMe).code).to.equal('IDENTIFIER_UNIQUE');
      expect((error as $TSFixMe).meta).to.deep.equal({ field: 'Identifiant unique*', line: 3 });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should abort parsing and reject with missing national student id error', async function () {
      // given
      const organization = { id: 123, isAgriculture: true };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-csv-with-no-national-student-id.csv`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersCsvService.extractOrganizationLearnersInformation)(
        path,
        organization,
        i18n
      );

      //then
      expect(error).to.be.instanceof(CsvImportError);
      expect((error as $TSFixMe).code).to.equal('FIELD_REQUIRED');
      expect((error as $TSFixMe).meta).to.deep.equal({ field: 'Identifiant unique*', line: 2 });
    });
  });
});
