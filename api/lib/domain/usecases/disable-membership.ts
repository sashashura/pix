// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function disableMembership({
  membershipId,
  userId,
  membershipRepository
}: $TSFixMe) {
  const membership = { disabledAt: new Date(), updatedByUserId: userId };
  return membershipRepository.updateById({ id: membershipId, membership });
};
