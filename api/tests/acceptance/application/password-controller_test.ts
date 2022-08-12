// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, knex, sinon } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../../../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetPassw... Remove this comment to see the full error message
const resetPasswordService = require('../../../lib/domain/services/reset-password-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resetPassw... Remove this comment to see the full error message
const resetPasswordDemandRepository = require('../../../lib/infrastructure/repositories/reset-password-demands-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../../lib/config');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | password-controller', function () {
  const email = 'user@example.net';

  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/password-reset-demands', function () {
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      options = {
        method: 'POST',
        url: '/api/password-reset-demands',
        payload: {
          data: {
            attributes: { email },
          },
        },
      };

      config.mailing.enabled = false;

      const userId = databaseBuilder.factory.buildUser({ email }).id;
      databaseBuilder.factory.buildAuthenticationMethod.withPixAsIdentityProviderAndHashedPassword({ userId });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('reset-password-demands').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when email provided is unknown', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with 404', async function () {
        // given
        options.payload.data.attributes.email = 'unknown@example.net';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when existing email is provided and email is delivered', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with 201', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when existing email is provided, but some internal error has occured', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with 500', async function () {
        // given
        sinon.stub(resetPasswordDemandRepository, 'create').rejects(new Error());

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(500);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/password-reset-demands/{temporaryKey}', function () {
    const options = {
      method: 'GET',
      url: null,
    };

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when temporaryKey is not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reply with 401 status code', async function () {
        // given
        // @ts-expect-error TS(2322): Type '"/api/password-reset-demands/invalid-tempora... Remove this comment to see the full error message
        options.url = '/api/password-reset-demands/invalid-temporary-key';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when temporaryKey is valid', function () {
      let temporaryKey: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        temporaryKey = resetPasswordService.generateTemporaryKey();
        // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'null'.
        options.url = `/api/password-reset-demands/${temporaryKey}`;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when temporaryKey is not linked to a reset password demand', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reply with 404 status code', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(404);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when something going wrong', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reply with 500 status code', async function () {
          // given
          sinon.stub(resetPasswordService, 'verifyDemand').rejects(new Error());

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(500);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when temporaryKey is linked to a password reset demand', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          databaseBuilder.factory.buildUser({ email });
          databaseBuilder.factory.buildResetPasswordDemand({ email, temporaryKey });

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should reply with 200 status code', async function () {
          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/expired-password-updates', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('authentication-methods').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 201 HTTP status code', async function () {
        // given
        const user = databaseBuilder.factory.buildUser.withRawPassword({
          shouldChangePassword: true,
        });
        await databaseBuilder.commit();
        const passwordResetToken = tokenService.createPasswordResetToken(user.id);

        const options = {
          method: 'POST',
          url: '/api/expired-password-updates',
          payload: {
            data: {
              attributes: {
                'password-reset-token': passwordResetToken,
                'new-password': 'Password02',
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Error cases', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when shouldChangePassword is false', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond 403 HTTP status code', async function () {
          // given
          const user = databaseBuilder.factory.buildUser.withRawPassword({
            shouldChangePassword: false,
          });
          await databaseBuilder.commit();
          const passwordResetToken = tokenService.createPasswordResetToken(user.id);

          const options = {
            method: 'POST',
            url: '/api/expired-password-updates',
            payload: {
              data: {
                attributes: {
                  'password-reset-token': passwordResetToken,
                  'new-password': 'Password02',
                },
              },
            },
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(403);
        });
      });
    });
  });
});
