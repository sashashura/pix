// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserCantBe... Remove this comment to see the full error message
const { UserCantBeCreatedError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserToCrea... Remove this comment to see the full error message
const UserToCreate = require('../models/UserToCreate');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function authenticateAnonymousUser({
  campaignCode,
  lang = 'fr',
  campaignToJoinRepository,
  userToCreateRepository,
  tokenService
}: $TSFixMe) {
  const campaign = await campaignToJoinRepository.getByCode(campaignCode);
  if (!campaign.isSimplifiedAccess) {
    throw new UserCantBeCreatedError();
  }

  const userToAdd = UserToCreate.createAnonymous({ lang });
  const newUser = await userToCreateRepository.create({ user: userToAdd });

  const accessToken = tokenService.createAccessTokenFromUser(newUser.id, 'pix').accessToken;
  return accessToken;
};
