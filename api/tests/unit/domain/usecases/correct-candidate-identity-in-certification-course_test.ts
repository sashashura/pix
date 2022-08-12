// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const correctCandidateIdentityInCertificationCourse = require('../../../../lib/domain/usecases/correct-candidate-identity-in-certification-course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfBirthIn... Remove this comment to see the full error message
const { CpfBirthInformationValidation } = require('../../../../lib/domain/services/certification-cpf-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfBirthIn... Remove this comment to see the full error message
const { CpfBirthInformationValidationError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | correct-candidate-identity-in-certification-course', function () {
  let certificationCourseRepository: $TSFixMe;
  let certificationCpfService: $TSFixMe;
  let certificationCpfCountryRepository: $TSFixMe;
  let certificationCpfCityRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCourseRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
    };

    certificationCpfService = {
      getBirthInformation: sinon.stub(),
    };

    certificationCpfCountryRepository = Symbol('certificationCpfCountryRepository');
    certificationCpfCityRepository = Symbol('certificationCpfCityRepository');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('it modifies the candidate', async function () {
    // given
    const sex = 'F';
    const birthCountry = 'FRANCE';
    const birthINSEECode = null;
    const birthCity = 'PARIS 15';
    const birthPostalCode = '75015';

    const certificationCourseToBeModified = domainBuilder.buildCertificationCourse({
      id: 4,
      firstName: 'Peter',
      lastName: 'Parker',
      birthdate: '1990-01-01',
      sex: 'M',
      birthplace: 'New York',
      birthCountry: 'ETATS-UNIS',
      birthINSEECode: '99404',
    });

    certificationCourseRepository.get.withArgs(4).resolves(certificationCourseToBeModified);
    certificationCpfService.getBirthInformation
      .withArgs({
        birthCountry,
        birthCity,
        birthPostalCode,
        birthINSEECode,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
      })
      .resolves(CpfBirthInformationValidation.success({ birthCountry, birthINSEECode, birthPostalCode, birthCity }));

    const command = {
      certificationCourseId: 4,
      firstName: 'Maurice',
      lastName: 'Dupont',
      birthdate: '2000-01-01',
      sex,
      birthplace: birthCity,
      birthINSEECode,
      birthCountry,
      birthPostalCode,
    };

    // when
    await correctCandidateIdentityInCertificationCourse({
      command,
      certificationCourseRepository,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
    });

    // then
    expect(certificationCourseRepository.update).to.have.been.calledWith(
      new CertificationCourse({
        ...certificationCourseToBeModified.toDTO(),
        firstName: 'Maurice',
        lastName: 'Dupont',
        birthdate: '2000-01-01',
        sex: 'F',
        birthplace: 'PARIS 15',
        birthCountry: 'FRANCE',
        birthINSEECode: null,
        birthPostalCode: '75015',
      })
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throws a CpfBirthInformationValidationError if birth information validation fails', async function () {
    // given
    const sex = 'F';
    const birthCountry = 'FRANCE';
    const birthINSEECode = null;
    const birthCity = 'PARIS 15';
    const birthPostalCode = '75015';

    const certificationCourseToBeModified = domainBuilder.buildCertificationCourse({
      id: 4,
      firstName: 'Peter',
      lastName: 'Parker',
      birthdate: '1990-01-01',
      sex: 'M',
      birthplace: 'New York',
      birthCountry: 'ETATS-UNIS',
      birthINSEECode: '99404',
    });

    certificationCourseRepository.get.withArgs(4).resolves(certificationCourseToBeModified);
    certificationCpfService.getBirthInformation
      .withArgs({
        birthCountry,
        birthCity,
        birthPostalCode,
        birthINSEECode,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
      })
      .resolves(CpfBirthInformationValidation.failure('Failure message'));

    const command = {
      certificationCourseId: 4,
      firstName: 'Maurice',
      lastName: 'Dupont',
      birthdate: '2000-01-01',
      sex,
      birthplace: birthCity,
      birthINSEECode,
      birthCountry,
      birthPostalCode,
    };

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(correctCandidateIdentityInCertificationCourse)({
      command,
      certificationCourseRepository,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(CpfBirthInformationValidationError);
    expect((error as $TSFixMe).message).to.equal('Failure message');
  });
});
