// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SiecleXmlI... Remove this comment to see the full error message
const { SiecleXmlImportError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const organizationLearnersXmlService = require('../../../../lib/domain/services/organization-learners-xml-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Services | organization-learnerz-xml-service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('extractOrganizationLearnersInformationFromSIECLE', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should parse two organizationLearners information', async function () {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-two-valid-students.xml`;
      const expectedOrganizationLearners = [
        {
          lastName: 'HANDMADE',
          preferredLastName: '',
          firstName: 'Luciole',
          middleName: 'Léa',
          thirdName: 'Lucy',
          sex: 'F',
          birthdate: '1994-12-31',
          birthCityCode: '33318',
          birthCity: null,
          birthCountryCode: '100',
          birthProvinceCode: '033',
          MEFCode: '123456789',
          status: 'AP',
          nationalStudentId: '00000000123',
          division: '4A',
        },
        {
          lastName: 'COVERT',
          preferredLastName: 'COJAUNE',
          firstName: 'Harry',
          middleName: 'Cocœ',
          thirdName: '',
          sex: 'M',
          birthdate: '1994-07-01',
          birthCity: 'LONDRES',
          birthCityCode: null,
          birthCountryCode: '132',
          birthProvinceCode: null,
          MEFCode: '12341234',
          status: 'ST',
          nationalStudentId: '00000000124',
          division: '4A',
        },
      ];

      // when
      const result = await organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE(
        path,
        organization
      );

      //then
      expect(result).to.deep.equal(expectedOrganizationLearners);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not parse organizationLearners who are no longer in the school', async function () {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-registrations-no-longer-in-school.xml`;
      const expectedOrganizationLearners: $TSFixMe = [];

      // when
      const result = await organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE(
        path,
        organization
      );

      //then
      expect(result).to.deep.equal(expectedOrganizationLearners);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should abort parsing and reject with not valid UAI error', async function () {
      // given
      const wrongUAIFromSIECLE = '123ABC';
      const organization = { externalId: wrongUAIFromSIECLE };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-wrong-uai.xml`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE)(
        path,
        organization
      );

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect((error as $TSFixMe).code).to.equal('UAI_MISMATCHED');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should abort parsing and reject with not valid UAI error if UAI is missing', async function () {
      // given
      const wrongUAIFromSIECLE = '123ABC';
      const organization = { externalId: wrongUAIFromSIECLE };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-no-uai.xml`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE)(
        path,
        organization
      );

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect((error as $TSFixMe).code).to.equal('UAI_MISMATCHED');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should abort parsing and reject with duplicate national student id error', async function () {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-duplicate-national-student-id.xml`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE)(
        path,
        organization
      );

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect((error as $TSFixMe).code).to.equal('INE_UNIQUE');
      expect((error as $TSFixMe).meta).to.deep.equal({ nationalStudentId: '00000000123' });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should abort parsing and reject with duplicate national student id error and tag not correctly closed', async function () {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-duplicate-national-student-id-and-unclosed-tag.xml`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE)(
        path,
        organization
      );

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect((error as $TSFixMe).code).to.equal('INE_UNIQUE');
      expect((error as $TSFixMe).meta).to.deep.equal({ nationalStudentId: '00000000123' });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should abort parsing and reject with missing national student id error', async function () {
      // given
      const validUAIFromSIECLE = '123ABC';
      const organization = { externalId: validUAIFromSIECLE };
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      const path = `${process.cwd()}/tests/tooling/fixtures/siecle-file/siecle-with-no-national-student-id.xml`;
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(organizationLearnersXmlService.extractOrganizationLearnersInformationFromSIECLE)(
        path,
        organization
      );

      //then
      expect(error).to.be.instanceof(SiecleXmlImportError);
      expect((error as $TSFixMe).code).to.equal('INE_REQUIRED');
    });
  });
});
