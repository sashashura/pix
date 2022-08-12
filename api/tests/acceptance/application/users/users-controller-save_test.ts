// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pick'.
const pick = require('lodash/pick');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainBuil... Remove this comment to see the full error message
const { domainBuilder, expect, knex, nock } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userReposi... Remove this comment to see the full error message
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('authentication-methods').delete();
    await knex('pix-admin-roles').delete();
    await knex('sessions').delete();
    await knex('users').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('save', function () {
    const options = {
      method: 'POST',
      url: '/api/users',
      payload: {
        data: {
          type: 'users',
          attributes: {
            password: 'Password123',
            cgu: true,
          },
          relationships: {},
        },
      },
    };

    let user: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('user is valid', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        nock('https://www.google.com').post('/recaptcha/api/siteverify').query(true).reply(200, {
          success: true,
        });

        user = domainBuilder.buildUser({ username: null });

        options.payload.data.attributes = {
          ...options.payload.data.attributes,
          // @ts-expect-error TS(2322): Type '{ 'first-name': any; 'last-name': any; email... Remove this comment to see the full error message
          'first-name': user.firstName,
          'last-name': user.lastName,
          email: user.email,
        };
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        nock.cleanAll();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return status 201 with user', async function () {
        // given
        const pickedUserAttributes = ['first-name', 'last-name', 'email', 'username', 'cgu'];
        const expectedAttributes = {
          'first-name': user.firstName,
          'last-name': user.lastName,
          email: user.email,
          username: user.username,
          cgu: user.cgu,
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.result.data.type).to.equal('users');
        expect(response.result.data.attributes['recaptcha-token']).to.be.undefined;
        expect(response.result.data.attributes['last-terms-of-service-validated-at']).to.be.instanceOf(Date);
        const userAttributes = pick(response.result.data.attributes, pickedUserAttributes);
        expect(userAttributes).to.deep.equal(expectedAttributes);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create user in Database', async function () {
        // given
        const pickedUserAttributes = ['firstName', 'lastName', 'email', 'username', 'cgu'];
        const expectedUser = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          cgu: user.cgu,
        };

        // when
        await server.inject(options);

        // then
        const userFound = await userRepository.getByUsernameOrEmailWithRolesAndPassword(user.email);
        expect(pick(userFound, pickedUserAttributes)).to.deep.equal(expectedUser);
        expect(userFound.authenticationMethods[0].authenticationComplement.password).to.exist;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('user is invalid', function () {
      const validUserAttributes = {
        'first-name': 'John',
        'last-name': 'DoDoe',
        email: 'john.doe@example.net',
        password: 'Ab124B2C3#!',
        cgu: true,
      };

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return Unprocessable Entity (HTTP_422) with offending properties', async function () {
        const invalidUserAttributes = { ...validUserAttributes, 'must-validate-terms-of-service': 'not_a_boolean' };

        const options = {
          method: 'POST',
          url: '/api/users',
          payload: {
            data: {
              type: 'users',
              attributes: invalidUserAttributes,
              relationships: {},
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(422);
        expect(response.result.errors[0].title).to.equal('Invalid data attribute "mustValidateTermsOfService"');
      });
    });
  });
});
