// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'httpAgent'... Remove this comment to see the full error message
const httpAgent = require('../../../infrastructure/http/http-agent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'querystrin... Remove this comment to see the full error message
const querystring = require('querystring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const { AuthenticationTokenRetrievalError, InvalidExternalAPIResponseError } = require('../../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationSessionContent = require('../../models/AuthenticationSessionContent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uuidv4'.
const { v4: uuidv4 } = require('uuid');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../infrastructure/logger');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OidcAuthen... Remove this comment to see the full error message
class OidcAuthenticationService {
  authenticationUrl: $TSFixMe;
  authenticationUrlParameters: $TSFixMe;
  clientId: $TSFixMe;
  clientSecret: $TSFixMe;
  identityProvider: $TSFixMe;
  jwtOptions: $TSFixMe;
  source: $TSFixMe;
  tokenUrl: $TSFixMe;
  userInfoUrl: $TSFixMe;
  constructor({
    source,
    identityProvider,
    jwtOptions,
    clientSecret,
    clientId,
    tokenUrl,
    authenticationUrl,
    authenticationUrlParameters,
    userInfoUrl
  }: $TSFixMe) {
    this.source = source;
    this.identityProvider = identityProvider;
    this.jwtOptions = jwtOptions;
    this.clientSecret = clientSecret;
    this.clientId = clientId;
    this.tokenUrl = tokenUrl;
    this.authenticationUrl = authenticationUrl;
    this.authenticationUrlParameters = authenticationUrlParameters;
    this.userInfoUrl = userInfoUrl;
  }

  createAccessToken(userId: $TSFixMe) {
    return jsonwebtoken.sign(
      {
        user_id: userId,
        source: this.source,
        identity_provider: this.identityProvider,
      },
      settings.authentication.secret,
      this.jwtOptions
    );
  }

  createAuthenticationComplement() {
    return null;
  }

  saveIdToken() {
    return null;
  }

  async exchangeCodeForTokens({
    code,
    redirectUri
  }: $TSFixMe) {
    const data = {
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code,
      client_id: this.clientId,
      redirect_uri: redirectUri,
    };

    const response = await httpAgent.post({
      url: this.tokenUrl,
      payload: querystring.stringify(data),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    if (!response.isSuccessful) {
      const errorMessage = JSON.stringify(response.data);
      throw new AuthenticationTokenRetrievalError(errorMessage, response.code);
    }

    return new AuthenticationSessionContent({
      idToken: response.data['id_token'],
      accessToken: response.data['access_token'],
      expiresIn: response.data['expires_in'],
      refreshToken: response.data['refresh_token'],
    });
  }

  getAuthenticationUrl({
    redirectUri
  }: $TSFixMe) {
    // @ts-expect-error TS(2351): This expression is not constructable.
    const redirectTarget = new URL(this.authenticationUrl);
    const state = uuidv4();
    const nonce = uuidv4();

    const params = [
      { key: 'state', value: state },
      { key: 'nonce', value: nonce },
      { key: 'client_id', value: this.clientId },
      { key: 'redirect_uri', value: redirectUri },
      { key: 'response_type', value: 'code' },
      ...this.authenticationUrlParameters,
    ];

    params.forEach(({ key, value }) => redirectTarget.searchParams.append(key, value));

    return { redirectTarget: redirectTarget.toString(), state, nonce };
  }

  async _getContentFromUserInfoEndpoint({
    accessToken,
    userInfoUrl
  }: $TSFixMe) {
    let userInfoContent;

    try {
      const { data } = await httpAgent.get({
        url: userInfoUrl,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      userInfoContent = data;
    } catch (error) {
      logger.error('Une erreur est survenue en récupérant les information des utilisateurs.');
      throw new InvalidExternalAPIResponseError(
        'Une erreur est survenue en récupérant les information des utilisateurs'
      );
    }

    if (!userInfoContent.family_name || !userInfoContent.given_name || !userInfoContent.sub) {
      logger.error(`Un des champs obligatoires n'a pas été renvoyé : ${JSON.stringify(userInfoContent)}.`);
      throw new InvalidExternalAPIResponseError('Les informations utilisateurs récupérées sont incorrectes.');
    }

    return {
      given_name: userInfoContent?.given_name,
      family_name: userInfoContent?.family_name,
      sub: userInfoContent?.sub,
      nonce: userInfoContent?.nonce,
    };
  }

  async getUserInfo({
    idToken,
    accessToken
  }: $TSFixMe) {
    const { family_name, given_name, sub, nonce } = await jsonwebtoken.decode(idToken);
    let userInfoContent;

    if (!family_name || !given_name || !sub) {
      userInfoContent = await this._getContentFromUserInfoEndpoint({ accessToken, userInfoUrl: this.userInfoUrl });
    }

    return {
      firstName: given_name || userInfoContent?.given_name,
      lastName: family_name || userInfoContent?.family_name,
      externalIdentityId: sub || userInfoContent?.sub,
      nonce: nonce || userInfoContent?.nonce,
    };
  }

  async createUserAccount({
    user,
    externalIdentityId,
    userToCreateRepository,
    authenticationMethodRepository
  }: $TSFixMe) {
    let createdUserId;
    await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      createdUserId = (await userToCreateRepository.create({ user, domainTransaction })).id;

      const authenticationMethod = new AuthenticationMethod({
        identityProvider: this.identityProvider,
        userId: createdUserId,
        externalIdentifier: externalIdentityId,
      });
      await authenticationMethodRepository.create({ authenticationMethod, domainTransaction });
    });
    return { userId: createdUserId };
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OidcAuthenticationService;
