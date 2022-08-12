// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesLotManagement = require('../../../../lib/domain/read-models/OrganizationPlacesLotManagement');

function buildOrganizationPlacesLotManagement({
  id,
  count,
  organizationId,
  activationDate,
  expirationDate,
  reference,
  category,
  creatorLastName,
  creatorFirstName,
  createdAt
}: $TSFixMe = {}) {
  return new OrganizationPlacesLotManagement({
    id,
    count,
    organizationId,
    activationDate,
    expirationDate,
    reference,
    category,
    creatorLastName,
    creatorFirstName,
    createdAt,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildOrganizationPlacesLotManagement;
