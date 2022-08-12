// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'OidcAuthen... Remove this comment to see the full error message
const OidcAuthenticationService = require('./oidc-authentication-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uuidv4'.
const { v4: uuidv4 } = require('uuid');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logoutUrlT... Remove this comment to see the full error message
const logoutUrlTemporaryStorage = require('../../../infrastructure/temporary-storage').withPrefix('logout-url:');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
class PoleEmploiOidcAuthenticationService extends OidcAuthenticationService {
  afterLogoutUrl: $TSFixMe;
  logoutUrl: $TSFixMe;
  temporaryStorage: $TSFixMe;
  constructor() {
    const source = 'pole_emploi_connect';
    const identityProvider = constants.IDENTITY_PROVIDER.POLE_EMPLOI;
    const expirationDelaySeconds = settings.poleEmploi.accessTokenLifespanMs / 1000;
    const jwtOptions = { expiresIn: expirationDelaySeconds };
    const clientSecret = settings.poleEmploi.clientSecret;
    const clientId = settings.poleEmploi.clientId;
    const tokenUrl = settings.poleEmploi.tokenUrl;
    const authenticationUrl = settings.poleEmploi.authenticationUrl;
    const authenticationUrlParameters = [
      { key: 'realm', value: '/individu' },
      {
        key: 'scope',
        value: `application_${clientId} api_peconnect-individuv1 openid profile`,
      },
    ];
    const userInfoUrl = settings.poleEmploi.userInfoUrl;

    super({
      source,
      identityProvider,
      jwtOptions,
      clientSecret,
      clientId,
      tokenUrl,
      authenticationUrl,
      authenticationUrlParameters,
      userInfoUrl,
    });

    this.logoutUrl = settings.poleEmploi.logoutUrl;
    this.afterLogoutUrl = settings.poleEmploi.afterLogoutUrl;
    this.temporaryStorage = settings.poleEmploi.temporaryStorage;
  }

  // Override because we need idToken to send results after a campaign
  // Sending campaign results is specific for Pole Emploi
  async createUserAccount({
    user,
    sessionContent,
    externalIdentityId,
    userToCreateRepository,
    authenticationMethodRepository
  }: $TSFixMe) {
    let createdUserId;
    await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
      createdUserId = (await userToCreateRepository.create({ user, domainTransaction })).id;

      const authenticationMethod = new AuthenticationMethod({
        identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        userId: createdUserId,
        externalIdentifier: externalIdentityId,
        authenticationComplement: this.createAuthenticationComplement({ sessionContent }),
      });
      await authenticationMethodRepository.create({ authenticationMethod, domainTransaction });
    });

    return {
      userId: createdUserId,
      idToken: sessionContent.idToken,
    };
  }

  async getRedirectLogoutUrl({
    userId,
    logoutUrlUUID
  }: $TSFixMe) {
    // @ts-expect-error TS(2351): This expression is not constructable.
    const redirectTarget = new URL(this.logoutUrl);
    const key = `${userId}:${logoutUrlUUID}`;
    const idToken = await logoutUrlTemporaryStorage.get(key);
    const params = [
      { key: 'id_token_hint', value: idToken },
      { key: 'redirect_uri', value: this.afterLogoutUrl },
    ];

    params.forEach(({ key, value }) => redirectTarget.searchParams.append(key, value));

    await logoutUrlTemporaryStorage.delete(key);

    return redirectTarget.toString();
  }

  async saveIdToken({
    idToken,
    userId
  }: $TSFixMe) {
    const uuid = uuidv4();
    const { idTokenLifespanMs } = this.temporaryStorage;

    await logoutUrlTemporaryStorage.save({
      key: `${userId}:${uuid}`,
      value: idToken,
      expirationDelaySeconds: idTokenLifespanMs / 1000,
    });

    return uuid;
  }

  createAuthenticationComplement({
    sessionContent
  }: $TSFixMe) {
    return new AuthenticationMethod.OidcAuthenticationComplement({
      accessToken: sessionContent.accessToken,
      refreshToken: sessionContent.refreshToken,
      expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PoleEmploiOidcAuthenticationService;
