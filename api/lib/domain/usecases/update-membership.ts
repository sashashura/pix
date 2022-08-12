// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateMembership({
  membership,
  membershipRepository
}: $TSFixMe) {
  membership.validateRole();
  const existingMembership = await membershipRepository.get(membership.id);

  return membershipRepository.updateById({ id: existingMembership.id, membership });
};
