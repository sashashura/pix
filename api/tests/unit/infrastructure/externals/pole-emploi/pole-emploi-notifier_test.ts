// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'querystrin... Remove this comment to see the full error message
const querystring = require('querystring');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../../lib/config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
const { UnexpectedUserAccountError } = require('../../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { notify } = require('../../../../../lib/infrastructure/externals/pole-emploi/pole-emploi-notifier');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'httpAgent'... Remove this comment to see the full error message
const httpAgent = require('../../../../../lib/infrastructure/http/http-agent');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationMethodRepository = require('../../../../../lib/infrastructure/repositories/authentication-method-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'monitoring... Remove this comment to see the full error message
const monitoringTools = require('../../../../../lib/infrastructure/monitoring-tools');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Externals/Pole-Emploi | pole-emploi-notifier', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#notify', function () {
    let clock: $TSFixMe;

    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const originPoleEmploiSendingUrl = settings.poleEmploi.sendingUrl;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const originPoleEmploiTokenUrl = settings.poleEmploi.tokenUrl;

    const userId = 123;
    const payload = 'somePayload';
    const code = 'someCode';
    const data = {
      access_token: 'accessToken',
      refresh_token: 'refreshToken',
      expires_in: 10,
    };

    const accessToken = 'someAccessToken';
    const refreshToken = 'someRefreshToken';
    const expiredDate = new Date('2021-01-01');
    const authenticationMethod = { authenticationComplement: { accessToken, expiredDate, refreshToken } };

    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const poleEmploiSending = domainBuilder.buildPoleEmploiSending();

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(Date.now());
      sinon.stub(httpAgent, 'post');
      sinon.stub(authenticationMethodRepository, 'findOneByUserIdAndIdentityProvider');
      sinon.stub(authenticationMethodRepository, 'updateAuthenticationComplementByUserIdAndIdentityProvider');
      sinon.stub(monitoringTools, 'logErrorWithCorrelationIds');

      settings.poleEmploi.tokenUrl = 'someTokenUrlToPoleEmploi';
      settings.poleEmploi.sendingUrl = 'someSendingUrlToPoleEmploi';
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
      settings.poleEmploi.sendingUrl = originPoleEmploiSendingUrl;
      settings.poleEmploi.tokenUrl = originPoleEmploiTokenUrl;

      httpAgent.post.restore();
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider.restore();
      authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the user is not known as PoleEmploi user', async function () {
      // given
      authenticationMethodRepository.findOneByUserIdAndIdentityProvider
        .withArgs({ userId, identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI })
        .resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(notify)(userId, payload);

      // then
      expect(error).to.be.instanceOf(UnexpectedUserAccountError);
      expect((error as $TSFixMe).message).to.equal("Le compte utilisateur n'est pas rattaché à l'organisation Pôle Emploi");
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when access token is valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should send the notification to Pole Emploi', async function () {
        // given
        const expiredDate = moment().add(10, 'm').toDate();
        const authenticationMethod = { authenticationComplement: { accessToken, expiredDate, refreshToken } };

        const expectedHearders = {
          Authorization: `Bearer ${authenticationMethod.authenticationComplement.accessToken}`,
          'Content-type': 'application/json',
          Accept: 'application/json',
          'Service-source': 'Pix',
        };

        authenticationMethodRepository.findOneByUserIdAndIdentityProvider
          .withArgs({ userId, identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI })
          .resolves(authenticationMethod);
        httpAgent.post.resolves({ isSuccessful: true, code });

        // when
        await notify(userId, payload, poleEmploiSending);

        // then
        expect(httpAgent.post).to.have.been.calledWithExactly({
          url: settings.poleEmploi.sendingUrl,
          payload,
          headers: expectedHearders,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when access token is invalid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should try to refresh the access token', async function () {
        // given
        const expectedHeaders = { 'content-type': 'application/x-www-form-urlencoded' };
        authenticationMethodRepository.findOneByUserIdAndIdentityProvider
          .withArgs({ userId, identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI })
          .resolves(authenticationMethod);
        const params = {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_secret: settings.poleEmploi.clientSecret,
          client_id: settings.poleEmploi.clientId,
        };
        httpAgent.post.resolves({ isSuccessful: true, code, data });

        // when
        await notify(userId, payload, poleEmploiSending);

        // then
        expect(httpAgent.post).to.have.been.calledWithExactly({
          url: settings.poleEmploi.tokenUrl,
          payload: querystring.stringify(params),
          headers: expectedHeaders,
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when it succeeds', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should update the authentication method', async function () {
          // given
          authenticationMethodRepository.findOneByUserIdAndIdentityProvider
            .withArgs({ userId, identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI })
            .resolves(authenticationMethod);
          httpAgent.post.resolves({ isSuccessful: true, code, data });
          const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken: data['access_token'],
            refreshToken: data['refresh_token'],
            expiredDate: moment().add(data['expires_in'], 's').toDate(),
          });

          // when
          await notify(userId, payload, poleEmploiSending);

          // then
          expect(
            authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
          ).to.have.been.calledWith({ authenticationComplement, userId, identityProvider: 'POLE_EMPLOI' });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should send the notification to Pole Emploi', async function () {
          // given
          const authenticationComplement = new AuthenticationMethod.OidcAuthenticationComplement({
            accessToken: data['access_token'],
            refreshToken: data['refresh_token'],
            expiredDate: moment().add(data['expires_in'], 's').toDate(),
          });

          const expectedHeaders = {
            Authorization: `Bearer ${authenticationComplement.accessToken}`,
            'Content-type': 'application/json',
            Accept: 'application/json',
            'Service-source': 'Pix',
          };

          authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider
            .withArgs({ authenticationComplement, userId })
            .resolves();

          authenticationMethodRepository.findOneByUserIdAndIdentityProvider
            .withArgs({ userId, identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI })
            .resolves(authenticationMethod);

          httpAgent.post
            .onFirstCall()
            .resolves({ isSuccessful: true, code, data })
            .onSecondCall()
            .resolves({ isSuccessful: true, code });

          // when
          await notify(userId, payload, poleEmploiSending);

          // then
          expect(httpAgent.post).to.have.been.calledWithExactly({
            url: settings.poleEmploi.sendingUrl,
            payload,
            headers: expectedHeaders,
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when it fails', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should log error and return httpResponse with error if retrieve PE tokens fails', async function () {
          // given
          const errorData = {
            error: 'invalid_client',
            error_description: 'Invalid authentication method for accessing this endpoint.',
          };
          const tokenResponse = {
            isSuccessful: false,
            code: 400,
            data: errorData,
          };

          authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(authenticationMethod);

          httpAgent.post
            .withArgs({
              url: settings.poleEmploi.tokenUrl,
              headers: sinon.match.any,
              payload: sinon.match.any,
            })
            .resolves(tokenResponse);

          monitoringTools.logErrorWithCorrelationIds.resolves();

          const expectedLoggerMessage = `${errorData.error} ${errorData.error_description}`;
          const expectedResult = {
            code: tokenResponse.code,
            isSuccessful: tokenResponse.isSuccessful,
          };

          // when
          const result = await notify(userId, payload, poleEmploiSending);

          // then
          expect(monitoringTools.logErrorWithCorrelationIds).to.have.been.calledWith({
            message: expectedLoggerMessage,
          });
          expect(result).to.deep.equal(expectedResult);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should log error and return httpResponse with error if sending to PE fails', async function () {
          // given
          const tokenResponse = {
            isSuccessful: true,
            data: {
              access_token: 'TOKEN',
            },
          };
          const httpResponse = {
            isSuccessful: false,
            code: 429,
            data: 'Too Many Requests',
          };

          authenticationMethodRepository.findOneByUserIdAndIdentityProvider.resolves(authenticationMethod);
          authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider.resolves();

          httpAgent.post
            .withArgs({
              url: settings.poleEmploi.tokenUrl,
              headers: sinon.match.any,
              payload: sinon.match.any,
            })
            .resolves(tokenResponse)
            .withArgs({
              url: settings.poleEmploi.sendingUrl,
              headers: sinon.match.any,
              payload: sinon.match.any,
            })
            .resolves(httpResponse);

          monitoringTools.logErrorWithCorrelationIds.resolves();

          const expectedLoggerMessage = httpResponse.data;
          const expectedResult = {
            code: httpResponse.code,
            isSuccessful: httpResponse.isSuccessful,
          };

          // when
          const result = await notify(userId, payload, poleEmploiSending);

          // then
          expect(monitoringTools.logErrorWithCorrelationIds).to.have.been.calledWith({
            message: expectedLoggerMessage,
          });
          expect(result).to.deep.equal(expectedResult);
        });
      });
    });
  });
});
