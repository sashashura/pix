module.exports = async function updateTargetProfile({
  id,
  name,
  description,
  comment,
  targetProfileForUpdateRepository,
}) {
  const targetProfileForUpdate = await targetProfileForUpdateRepository.get(id);
  targetProfileForUpdate.update({ name, description, comment });
  await targetProfileForUpdateRepository.update(targetProfileForUpdate);
};
