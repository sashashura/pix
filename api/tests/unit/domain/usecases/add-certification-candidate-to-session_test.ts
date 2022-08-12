// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const addCertificationCandidateToSession = require('../../../../lib/domain/usecases/add-certification-candidate-to-session');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfBirthIn... Remove this comment to see the full error message
const { CpfBirthInformationValidation } = require('../../../../lib/domain/services/certification-cpf-service');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateByPersonalInfoTooManyMatchesError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CpfBirthIn... Remove this comment to see the full error message
  CpfBirthInformationValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateAddError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateOnFinalizedSessionError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | add-certification-candidate-to-session', function () {
  let certificationCandidateRepository: $TSFixMe;
  let certificationCpfService: $TSFixMe;
  let certificationCpfCountryRepository: $TSFixMe;
  let certificationCpfCityRepository: $TSFixMe;
  let sessionRepository: $TSFixMe;

  const sessionId = 1;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCandidateRepository = {
      findBySessionIdAndPersonalInfo: sinon.stub(),
      saveInSession: sinon.stub(),
    };
    sessionRepository = {
      isSco: sinon.stub(),
      get: sinon.stub(),
    };
    certificationCpfService = {
      getBirthInformation: sinon.stub(),
    };
    certificationCpfCountryRepository = Symbol('certificationCpfCountryRepository');
    certificationCpfCityRepository = Symbol('certificationCpfCityRepository');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the session is finalized', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an CertificationCandidateOnFinalizedSessionError', async function () {
      // given
      const session = domainBuilder.buildSession.finalized();
      sessionRepository.get.resolves(session);

      const certificationCandidate = domainBuilder.buildCertificationCandidate.pro({
        sessionId: null,
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(addCertificationCandidateToSession)({
        sessionId,
        certificationCandidate,
        complementaryCertifications: [],
        certificationCandidateRepository,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        sessionRepository,
      });

      // then
      expect(error).to.be.an.instanceOf(CertificationCandidateOnFinalizedSessionError);
      expect((error as $TSFixMe).message).to.equal("Cette session a déjà été finalisée, l'ajout de candidat n'est pas autorisé");
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when certification candidate does not pass JOI validation', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a CertificationCandidateAddError error', async function () {
      // given
      const session = domainBuilder.buildSession.created();
      sessionRepository.get.resolves(session);
      sessionRepository.isSco.resolves(false);
      const certificationCandidate = domainBuilder.buildCertificationCandidate.pro({
        birthdate: 'WrongDateFormat',
        sessionId: null,
      });

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(addCertificationCandidateToSession)({
        sessionId,
        certificationCandidate,
        complementaryCertifications: [],
        certificationCandidateRepository,
        certificationCpfService,
        certificationCpfCountryRepository,
        certificationCpfCityRepository,
        sessionRepository,
      });

      // then
      expect(err).to.be.instanceOf(CertificationCandidateAddError);
      expect(certificationCandidateRepository.saveInSession).not.to.have.been.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when certification candidate is valid', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a candidate already exists in session with personal info', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an CertificationCandidateByPersonalInfoTooManyMatchesError', async function () {
        // given
        const session = domainBuilder.buildSession.created();
        sessionRepository.get.resolves(session);
        sessionRepository.isSco.resolves(true);
        const certificationCandidate = domainBuilder.buildCertificationCandidate({
          sessionId: null,
        });
        certificationCandidateRepository.findBySessionIdAndPersonalInfo.resolves(['one match']);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const err = await catchErr(addCertificationCandidateToSession)({
          sessionId,
          certificationCandidate,
          complementaryCertifications: [],
          certificationCandidateRepository,
          certificationCpfService,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
          sessionRepository,
        });

        // then
        expect(err).to.be.instanceOf(CertificationCandidateByPersonalInfoTooManyMatchesError);
        expect(certificationCandidateRepository.findBySessionIdAndPersonalInfo).to.have.been.calledWithExactly({
          sessionId,
          firstName: certificationCandidate.firstName,
          lastName: certificationCandidate.lastName,
          birthdate: certificationCandidate.birthdate,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no candidate exists with personal info', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the certification candidate and the complementary certifications', async function () {
        // given
        const session = domainBuilder.buildSession.created();
        sessionRepository.get.resolves(session);
        sessionRepository.isSco.resolves(false);
        const complementaryCertifications = [
          domainBuilder.buildComplementaryCertification(),
          domainBuilder.buildComplementaryCertification(),
        ];
        const certificationCandidate = domainBuilder.buildCertificationCandidate.pro({
          sessionId: null,
          complementaryCertifications,
        });
        const cpfBirthInformationValidation = CpfBirthInformationValidation.success({
          birthCountry: 'COUNTRY',
          birthINSEECode: 'INSEE_CODE',
          birthPostalCode: null,
          birthCity: 'CITY',
        });
        certificationCandidateRepository.findBySessionIdAndPersonalInfo.resolves([]);
        certificationCpfService.getBirthInformation.resolves(cpfBirthInformationValidation);
        certificationCandidateRepository.saveInSession.resolves();

        // when
        await addCertificationCandidateToSession({
          sessionId,
          certificationCandidate,
          complementaryCertifications,
          certificationCandidateRepository,
          certificationCpfService,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
          sessionRepository,
        });

        // then
        expect(certificationCandidateRepository.saveInSession).to.has.been.calledWithExactly({
          certificationCandidate,
          sessionId,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the certification candidate updated with sessionId', async function () {
        //given
        const session = domainBuilder.buildSession.created();
        sessionRepository.get.resolves(session);
        sessionRepository.isSco.resolves(false);
        const certificationCandidate = domainBuilder.buildCertificationCandidate.pro({
          sessionId: null,
        });
        const cpfBirthInformationValidation = CpfBirthInformationValidation.success({
          birthCountry: 'COUNTRY',
          birthINSEECode: 'INSEE_CODE',
          birthPostalCode: null,
          birthCity: 'CITY',
          complementaryCertifications: [],
        });
        certificationCandidateRepository.findBySessionIdAndPersonalInfo.resolves([]);
        certificationCpfService.getBirthInformation.resolves(cpfBirthInformationValidation);
        certificationCandidateRepository.saveInSession.resolves();

        // when
        await addCertificationCandidateToSession({
          sessionId,
          certificationCandidate,
          complementaryCertifications: [],
          certificationCandidateRepository,
          certificationCpfService,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
          sessionRepository,
        });

        // then
        expect(certificationCandidate.sessionId).to.equal(sessionId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should validate the certification candidate', async function () {
        // given
        const session = domainBuilder.buildSession.created();
        sessionRepository.get.resolves(session);
        sessionRepository.isSco.resolves(false);
        const certificationCandidate = domainBuilder.buildCertificationCandidate.pro({
          sessionId: null,
        });
        certificationCandidate.validate = sinon.stub();
        const cpfBirthInformationValidation = CpfBirthInformationValidation.success({
          birthCountry: 'COUNTRY',
          birthINSEECode: 'INSEE_CODE',
          birthPostalCode: null,
          birthCity: 'CITY',
          complementaryCertifications: [],
        });
        certificationCandidateRepository.findBySessionIdAndPersonalInfo.resolves([]);
        certificationCpfService.getBirthInformation.resolves(cpfBirthInformationValidation);
        certificationCandidateRepository.saveInSession.resolves();

        // when
        await addCertificationCandidateToSession({
          sessionId,
          certificationCandidate,
          complementaryCertifications: [],
          certificationCandidateRepository,
          certificationCpfService,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
          sessionRepository,
        });

        // then
        expect(certificationCandidate.validate).to.has.been.called;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when birth information validation fail', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw a CpfBirthInformationValidationError', async function () {
          // given
          const session = domainBuilder.buildSession.created();
          sessionRepository.get.resolves(session);
          sessionRepository.isSco.resolves(false);
          const certificationCandidate = domainBuilder.buildCertificationCandidate.pro({
            sessionId: null,
            complementaryCertifications: [],
          });
          const cpfBirthInformationValidation = CpfBirthInformationValidation.failure('Failure message');
          certificationCandidateRepository.findBySessionIdAndPersonalInfo.resolves([]);
          certificationCpfService.getBirthInformation.resolves(cpfBirthInformationValidation);
          certificationCandidateRepository.saveInSession.resolves();

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(addCertificationCandidateToSession)({
            sessionId,
            certificationCandidate,
            complementaryCertifications: [],
            certificationCandidateRepository,
            certificationCpfService,
            certificationCpfCountryRepository,
            certificationCpfCityRepository,
            sessionRepository,
          });

          // then
          expect(error).to.be.an.instanceOf(CpfBirthInformationValidationError);
          expect((error as $TSFixMe).message).to.equal(cpfBirthInformationValidation.message);
        });
      });
    });
  });
});
