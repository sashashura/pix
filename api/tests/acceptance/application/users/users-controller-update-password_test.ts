// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, hFake, knex, databaseBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationController = require('../../../../lib/application/authentication/authentication-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-update-password', function () {
  const temporaryKey = 'good-temporary-key';

  let server: $TSFixMe;
  let user: $TSFixMe;
  let options: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();

    user = databaseBuilder.factory.buildUser.withRawPassword({
      email: 'harry.cover@truc.so',
      rawPassword: 'Password2020',
    });
    await databaseBuilder.commit();
    await _insertPasswordResetDemand(temporaryKey, user.email);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('authentication-methods').delete();
    await knex('reset-password-demands').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Error case', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with an error, when temporary key is invalid', async function () {
      // given
      options = {
        method: 'PATCH',
        url: `/api/users/${user.id}/password-update?temporary-key=bad-temporary-key`,
        payload: {
          data: {
            id: user.id,
            attributes: {
              password: 'Password2021',
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Success case', function () {
    const newPassword = 'Password2021';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      options = {
        method: 'PATCH',
        url: `/api/users/${user.id}/password-update?temporary-key=${temporaryKey}`,
        payload: {
          data: {
            id: user.id,
            attributes: {
              password: newPassword,
            },
          },
        },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reply with 200 status code, when password is updated', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should authenticate user when password is updated', async function () {
      // given
      await server.inject(options);

      const request = {
        payload: {
          grant_type: 'password',
          username: user.email,
          password: newPassword,
        },
      };
      let access_token = null;

      // when
      access_token = await authenticationController.createToken(request, hFake);

      // then
      expect(access_token).to.ok;
    });
  });
});

function _insertPasswordResetDemand(temporaryKey: $TSFixMe, email: $TSFixMe) {
  const resetDemandRaw = { email, temporaryKey };
  return knex('reset-password-demands').insert(resetDemandRaw);
}
