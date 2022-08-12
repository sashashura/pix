// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationPlacesLot = require('../models/OrganizationPlacesLot');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createOrganizationPlacesLot({
  organizationPlacesLotData,
  organizationId,
  createdBy,
  organizationPlacesLotRepository,
  organizationRepository
}: $TSFixMe) {
  await organizationRepository.get(organizationId);

  const organizationPlaceLot = new OrganizationPlacesLot({
    ...organizationPlacesLotData,
    organizationId,
    createdBy,
  });

  const id = await organizationPlacesLotRepository.create(organizationPlaceLot);
  return await organizationPlacesLotRepository.get(id);
};
