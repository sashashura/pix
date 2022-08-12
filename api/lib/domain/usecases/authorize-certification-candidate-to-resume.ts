// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authorizeCertificationCandidateToResume({
  certificationCandidateId,
  certificationCandidateForSupervisingRepository
}: $TSFixMe) {
  const candidate = await certificationCandidateForSupervisingRepository.get(certificationCandidateId);
  candidate.authorizeToStart();

  await certificationCandidateForSupervisingRepository.update(candidate);
};
