// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const importOrganizationLearnersFromSIECLEFormat = require('../../../../lib/domain/usecases/import-organization-learners-from-siecle');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
const { FileValidationError, SiecleXmlImportError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationLearner = require('../../../../lib/domain/models/OrganizationLearner');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'i18n'.
const i18n = getI18n();

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | import-organization-learners-from-siecle', function () {
  const organizationUAI = '123ABC';
  const organizationId = 1234;
  let format: $TSFixMe;
  let organizationLearnersXmlServiceStub: $TSFixMe;
  let organizationLearnersCsvServiceStub: $TSFixMe;
  let organizationLearnerRepositoryStub: $TSFixMe;
  let organizationRepositoryStub: $TSFixMe;
  let payload: $TSFixMe = null;
  let domainTransaction: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(fs, 'unlink');
    sinon.stub(fs, 'readFile');
    domainTransaction = Symbol();
    sinon.stub(DomainTransaction, 'execute').callsFake((callback: $TSFixMe) => {
      return callback(domainTransaction);
    });
    format = 'xml';
    organizationLearnersXmlServiceStub = { extractOrganizationLearnersInformationFromSIECLE: sinon.stub() };
    organizationLearnersCsvServiceStub = { extractOrganizationLearnersInformation: sinon.stub() };
    organizationLearnerRepositoryStub = {
      addOrUpdateOrganizationOfOrganizationLearners: sinon.stub(),
      addOrUpdateOrganizationAgriOrganizationLearners: sinon.stub(),
      findByOrganizationId: sinon.stub(),
      disableAllOrganizationLearnersInOrganization: sinon.stub().resolves(),
    };
    organizationRepositoryStub = { get: sinon.stub() };
  });
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(function () {
    sinon.restore();
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when extracted organizationLearners informations can be imported', function () {
    payload = { path: 'file.csv' };
    const buffer = 'data';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      format = 'csv';
      fs.readFile.withArgs(payload.path).resolves(buffer);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the format is CSV', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save these informations', async function () {
        const organization = Symbol('organization');
        organizationRepositoryStub.get.withArgs(organizationId).resolves(organization);

        const organizationLearner1 = new OrganizationLearner({
          id: undefined,
          nationalStudentId: '123F',
          firstName: 'Beatrix',
          middleName: 'The',
          thirdName: 'Bride',
          lastName: 'Kiddo',
          preferredLastName: 'Black Mamba',
          birthdate: '1970-01-01',
          birthCityCode: '97422',
          birthProvinceCode: '974',
          birthCountryCode: '100',
          status: 'ST',
          MEFCode: 'MEF1',
          division: 'Division 1',
          organizationId,
        });
        const organizationLearner2 = new OrganizationLearner({
          id: undefined,
          nationalStudentId: '456F',
          firstName: 'O-Ren',
          lastName: 'Ishii',
          preferredLastName: 'Cottonmouth',
          birthdate: '1980-01-01',
          birthCity: 'Shangai',
          birthProvinceCode: '99',
          birthCountryCode: '132',
          status: 'ST',
          MEFCode: 'MEF1',
          division: 'Division 2',
          organizationId,
        });
        organizationLearnersCsvServiceStub.extractOrganizationLearnersInformation.returns([
          organizationLearner1,
          organizationLearner2,
        ]);

        await importOrganizationLearnersFromSIECLEFormat({
          organizationId,
          payload,
          format,
          organizationRepository: organizationRepositoryStub,
          organizationLearnersCsvService: organizationLearnersCsvServiceStub,
          organizationLearnersXmlService: organizationLearnersXmlServiceStub,
          organizationLearnerRepository: organizationLearnerRepositoryStub,
          i18n,
        });

        expect(organizationLearnerRepositoryStub.addOrUpdateOrganizationOfOrganizationLearners).to.have.been.called;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the format is XML', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        format = 'xml';
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save these informations', async function () {
        // given
        payload = { path: 'file.xml' };

        const extractedOrganizationLearnersInformations = [
          { lastName: 'UpdatedStudent1', nationalStudentId: 'INE1' },
          { lastName: 'UpdatedStudent2', nationalStudentId: 'INE2' },
          { lastName: 'StudentToCreate', nationalStudentId: 'INE3' },
        ];
        organizationRepositoryStub.get.withArgs(organizationId).resolves({ externalId: organizationUAI });
        organizationLearnersXmlServiceStub.extractOrganizationLearnersInformationFromSIECLE.returns(
          extractedOrganizationLearnersInformations
        );

        const organizationLearnersToUpdate = [
          { lastName: 'Student1', nationalStudentId: 'INE1' },
          { lastName: 'Student2', nationalStudentId: 'INE2' },
        ];
        organizationLearnerRepositoryStub.findByOrganizationId.resolves(organizationLearnersToUpdate);

        // when
        await importOrganizationLearnersFromSIECLEFormat({
          organizationId,
          payload,
          format,
          organizationRepository: organizationRepositoryStub,
          organizationLearnersXmlService: organizationLearnersXmlServiceStub,
          organizationLearnerRepository: organizationLearnerRepositoryStub,
        });

        // then
        const organizationLearners = [
          { lastName: 'UpdatedStudent1', nationalStudentId: 'INE1' },
          { lastName: 'UpdatedStudent2', nationalStudentId: 'INE2' },
          { lastName: 'StudentToCreate', nationalStudentId: 'INE3' },
        ];

        expect(
          organizationLearnersXmlServiceStub.extractOrganizationLearnersInformationFromSIECLE
        ).to.have.been.calledWith(payload.path, { externalId: organizationUAI });
        expect(organizationLearnerRepositoryStub.addOrUpdateOrganizationOfOrganizationLearners).to.have.been.calledWith(
          organizationLearners,
          organizationId
        );
        expect(organizationLearnerRepositoryStub.addOrUpdateOrganizationOfOrganizationLearners).to.not.throw();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should disable all previous organization learners', async function () {
      // given
      format = 'xml';
      payload = { path: 'file.xml' };

      const extractedOrganizationLearnersInformations = [{ nationalStudentId: 'INE1' }];
      organizationRepositoryStub.get.withArgs(organizationId).resolves({ externalId: organizationUAI });
      organizationLearnersXmlServiceStub.extractOrganizationLearnersInformationFromSIECLE.returns(
        extractedOrganizationLearnersInformations
      );

      organizationLearnerRepositoryStub.findByOrganizationId.resolves();

      // when
      await importOrganizationLearnersFromSIECLEFormat({
        organizationId,
        payload,
        format,
        organizationRepository: organizationRepositoryStub,
        organizationLearnersXmlService: organizationLearnersXmlServiceStub,
        organizationLearnerRepository: organizationLearnerRepositoryStub,
      });

      // then
      expect(
        organizationLearnerRepositoryStub.disableAllOrganizationLearnersInOrganization
      ).to.have.been.calledWithExactly({ domainTransaction, organizationId });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the import fails', function () {
    let error;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('because there is no organization learners imported', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        organizationRepositoryStub.get.withArgs(organizationId).resolves({ externalId: organizationUAI });
        organizationLearnersXmlServiceStub.extractOrganizationLearnersInformationFromSIECLE.returns([]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a SiecleXmlImportError', async function () {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        error = await catchErr(importOrganizationLearnersFromSIECLEFormat)({
          organizationId,
          payload,
          format,
          organizationRepository: organizationRepositoryStub,
          organizationLearnersXmlService: organizationLearnersXmlServiceStub,
          organizationLearnerRepository: organizationLearnerRepositoryStub,
        });

        // then
        expect(error).to.be.instanceOf(SiecleXmlImportError);
        expect((error as $TSFixMe).code).to.equal('EMPTY');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('because the file format is not valid', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // given
        format = 'txt';
        organizationRepositoryStub.get.withArgs(organizationId).resolves({ externalId: organizationUAI });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a FileValidationError', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        error = await catchErr(importOrganizationLearnersFromSIECLEFormat)({
          organizationId,
          payload,
          format,
          organizationLearnersXmlService: organizationLearnersXmlServiceStub,
          organizationRepository: organizationRepositoryStub,
          organizationLearnerRepository: organizationLearnerRepositoryStub,
        });

        // then
        expect(error).to.be.instanceOf(FileValidationError);
        expect((error as $TSFixMe).code).to.equal('INVALID_FILE_EXTENSION');
        expect((error as $TSFixMe).meta.fileExtension).to.equal('txt');
      });
    });
  });
});
