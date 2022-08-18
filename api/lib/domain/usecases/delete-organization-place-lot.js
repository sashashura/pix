module.exports = async function deleteOrganizationPlaceLot({
  organizationPlaceId,
  userId,
  organizationPlacesLotRepository,
}) {
  await organizationPlacesLotRepository.get(organizationPlaceId);
  await organizationPlacesLotRepository.softDelete({ id: organizationPlaceId, deletedBy: userId });
};
