// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function findPaginatedFilteredSupParticipants({
  organizationId,
  filter,
  page,
  supOrganizationParticipantRepository
}: $TSFixMe) {
  return supOrganizationParticipantRepository.findPaginatedFilteredSupParticipants({
    organizationId,
    filter,
    page,
  });
};
