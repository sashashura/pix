// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCandidateForbiddenDeletionError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deleteUnlinkedCertificationCandidate({
  certificationCandidateId,
  certificationCandidateRepository
}: $TSFixMe) {
  const isNotLinked = await certificationCandidateRepository.isNotLinked(certificationCandidateId);

  if (isNotLinked) {
    return certificationCandidateRepository.delete(certificationCandidateId);
  }

  throw new CertificationCandidateForbiddenDeletionError();
};
