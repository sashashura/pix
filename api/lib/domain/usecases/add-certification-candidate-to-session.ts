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
} = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function addCertificationCandidateToSession({
  sessionId,
  certificationCandidate,
  complementaryCertifications,
  sessionRepository,
  certificationCandidateRepository,
  certificationCpfService,
  certificationCpfCountryRepository,
  certificationCpfCityRepository
}: $TSFixMe) {
  certificationCandidate.sessionId = sessionId;

  const session = await sessionRepository.get(sessionId);
  if (!session.canEnrollCandidate()) {
    throw new CertificationCandidateOnFinalizedSessionError();
  }

  const isSco = await sessionRepository.isSco({ sessionId });

  try {
    certificationCandidate.validate(isSco);
  } catch (error) {
    throw CertificationCandidateAddError.fromInvalidCertificationCandidateError(error);
  }

  const duplicateCandidates = await certificationCandidateRepository.findBySessionIdAndPersonalInfo({
    sessionId,
    firstName: certificationCandidate.firstName,
    lastName: certificationCandidate.lastName,
    birthdate: certificationCandidate.birthdate,
  });

  if (duplicateCandidates.length !== 0) {
    throw new CertificationCandidateByPersonalInfoTooManyMatchesError(
      'A candidate with the same personal info is already in the session.'
    );
  }

  const cpfBirthInformation = await certificationCpfService.getBirthInformation({
    ...certificationCandidate,
    certificationCpfCityRepository,
    certificationCpfCountryRepository,
  });

  if (cpfBirthInformation.hasFailed()) {
    throw new CpfBirthInformationValidationError(cpfBirthInformation.message);
  }

  certificationCandidate.updateBirthInformation(cpfBirthInformation);

  certificationCandidate.complementaryCertifications = complementaryCertifications;

  return await certificationCandidateRepository.saveInSession({
    certificationCandidate,
    sessionId: certificationCandidate.sessionId,
  });
};
