// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deactivateAdminMember({
  id,
  adminMemberRepository,
  refreshTokenService
}: $TSFixMe) {
  const { userId } = await adminMemberRepository.getById(id);
  await adminMemberRepository.deactivate({ id });
  await refreshTokenService.revokeRefreshTokensForUserId({ userId });
};
