// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require('dotenv').config({ path: `${__dirname}/../.env` });
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const chai = require('chai');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const expect = chai.expect;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const sinon = require('sinon');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
chai.use(require('chai-as-promised'));
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
chai.use(require('chai-sorted'));
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
chai.use(require('sinon-chai'));
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const customChaiHelpers = require('./tooling/chai-custom-helpers/index');
_.each(customChaiHelpers, chai.use);
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'cache'.
const cache = require('../lib/infrastructure/caches/learning-content-cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'graviteeRe... Remove this comment to see the full error message
const { graviteeRegisterApplicationsCredentials, jwtConfig } = require('../lib/config');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, disconnect } = require('../db/knex-database-connection');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DatabaseBu... Remove this comment to see the full error message
const DatabaseBuilder = require('../db/database-builder/database-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuilder = new DatabaseBuilder({ knex });

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'nock'.
const nock = require('nock');
nock.disableNetConnect();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const learningContentBuilder = require('./tooling/learning-content-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tokenServi... Remove this comment to see the full error message
const tokenService = require('../lib/domain/services/token-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EMPTY_BLAN... Remove this comment to see the full error message
const EMPTY_BLANK_AND_NULL = ['', '\t \n', null];

/* eslint-disable mocha/no-top-level-hooks */
// @ts-expect-error TS(2304): Cannot find name 'afterEach'.
afterEach(function () {
  sinon.restore();
  cache.flushAll();
  nock.cleanAll();
  return databaseBuilder.clean();
});

// @ts-expect-error TS(2304): Cannot find name 'after'.
after(function () {
  return disconnect();
});
/* eslint-enable mocha/no-top-level-hooks */

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
function generateValidRequestAuthorizationHeader(userId = 1234, source = 'pix') {
  const accessToken = tokenService.createAccessTokenFromUser(userId, source).accessToken;
  return `Bearer ${accessToken}`;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
function generateValidRequestAuthorizationHeaderForApplication(clientId = 'client-id-name', source: $TSFixMe, scope: $TSFixMe) {
  const application = _.find(graviteeRegisterApplicationsCredentials, { clientId });
  if (application) {
    const accessToken = tokenService.createAccessTokenFromApplication(
      application.clientId,
      source,
      scope,
      jwtConfig[application.source].secret
    );
    return `Bearer ${accessToken}`;
  }
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateId... Remove this comment to see the full error message
function generateIdTokenForExternalUser(externalUser: $TSFixMe) {
  return tokenService.createIdTokenForUserReconciliation(externalUser);
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
async function insertUserWithRoleSuperAdmin() {
  const user = databaseBuilder.factory.buildUser.withRole({
    id: 1234,
    firstName: 'Super',
    lastName: 'Papa',
    email: 'super.papa@example.net',
    password: 'Password123',
  });

  await databaseBuilder.commit();

  return user;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertOrga... Remove this comment to see the full error message
async function insertOrganizationUserWithRoleAdmin() {
  const adminUser = databaseBuilder.factory.buildUser();
  const organization = databaseBuilder.factory.buildOrganization();
  databaseBuilder.factory.buildMembership({
    userId: adminUser.id,
    organizationId: organization.id,
    organizationRole: Membership.roles.ADMIN,
  });

  await databaseBuilder.commit();

  return { adminUser, organization };
}

// Hapi
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'hFake'.
const hFake = {
  response(source: $TSFixMe) {
    return {
      source,
      code(c: $TSFixMe) {
        (this as $TSFixMe).statusCode = c;
        return this;
      },
      headers: {},
      header(key: $TSFixMe, value: $TSFixMe) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this.headers[key] = value;
        return this;
      },
      type(type: $TSFixMe) {
        (this as $TSFixMe).contentType = type;
        return this;
      },
      takeover() {
        // @ts-expect-error TS(2551): Property 'isTakeOver' does not exist on type '{ so... Remove this comment to see the full error message
        this.isTakeOver = true;
        return this;
      },
      created() {
        (this as $TSFixMe).statusCode = 201;
        return this;
      },
    };
  },
  authenticated(data: $TSFixMe) {
    return {
      authenticated: data,
    };
  },
  redirect(location: $TSFixMe) {
    return {
      location,
    };
  },
  file(path: $TSFixMe, options: $TSFixMe) {
    return this.response({ path, options });
  },
  continue: Symbol('continue'),
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'streamToPr... Remove this comment to see the full error message
function streamToPromise(stream: $TSFixMe) {
  return new Promise((resolve, reject) => {
    let totalData = '';
    stream.on('data', (data: $TSFixMe) => {
      totalData += data;
    });
    stream.on('end', () => {
      resolve(totalData);
    });
    stream.on('error', reject);
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
function catchErr(promiseFn: $TSFixMe, ctx: $TSFixMe) {
  return async (...args: $TSFixMe[]) => {
    try {
      await promiseFn.call(ctx, ...args);
      return 'should have thrown an error';
    } catch (err) {
      return err;
    }
  };
}

chai.use(function (chai: $TSFixMe) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('exactlyContain', function(this: $TSFixMe, expectedElements: $TSFixMe) {
    const errorMessage = `expect [${this._obj}] to exactly contain [${expectedElements}]`;
    new Assertion(this._obj, errorMessage).to.deep.have.members(expectedElements);
  });
});

chai.use(function (chai: $TSFixMe) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('exactlyContainInOrder', function(this: $TSFixMe, expectedElements: $TSFixMe) {
    const errorMessage = `expect [${this._obj}] to exactly contain in order [${expectedElements}]`;

    new Assertion(this._obj, errorMessage).to.deep.equal(expectedElements);
  });
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
function mockLearningContent(learningContent: $TSFixMe) {
  nock('https://lcms-test.pix.fr/api')
    .get('/releases/latest')
    .matchHeader('Authorization', 'Bearer test-api-key')
    .reply(200, { content: learningContent });
}

// Inspired by what is done within chai project itself to test assertions
// https://github.com/chaijs/chai/blob/main/test/bootstrap/index.js
// @ts-expect-error TS(2304): Cannot find name 'global'.
global.chaiErr = function globalErr(fn: $TSFixMe, val: $TSFixMe) {
  if (chai.util.type(fn) !== 'function') throw new chai.AssertionError('Invalid fn');

  try {
    fn();
  } catch (err) {
    switch (chai.util.type(val).toLowerCase()) {
      case 'undefined':
        return;
      case 'string':
        return chai.expect((err as $TSFixMe).message).to.equal(val);
      case 'regexp':
        return chai.expect((err as $TSFixMe).message).to.match(val);
      case 'object':
        return Object.keys(val).forEach(function (key) {
          chai.expect(err).to.have.property(key).and.to.deep.equal(val[key]);
        });
    }

    throw new chai.AssertionError('Invalid val');
  }

  throw new chai.AssertionError('Expected an error');
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
// eslint-disable-next-line mocha/no-exports
module.exports = {
  EMPTY_BLANK_AND_NULL,
  expect,
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  domainBuilder: require('./tooling/domain-builder/factory'),
  databaseBuilder,
  generateValidRequestAuthorizationHeader,
  generateValidRequestAuthorizationHeaderForApplication,
  generateIdTokenForExternalUser,
  hFake,
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  HttpTestServer: require('./tooling/server/http-test-server'),
  insertOrganizationUserWithRoleAdmin,
  insertUserWithRoleSuperAdmin,
  knex,
  nock,
  sinon,
  streamToPromise,
  catchErr,
  testErr: new Error('Fake Error'),
  mockLearningContent,
  learningContentBuilder,
};
