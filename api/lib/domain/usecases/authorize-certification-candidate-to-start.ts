// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authorizeCertificationCandidateToStart({
  certificationCandidateForSupervisingId,
  authorizedToStart,
  certificationCandidateForSupervisingRepository
}: $TSFixMe) {
  await certificationCandidateForSupervisingRepository.update({
    id: certificationCandidateForSupervisingId,
    authorizedToStart,
  });
};
