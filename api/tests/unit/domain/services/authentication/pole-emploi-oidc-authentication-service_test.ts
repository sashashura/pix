// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserToCrea... Remove this comment to see the full error message
const UserToCreate = require('../../../../../lib/domain/models/UserToCreate');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PoleEmploi... Remove this comment to see the full error message
const PoleEmploiOidcAuthenticationService = require('../../../../../lib/domain/services/authentication/pole-emploi-oidc-authentication-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logoutUrlT... Remove this comment to see the full error message
const logoutUrlTemporaryStorage = require('../../../../../lib/infrastructure/temporary-storage').withPrefix(
  'logout-url:'
);

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Services | pole-emploi-oidc-authentication-service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createUserAccount', function () {
    let userToCreateRepository: $TSFixMe, authenticationMethodRepository: $TSFixMe;
    let domainTransaction: $TSFixMe;
    let clock: $TSFixMe;
    const now = new Date('2021-01-02');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      domainTransaction = Symbol();
      DomainTransaction.execute = (lambda: $TSFixMe) => {
        return lambda(domainTransaction);
      };

      clock = sinon.useFakeTimers(now);

      userToCreateRepository = {
        create: sinon.stub(),
      };
      authenticationMethodRepository = {
        create: sinon.stub(),
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return id token and user id', async function () {
      // given
      const externalIdentityId = '1233BBBC';
      const sessionContent = {
        accessToken: 'accessToken',
        idToken: 'idToken',
        expiresIn: 10,
        refreshToken: 'refreshToken',
      };
      const user = new UserToCreate({
        firstName: 'Adam',
        lastName: 'Troisjours',
      });
      const userId = 1;
      userToCreateRepository.create.withArgs({ user, domainTransaction }).resolves({ id: userId });

      const expectedAuthenticationMethod = new AuthenticationMethod({
        identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
        externalIdentifier: externalIdentityId,
        authenticationComplement: new AuthenticationMethod.OidcAuthenticationComplement({
          accessToken: sessionContent.accessToken,
          refreshToken: sessionContent.refreshToken,
          expiredDate: moment().add(sessionContent.expiresIn, 's').toDate(),
        }),
        userId,
      });
      const poleEmploiAuthenticationService = new PoleEmploiOidcAuthenticationService();

      // when
      const result = await poleEmploiAuthenticationService.createUserAccount({
        user,
        sessionContent,
        externalIdentityId,
        userToCreateRepository,
        authenticationMethodRepository,
      });

      // then
      expect(authenticationMethodRepository.create).to.have.been.calledWith({
        authenticationMethod: expectedAuthenticationMethod,
        domainTransaction,
      });
      expect(result).to.be.deep.equal({ idToken: sessionContent.idToken, userId });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getRedirectLogoutUrl', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a redirect logout url', async function () {
      // given
      const idToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const userId = '1';
      const logoutUrlUUID = '1f3dbb71-f399-4c1c-85ae-0a863c78aeea';
      const key = `${userId}:${logoutUrlUUID}`;
      await logoutUrlTemporaryStorage.save({ key, value: idToken, expirationDelaySeconds: 1140 });
      const poleEmploiOidcAuthenticationService = new PoleEmploiOidcAuthenticationService();

      // when
      const redirectTarget = await poleEmploiOidcAuthenticationService.getRedirectLogoutUrl({
        userId,
        logoutUrlUUID,
      });

      // then
      expect(redirectTarget).to.equal(
        'http://logout-url.fr/?id_token_hint=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c&redirect_uri=http%3A%2F%2Fafter-logout.url'
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('removes idToken from temporary storage', async function () {
      // given
      const idToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const userId = '2';
      const logoutUrlUUID = 'f9f1b471-a74e-4722-8dde-f5731279146a';
      const key = `${userId}:${logoutUrlUUID}`;
      await logoutUrlTemporaryStorage.save({ key, value: idToken, expirationDelaySeconds: 1140 });
      const poleEmploiOidcAuthenticationService = new PoleEmploiOidcAuthenticationService();

      // when
      await poleEmploiOidcAuthenticationService.getRedirectLogoutUrl({
        userId,
        logoutUrlUUID,
      });
      const expectedIdToken = await logoutUrlTemporaryStorage.get(key);

      // then
      expect(expectedIdToken).to.be.undefined;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveIdToken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an uuid', async function () {
      // given
      const uuidPattern = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
      const idToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const userId = '123';
      const poleEmploiOidcAuthenticationService = new PoleEmploiOidcAuthenticationService();

      // when
      const uuid = await poleEmploiOidcAuthenticationService.saveIdToken({ idToken, userId });
      const result = await logoutUrlTemporaryStorage.get(`123:${uuid}`);

      // then
      expect(uuid.match(uuidPattern)).to.be.ok;
      expect(result).to.equal(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createAuthenticationComplement', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create pole emploi authentication complement', function () {
      // given
      const sessionContent = {
        accessToken: 'accessToken',
        idToken: 'idToken',
        expiresIn: 10,
        refreshToken: 'refreshToken',
      };
      const poleEmploiOidcAuthenticationService = new PoleEmploiOidcAuthenticationService();

      // when
      const result = poleEmploiOidcAuthenticationService.createAuthenticationComplement({ sessionContent });

      // then
      expect(result).to.be.instanceOf(AuthenticationMethod.OidcAuthenticationComplement);
    });
  });
});
