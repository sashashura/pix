// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('./token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unauthoriz... Remove this comment to see the full error message
const { UnauthorizedError } = require('../../application/http-errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'temporaryS... Remove this comment to see the full error message
const temporaryStorage = require('../../infrastructure/temporary-storage').withPrefix('refresh-tokens:');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uuidv4'.
const { v4: uuidv4 } = require('uuid');

function _prefixForUser(userId: $TSFixMe) {
  return `${userId}:`;
}

async function createRefreshTokenFromUserId({
  userId,
  source
}: $TSFixMe) {
  const expirationDelaySeconds = settings.authentication.refreshTokenLifespanMs / 1000;
  const token = `${_prefixForUser(userId)}${uuidv4()}`;
  return await temporaryStorage.save({
    key: token,
    value: { type: 'refresh_token', userId, source },
    expirationDelaySeconds,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createAcce... Remove this comment to see the full error message
async function createAccessTokenFromRefreshToken({
  refreshToken
}: $TSFixMe) {
  const { userId, source } = (await temporaryStorage.get(refreshToken)) || {};
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  if (!userId) throw new UnauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
  return tokenService.createAccessTokenFromUser(userId, source);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'revokeRefr... Remove this comment to see the full error message
async function revokeRefreshToken({
  refreshToken
}: $TSFixMe) {
  await temporaryStorage.delete(refreshToken);
}

async function revokeRefreshTokensForUserId({
  userId
}: $TSFixMe) {
  await temporaryStorage.deleteByPrefix(_prefixForUser(userId));
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createRefreshTokenFromUserId,
  createAccessTokenFromRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokensForUserId,

  temporaryStorageForTests: temporaryStorage,
};
