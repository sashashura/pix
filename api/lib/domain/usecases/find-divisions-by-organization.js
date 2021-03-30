const { NoDivisionListForOrganization } = require('../errors');

module.exports = async function findDivisionsByOrganization({
  organizationId,
  divisionRepository,
  organizationRepository,
}) {
  const organization = await organizationRepository.get(organizationId);
  if (!organization.isScoAndManagingStudents) {
    throw new NoDivisionListForOrganization();
  }

  const divisionsOrderedByPostgres = await divisionRepository.findByOrganizationId({ organizationId });
  const divisionsOrderedByName = divisionsOrderedByPostgres
    .filter((division) => division.name)
    .sort((divisionA, divisionB) => divisionA.name.localeCompare(divisionB.name, 'fr'));

  return divisionsOrderedByName;
};
