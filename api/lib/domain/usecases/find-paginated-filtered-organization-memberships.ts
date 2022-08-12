// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function findPaginatedFilteredOrganizationMemberships({
  organizationId,
  filter,
  page,
  membershipRepository
}: $TSFixMe) {
  return membershipRepository.findPaginatedFiltered({ organizationId, filter, page });
};
