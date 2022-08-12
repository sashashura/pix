// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findDivisionsByOrganization({
  organizationId,
  divisionRepository
}: $TSFixMe) {
  const divisionsOrderedByPostgres = await divisionRepository.findByOrganizationIdForCurrentSchoolYear({
    organizationId,
  });
  const divisionsOrderedByName = divisionsOrderedByPostgres.sort((divisionA: $TSFixMe, divisionB: $TSFixMe) =>
    divisionA.name.localeCompare(divisionB.name, 'fr')
  );
  return divisionsOrderedByName;
};
