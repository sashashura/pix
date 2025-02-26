const querystring = require('querystring');
const { expect, databaseBuilder, knex } = require('../../test-helper');
const tokenService = require('../../../lib/domain/services/token-service');
const AuthenticationMethod = require('../../../lib/domain/models/AuthenticationMethod');
const settings = require('../../../lib/config');
const { ROLES } = require('../../../lib/domain/constants').PIX_ADMIN;

const createServer = require('../../../server');

describe('Acceptance | Controller | authentication-controller', function () {
  describe('POST /api/token', function () {
    const orgaRoleInDB = { id: 1, name: 'ADMIN' };

    const userEmailAddress = 'user@example.net';
    const userPassword = 'A124B2C3#!';

    let server;
    let userId;

    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser.withRawPassword({
        email: userEmailAddress,
        rawPassword: userPassword,
        cgu: true,
      }).id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildMembership({ userId, organizationId, organizationRoleId: orgaRoleInDB.id });
      await databaseBuilder.commit();
    });

    function apiTokenTests() {
      it('should return a 200 with an access token and a refresh token when authentication is ok', async function () {
        // given / when
        const response = await server.inject({
          method: 'POST',
          url: '/api/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            grant_type: 'password',
            username: userEmailAddress,
            password: userPassword,
            scope: 'pix-orga',
          }),
        });

        // then
        const result = response.result;
        expect(response.statusCode).to.equal(200);
        expect(result.token_type).to.equal('bearer');
        expect(result.access_token).to.exist;
        expect(result.user_id).to.equal(userId);
        expect(result.refresh_token).to.exist;
      });

      it('should return a 400 if grant type is invalid', async function () {
        // when
        const errorResponse = await server.inject({
          method: 'POST',
          url: '/api/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            grant_type: 'appleSauce',
          }),
        });

        // then
        expect(errorResponse.statusCode).to.equal(400);
      });

      it('should return http code 401 when user should change password', async function () {
        // given
        databaseBuilder.factory.buildUser.withRawPassword({
          username: 'beth.rave1212',
          rawPassword: userPassword,
          cgu: true,
          shouldChangePassword: true,
        });

        await databaseBuilder.commit();

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            grant_type: 'password',
            username: 'beth.rave1212',
            password: userPassword,
            scope: 'pix',
          }),
        });

        // then
        expect(response.statusCode).to.equal(401);
        expect(response.result.errors[0].title).equal('PasswordShouldChange');
        expect(response.result.errors[0].detail).equal('Erreur, vous devez changer votre mot de passe.');
        expect(response.result.errors[0].meta).to.exist;
      });
    }

    context('with rate limit disabled', function () {
      let previousRateLimit;
      beforeEach(async function () {
        previousRateLimit = { ...settings.rateLimit };
        settings.rateLimit.enabled = false;
        server = await createServer();
        await server.initialize();
      });
      afterEach(function () {
        settings.rateLimit = previousRateLimit;
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      apiTokenTests();
    });

    context('with rate limit enabled in logOnlyMode', function () {
      let previousRateLimit;

      beforeEach(async function () {
        previousRateLimit = { ...settings.rateLimit };
        settings.rateLimit.enabled = true;
        settings.rateLimit.logOnly = true;
        server = await createServer();
        await server.initialize();
      });
      afterEach(function () {
        settings.rateLimit = previousRateLimit;
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      apiTokenTests();

      it('should not return 429 errors when the rate limit is reached', async function () {
        settings.rateLimit.limit = 1;
        await server.inject({
          method: 'POST',
          url: '/api/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            grant_type: 'password',
            username: 'test',
            password: 'test',
          }),
        });
        const response = await server.inject({
          method: 'POST',
          url: '/api/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            grant_type: 'password',
            username: 'test',
            password: 'test2',
          }),
        });

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    context('when the rate limit is active', function () {
      let previousRateLimit;

      beforeEach(async function () {
        previousRateLimit = { ...settings.rateLimit };
        settings.rateLimit.enabled = true;
        settings.rateLimit.logOnly = false;
        server = await createServer();
        await server.initialize();
      });
      afterEach(function () {
        settings.rateLimit = previousRateLimit;
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      apiTokenTests();

      it('should returns 429 TOO_MANY_REQUESTS when the rate limit is reached', async function () {
        settings.rateLimit.limit = 1;
        const options = {
          method: 'POST',
          url: '/api/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            grant_type: 'password',
            username: 'test',
            password: 'test',
          }),
        };
        await server.inject(options);
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(429);
      });
    });

    context('when scope is admin', function () {
      context('when admin member has allowed role but has been disabled', function () {
        it('should return http code 403', async function () {
          //given
          const user = databaseBuilder.factory.buildUser.withRawPassword({
            email: 'email@example.net',
            rawPassword: userPassword,
            cgu: true,
          });
          databaseBuilder.factory.buildPixAdminRole({
            userId: user.id,
            role: ROLES.CERTIF,
            disabledAt: new Date('2021-01-02'),
          });
          await databaseBuilder.commit();
          const options = _getOptions({ scope: 'pix-admin', username: user.email, password: userPassword });

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
    context('when scope is pix-certif', function () {
      context('when certification center has the supervisor access enabled', function () {
        it('should return http code 200 with accessToken when authentication is ok', async function () {
          //given
          databaseBuilder.factory.buildCertificationCenter({ id: 345, isSupervisorAccessEnabled: true });
          databaseBuilder.factory.buildSession({ id: 121, certificationCenterId: 345 });
          databaseBuilder.factory.buildCertificationCandidate({ sessionId: 121 });
          databaseBuilder.factory.buildSupervisorAccess({ userId, sessionId: 121 });
          await databaseBuilder.commit();

          const options = _getOptions({ scope: 'pix-certif', username: userEmailAddress, password: userPassword });

          await databaseBuilder.commit();
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);

          const result = response.result;
          expect(result.token_type).to.equal('bearer');
          expect(result.access_token).to.exist;
          expect(result.user_id).to.equal(userId);
        });
      });

      context('when certification center does not have the supervisor access enabled', function () {
        it('should return http code 403 ', async function () {
          //given
          databaseBuilder.factory.buildUser.withRawPassword({
            email: 'email@without.mb',
            rawPassword: userPassword,
            cgu: true,
          });
          databaseBuilder.factory.buildCertificationCenter({ id: 345, isSupervisorAccessEnabled: false });
          databaseBuilder.factory.buildSession({ id: 121, certificationCenterId: 345 });
          databaseBuilder.factory.buildCertificationCandidate({ sessionId: 121 });
          databaseBuilder.factory.buildSupervisorAccess({ userId, sessionId: 121 });

          await databaseBuilder.commit();
          const options = _getOptions({ scope: 'pix-certif', username: 'email@without.mb', password: userPassword });

          // when
          const { statusCode } = await server.inject(options);

          // then
          expect(statusCode).to.equal(403);
        });
      });
    });
  });

  describe('POST /api/token-from-external-user', function () {
    let server;

    beforeEach(async function () {
      server = await createServer();
    });

    afterEach(async function () {
      await knex('authentication-methods').delete();
    });

    describe('when user has a reconciled Pix account, then connect to Pix from GAR', function () {
      it('should return an 200 with accessToken', async function () {
        // given
        const password = 'Pix123';
        const userAttributes = {
          firstName: 'saml',
          lastName: 'jackson',
          samlId: 'SAMLJACKSONID',
        };
        const user = databaseBuilder.factory.buildUser.withRawPassword({
          username: 'saml.jackson1234',
          rawPassword: password,
        });
        const expectedExternalToken = tokenService.createIdTokenForUserReconciliation(userAttributes);

        const options = {
          method: 'POST',
          url: '/api/token-from-external-user',
          payload: {
            data: {
              attributes: {
                username: user.username,
                password: password,
                'external-user-token': expectedExternalToken,
                'expected-user-id': user.id,
              },
              type: 'external-user-authentication-requests',
            },
          },
        };

        await databaseBuilder.commit();

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.attributes['access-token']).to.exist;
      });

      it('should add GAR authentication method', async function () {
        // given
        const password = 'Pix123';
        const userAttributes = {
          firstName: 'saml',
          lastName: 'jackson',
          samlId: 'SAMLJACKSONID',
        };
        const user = databaseBuilder.factory.buildUser.withRawPassword({
          username: 'saml.jackson1234',
          rawPassword: password,
        });
        const expectedExternalToken = tokenService.createIdTokenForUserReconciliation(userAttributes);

        const options = {
          method: 'POST',
          url: '/api/token-from-external-user',
          payload: {
            data: {
              attributes: {
                username: user.username,
                password: password,
                'external-user-token': expectedExternalToken,
                'expected-user-id': user.id,
              },
              type: 'external-user-authentication-requests',
            },
          },
        };

        await databaseBuilder.commit();

        // when
        await server.inject(options);

        // then
        const authenticationMethods = await knex('authentication-methods').where({
          identityProvider: AuthenticationMethod.identityProviders.GAR,
          userId: user.id,
          externalIdentifier: 'SAMLJACKSONID',
        });
        expect(authenticationMethods.length).to.equal(1);
        expect(authenticationMethods[0].authenticationComplement).to.deep.equal({
          firstName: 'saml',
          lastName: 'jackson',
        });
      });
    });
  });

  describe('POST /api/token/anonymous', function () {
    let server;
    let options;

    beforeEach(async function () {
      server = await createServer();
    });

    context('When is not simplified Access Campaign', function () {
      const campaignCode = 'RANDOM123';
      const lang = 'en';

      beforeEach(async function () {
        const targetProfile = databaseBuilder.factory.buildTargetProfile({ isSimplifiedAccess: false });
        databaseBuilder.factory.buildCampaign({ code: campaignCode, targetProfile });

        options = {
          method: 'POST',
          url: '/api/token/anonymous',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            campaign_code: campaignCode,
            lang,
          }),
        };

        await databaseBuilder.commit();
      });

      it('should return an 401', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
        expect(response.result.errors[0].detail).to.equal("L'utilisateur ne peut pas être créé");
      });
    });

    context('When is simplified Access Campaign', function () {
      const simplifiedAccessCampaignCode = 'SIMPLIFIE';
      const firstName = '';
      const lastName = '';
      const isAnonymous = true;
      const lang = 'en';

      beforeEach(async function () {
        const targetProfileId = databaseBuilder.factory.buildTargetProfile({ isSimplifiedAccess: true }).id;
        databaseBuilder.factory.buildCampaign({ code: simplifiedAccessCampaignCode, targetProfileId });

        options = {
          method: 'POST',
          url: '/api/token/anonymous',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          payload: querystring.stringify({
            campaign_code: simplifiedAccessCampaignCode,
            lang,
          }),
        };

        await databaseBuilder.commit();
      });

      it('should return a 200 with accessToken', async function () {
        // when
        const response = await server.inject(options);
        const result = response.result;

        // then
        expect(response.statusCode).to.equal(200);

        expect(result.token_type).to.equal('bearer');
        expect(result.access_token).to.exist;
      });

      it('should create an anonymous user', async function () {
        // when
        await server.inject(options);

        // then
        const users = await knex('users').where({ firstName, lastName, isAnonymous });
        expect(users[0]).to.exist;
      });
    });
  });

  describe('POST /api/application/token', function () {
    let server;
    let options;
    const OSMOSE_CLIENT_ID = 'graviteeOsmoseClientId';
    const OSMOSE_CLIENT_SECRET = 'graviteeOsmoseClientSecret';
    const SCOPE = 'organizations-certifications-result';

    beforeEach(async function () {
      server = await createServer();
      options = {
        method: 'POST',
        url: '/api/application/token',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      };
    });

    it('should return an 200 with accessToken when clientId, client secret and scope are registred', async function () {
      // given
      options.payload = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: OSMOSE_CLIENT_ID,
        client_secret: OSMOSE_CLIENT_SECRET,
        scope: SCOPE,
      });

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);

      const result = response.result;
      expect(result.token_type).to.equal('bearer');
      expect(result.access_token).to.exist;
      expect(result.client_id).to.equal(OSMOSE_CLIENT_ID);
    });

    it('should return an 401 when clientId is not registred', async function () {
      // given
      options.payload = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: 'NOT REGISTRED',
        client_secret: OSMOSE_CLIENT_SECRET,
        scope: SCOPE,
      });

      // when
      const response = await server.inject(options);

      // then
      expect(response.result.errors[0]).to.deep.equal({
        title: 'Unauthorized',
        detail: 'The client ID is invalid.',
        status: '401',
      });
    });

    it('should return an 401 when client secret is not valid', async function () {
      // given
      options.payload = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: OSMOSE_CLIENT_ID,
        client_secret: 'invalid secret',
        scope: SCOPE,
      });

      // when
      const response = await server.inject(options);

      // then
      expect(response.result.errors[0]).to.deep.equal({
        title: 'Unauthorized',
        detail: 'The client secret is invalid.',
        status: '401',
      });
    });

    it('should return an 403 when scope is not allowed', async function () {
      // given
      options.payload = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: OSMOSE_CLIENT_ID,
        client_secret: OSMOSE_CLIENT_SECRET,
        scope: 'invalid scope',
      });

      // when
      const response = await server.inject(options);

      // then
      expect(response.result.errors[0]).to.deep.equal({
        title: 'Forbidden',
        detail: 'The scope is not allowed.',
        status: '403',
      });
    });
  });

  function _getOptions({ scope, password, username }) {
    return {
      method: 'POST',
      url: '/api/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      payload: querystring.stringify({
        grant_type: 'password',
        username,
        password,
        scope,
      }),
    };
  }
});
