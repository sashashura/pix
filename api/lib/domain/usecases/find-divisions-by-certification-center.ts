// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findDivisionsByCertificationCenter({
  certificationCenterId,
  organizationRepository,
  divisionRepository
}: $TSFixMe) {
  const organizationId = await organizationRepository.getIdByCertificationCenterId(certificationCenterId);
  return divisionRepository.findByOrganizationIdForCurrentSchoolYear({ organizationId });
};
