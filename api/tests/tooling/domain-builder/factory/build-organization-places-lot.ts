// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesLot = require('../../../../lib/domain/models/OrganizationPlacesLot');

function buildOrganizationPlacesLot({
  id = 1,
  count = 10,
  organizationId = 12,
  activationDate = '2022-01-01',
  expirationDate = '2023-01-01',
  reference = 'abc123',
  category = OrganizationPlacesLot.categories.FREE_RATE,
  createdBy = 199,
} = {}) {
  return new OrganizationPlacesLot({
    id,
    count,
    organizationId,
    activationDate,
    expirationDate,
    reference,
    category,
    createdBy,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildOrganizationPlacesLot;
