// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function findPaginatedFilteredOrganizations({
  filter,
  page,
  organizationRepository
}: $TSFixMe) {
  return organizationRepository.findPaginatedFiltered({ filter, page });
};
