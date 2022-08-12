// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidTem... Remove this comment to see the full error message
  InvalidTemporaryKeyError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
  InvalidExternalUserTokenError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidRes... Remove this comment to see the full error message
  InvalidResultRecipientTokenError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
  InvalidSessionResultError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

function _createAccessToken({
  userId,
  source,
  expirationDelaySeconds
}: $TSFixMe) {
  return jsonwebtoken.sign({ user_id: userId, source }, settings.authentication.secret, {
    expiresIn: expirationDelaySeconds,
  });
}

function createAccessTokenFromUser(userId: $TSFixMe, source: $TSFixMe) {
  const expirationDelaySeconds = settings.authentication.accessTokenLifespanMs / 1000;
  const accessToken = _createAccessToken({ userId, source, expirationDelaySeconds });
  return { accessToken, expirationDelaySeconds };
}

function createAccessTokenForSaml(userId: $TSFixMe) {
  const expirationDelaySeconds = settings.saml.accessTokenLifespanMs / 1000;
  return _createAccessToken({ userId, source: 'external', expirationDelaySeconds });
}

function createAccessTokenFromApplication(
  clientId: $TSFixMe,
  source: $TSFixMe,
  scope: $TSFixMe,
  secret = settings.authentication.secret,
  expiresIn = settings.authentication.accessTokenLifespanMs
) {
  return jsonwebtoken.sign(
    {
      client_id: clientId,
      source,
      scope,
    },
    secret,
    { expiresIn }
  );
}

function createTokenForCampaignResults(userId: $TSFixMe) {
  return jsonwebtoken.sign(
    {
      access_id: userId,
    },
    settings.authentication.secret,
    { expiresIn: settings.authentication.tokenForCampaignResultLifespan }
  );
}

function createIdTokenForUserReconciliation(externalUser: $TSFixMe) {
  return jsonwebtoken.sign(
    {
      first_name: externalUser.firstName,
      last_name: externalUser.lastName,
      saml_id: externalUser.samlId,
    },
    settings.authentication.secret,
    { expiresIn: settings.authentication.tokenForStudentReconciliationLifespan }
  );
}

function createCertificationResultsByRecipientEmailLinkToken({
  sessionId,
  resultRecipientEmail,
  daysBeforeExpiration
}: $TSFixMe) {
  return jsonwebtoken.sign(
    {
      session_id: sessionId,
      result_recipient_email: resultRecipientEmail,
    },
    settings.authentication.secret,
    {
      expiresIn: `${daysBeforeExpiration}d`,
    }
  );
}

function createCertificationResultsLinkToken({
  sessionId,
  daysBeforeExpiration
}: $TSFixMe) {
  return jsonwebtoken.sign(
    {
      session_id: sessionId,
    },
    settings.authentication.secret,
    {
      expiresIn: `${daysBeforeExpiration}d`,
    }
  );
}

function createPasswordResetToken(userId: $TSFixMe) {
  return jsonwebtoken.sign(
    {
      user_id: userId,
    },
    settings.authentication.secret,
    { expiresIn: settings.authentication.passwordResetTokenLifespan }
  );
}

function extractTokenFromAuthChain(authChain: $TSFixMe) {
  if (!authChain) {
    return authChain;
  }
  const bearerIndex = authChain.indexOf('Bearer ');
  if (bearerIndex < 0) {
    return false;
  }
  return authChain.replace(/Bearer /g, '');
}

function decodeIfValid(token: $TSFixMe) {
  return new Promise((resolve, reject) => {
    const decoded = getDecodedToken(token);
    return !decoded ? reject(new InvalidTemporaryKeyError()) : resolve(decoded);
  });
}

function getDecodedToken(token: $TSFixMe, secret = settings.authentication.secret) {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch (err) {
    return false;
  }
}

function extractSamlId(token: $TSFixMe) {
  const decoded = getDecodedToken(token);
  return decoded.saml_id || null;
}

function extractResultRecipientEmailAndSessionId(token: $TSFixMe) {
  const decoded = getDecodedToken(token);
  if (!decoded.session_id || !decoded.result_recipient_email) {
    throw new InvalidResultRecipientTokenError();
  }

  return {
    resultRecipientEmail: decoded.result_recipient_email,
    sessionId: decoded.session_id,
  };
}

function extractSessionId(token: $TSFixMe) {
  const decoded = getDecodedToken(token);
  if (!decoded.session_id) {
    throw new InvalidSessionResultError();
  }

  return {
    sessionId: decoded.session_id,
  };
}

function extractUserId(token: $TSFixMe) {
  const decoded = getDecodedToken(token);
  return decoded.user_id || null;
}

function extractClientId(token: $TSFixMe, secret = settings.authentication.secret) {
  const decoded = getDecodedToken(token, secret);
  return decoded.client_id || null;
}

function extractUserIdForCampaignResults(token: $TSFixMe) {
  const decoded = getDecodedToken(token);
  return decoded.access_id || null;
}

async function extractExternalUserFromIdToken(token: $TSFixMe) {
  const externalUser = await getDecodedToken(token);

  if (!externalUser) {
    throw new InvalidExternalUserTokenError(
      'Une erreur est survenue. Veuillez réessayer de vous connecter depuis le médiacentre.'
    );
  }

  return {
    firstName: externalUser['first_name'],
    lastName: externalUser['last_name'],
    samlId: externalUser['saml_id'],
  };
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createAccessTokenFromUser,
  createAccessTokenForSaml,
  createAccessTokenFromApplication,
  createTokenForCampaignResults,
  createIdTokenForUserReconciliation,
  createCertificationResultsByRecipientEmailLinkToken,
  createCertificationResultsLinkToken,
  createPasswordResetToken,
  decodeIfValid,
  getDecodedToken,
  extractExternalUserFromIdToken,
  extractResultRecipientEmailAndSessionId,
  extractSamlId,
  extractSessionId,
  extractTokenFromAuthChain,
  extractUserId,
  extractClientId,
  extractUserIdForCampaignResults,
};
