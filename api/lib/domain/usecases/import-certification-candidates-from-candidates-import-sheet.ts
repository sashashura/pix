// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidateAlreadyLinkedToUserError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function importCertificationCandidatesFromCandidatesImportSheet({
  sessionId,
  odsBuffer,
  certificationCandidatesOdsService,
  certificationCandidateRepository,
  certificationCpfService,
  certificationCpfCountryRepository,
  certificationCpfCityRepository,
  complementaryCertificationRepository,
  certificationCenterRepository,
  sessionRepository
}: $TSFixMe) {
  const linkedCandidateInSessionExists =
    await certificationCandidateRepository.doesLinkedCertificationCandidateInSessionExist({ sessionId });

  if (linkedCandidateInSessionExists) {
    throw new CertificationCandidateAlreadyLinkedToUserError('At least one candidate is already linked to a user');
  }

  const isSco = await sessionRepository.isSco({ sessionId });

  const certificationCandidates =
    await certificationCandidatesOdsService.extractCertificationCandidatesFromCandidatesImportSheet({
      sessionId,
      isSco,
      odsBuffer,
      certificationCpfService,
      certificationCpfCountryRepository,
      certificationCpfCityRepository,
      complementaryCertificationRepository,
      certificationCenterRepository,
    });

  await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
    await certificationCandidateRepository.deleteBySessionId({ sessionId, domainTransaction });
    await bluebird.mapSeries(certificationCandidates, function (certificationCandidate: $TSFixMe) {
      return certificationCandidateRepository.saveInSession({
        certificationCandidate,
        complementaryCertifications: certificationCandidate.complementaryCertifications,
        sessionId,
        domainTransaction,
      });
    });
  });
};
