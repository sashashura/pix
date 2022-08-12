// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidateAlreadyLinkedToUserError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const importCertificationCandidatesFromCandidatesImportSheet = require('../../../../lib/domain/usecases/import-certification-candidates-from-candidates-import-sheet');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | import-certification-candidates-from-attendance-sheet', function () {
  let certificationCandidateRepository: $TSFixMe;
  let certificationCandidatesOdsService: $TSFixMe;
  let certificationCpfService: $TSFixMe;
  let certificationCpfCityRepository: $TSFixMe;
  let certificationCpfCountryRepository: $TSFixMe;
  let complementaryCertificationRepository: $TSFixMe;
  let certificationCenterRepository: $TSFixMe;
  let sessionRepository: $TSFixMe;
  let domainTransaction: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    certificationCandidateRepository = {
      doesLinkedCertificationCandidateInSessionExist: sinon.stub(),
      deleteBySessionId: sinon.stub(),
      saveInSession: sinon.stub(),
    };
    sessionRepository = {
      isSco: sinon.stub(),
    };
    certificationCandidatesOdsService = {
      extractCertificationCandidatesFromCandidatesImportSheet: sinon.stub(),
    };
    certificationCpfService = {
      getBirthInformation: sinon.stub(),
    };
    certificationCpfCountryRepository = Symbol('certificationCpfCountryRepository');
    certificationCpfCityRepository = Symbol('certificationCpfCityRepository');
    complementaryCertificationRepository = Symbol('complementaryCertificationRepository');
    certificationCenterRepository = Symbol('certificationCenterRepository');
    domainTransaction = Symbol('domainTransaction');
    DomainTransaction.execute = (lambda: $TSFixMe) => {
      return lambda(domainTransaction);
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#importCertificationCandidatesFromCandidatesImportSheet', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session contains already linked certification candidates', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a BadRequestError', async function () {
        // given
        const sessionId = 'sessionId';
        const odsBuffer = 'buffer';

        certificationCandidateRepository.doesLinkedCertificationCandidateInSessionExist
          .withArgs({ sessionId })
          .resolves(true);

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(importCertificationCandidatesFromCandidatesImportSheet)({
          sessionId,
          odsBuffer,
          certificationCandidatesOdsService,
          certificationCandidateRepository,
          certificationCpfService,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
          complementaryCertificationRepository,
          certificationCenterRepository,
        });

        // then
        expect(result).to.be.an.instanceOf(CertificationCandidateAlreadyLinkedToUserError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session contains zero linked certification candidates', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when cpf birth information validation has succeed', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should add the certification candidates', async function () {
          // given
          const sessionId = 'sessionId';
          const odsBuffer = 'buffer';
          const complementaryCertifications = [
            domainBuilder.buildComplementaryCertification(),
            domainBuilder.buildComplementaryCertification(),
          ];
          const certificationCandidate = domainBuilder.buildCertificationCandidate({ complementaryCertifications });
          const certificationCandidates = [certificationCandidate];

          sessionRepository.isSco.resolves(false);

          certificationCandidateRepository.doesLinkedCertificationCandidateInSessionExist
            .withArgs({ sessionId })
            .resolves(false);

          certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet
            .withArgs({
              sessionId,
              isSco: false,
              odsBuffer,
              certificationCpfService,
              certificationCpfCountryRepository,
              certificationCpfCityRepository,
              complementaryCertificationRepository,
              certificationCenterRepository,
            })
            .resolves(certificationCandidates);

          // when
          await importCertificationCandidatesFromCandidatesImportSheet({
            sessionId,
            odsBuffer,
            certificationCandidatesOdsService,
            certificationCandidateRepository,
            certificationCpfService,
            certificationCpfCountryRepository,
            certificationCpfCityRepository,
            complementaryCertificationRepository,
            certificationCenterRepository,
            sessionRepository,
          });

          // then
          expect(certificationCandidateRepository.deleteBySessionId).to.have.been.calledWith({
            sessionId,
            domainTransaction,
          });
          expect(certificationCandidateRepository.saveInSession).to.have.been.calledWith({
            certificationCandidate,
            complementaryCertifications,
            sessionId,
            domainTransaction,
          });
          expect(
            certificationCandidateRepository.deleteBySessionId.calledBefore(
              certificationCandidateRepository.saveInSession
            )
          ).to.be.true;
        });
      });
    });
  });
});
