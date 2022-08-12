// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
const { NoCertificationAttestationForDivisionError } = require('../../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findCertificationAttestationsForDivision({
  organizationId,
  division,
  certificationAttestationRepository
}: $TSFixMe) {
  const certificationAttestations =
    await certificationAttestationRepository.findByDivisionForScoIsManagingStudentsOrganization({
      organizationId,
      division,
    });

  if (certificationAttestations.length === 0) {
    throw new NoCertificationAttestationForDivisionError(division);
  }
  return certificationAttestations;
};
