// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationRepository = require('../../lib/infrastructure/repositories/organization-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizeOr... Remove this comment to see the full error message
function organizeOrganizationsByExternalId(organizations: $TSFixMe) {
  const organizationsByExternalId = {};

  organizations.forEach((organization: $TSFixMe) => {
    if (organization.externalId) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      organizationsByExternalId[organization.externalId] = organization;
    }
  });

  return organizationsByExternalId;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'findOrgani... Remove this comment to see the full error message
function findOrganizationsByExternalIds({
  checkedData
}: $TSFixMe) {
  const externalIds = checkedData.map((data: $TSFixMe) => data.externalId);
  return organizationRepository.findByExternalIdsFetchingIdsOnly(externalIds).then((organizations: $TSFixMe) => {
    return organizations.map((organization: $TSFixMe) => ({
      id: organization.id,
      externalId: organization.externalId
    }));
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findOrganizationsByExternalIds,
  organizeOrganizationsByExternalId,
};
