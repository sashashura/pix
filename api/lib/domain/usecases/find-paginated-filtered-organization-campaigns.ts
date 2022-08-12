// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function findPaginatedFilteredOrganizationCampaigns({
  userId,
  organizationId,
  filter,
  page,
  campaignReportRepository
}: $TSFixMe) {
  return campaignReportRepository.findPaginatedFilteredByOrganizationId({ organizationId, filter, page, userId });
};
