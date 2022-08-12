// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | users-controller-find-users', function () {
  let server: $TSFixMe;
  let options: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();

    const userSuperAdminId = databaseBuilder.factory.buildUser.withRole({
      firstName: 'SuperAdmin_firstName',
      lastName: 'SuperAdmin_lastName',
    }).id;

    databaseBuilder.factory.buildUser({
      firstName: 'Jean-Paul',
      lastName: 'Grand',
      email: 'jean-paul.grand@example.net',
    });
    databaseBuilder.factory.buildUser({ firstName: 'Jean', lastName: 'Coula', email: 'jean.coula@example.org' });

    options = {
      method: 'GET',
      url: '/api/admin/users',
      headers: { authorization: generateValidRequestAuthorizationHeader(userSuperAdminId) },
    };

    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /users', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(401);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 - forbidden access - if user has not role Super Admin', function () {
        // given
        const nonSuperAdminUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(nonSuperAdminUserId);

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(403);
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 200 status code response with JSON API serialized', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.have.lengthOf(3);
        expect(response.result.data[0].type).to.equal('users');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return pagination meta data', async function () {
        // given
        const expectedMetaData = { page: 1, pageSize: 10, rowCount: 3, pageCount: 1 };

        // when
        const response = await server.inject(options);

        // then
        expect(response.result.meta).to.deep.equal(expectedMetaData);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 200 status code with paginated and filtered data', async function () {
        // given
        options.url = '/api/admin/users?filter[firstName]=jean&page[number]=2&page[size]=1';
        const expectedMetaData = { page: 2, pageSize: 1, rowCount: 2, pageCount: 2 };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.meta).to.deep.equal(expectedMetaData);
        expect(response.result.data).to.have.lengthOf(1);
        expect(response.result.data[0].type).to.equal('users');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a 200 status code with empty result', async function () {
        // given
        options.url = '/api/admin/users?filter[firstName]=jean&filter[lastName]=jean&page[number]=1&page[size]=1';
        const expectedMetaData = { page: 1, pageSize: 1, rowCount: 0, pageCount: 0 };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.meta).to.deep.equal(expectedMetaData);
        expect(response.result.data).to.have.lengthOf(0);
      });
    });
  });
});
