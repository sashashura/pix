const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Certification Center Membership', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    await insertUserWithRoleSuperAdmin();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-center-memberships', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('certification-center-memberships').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is Super Admin', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 201 HTTP status', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
        await databaseBuilder.commit();

        const options = {
          method: 'POST',
          url: '/api/certification-center-memberships',
          headers: { authorization: generateValidRequestAuthorizationHeader() },
          payload: {
            data: {
              type: 'certification-center-membership',
              attributes: {
                'user-id': user.id,
                'certification-center-id': certificationCenter.id,
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
    context('when user is not SuperAdmin', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 403 HTTP status code ', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
        await databaseBuilder.commit();

        const options = {
          method: 'POST',
          url: '/api/certification-center-memberships',
          headers: { authorization: generateValidRequestAuthorizationHeader(1111) },
          payload: {
            data: {
              type: 'certification-center-membership',
              attributes: {
                'user-id': user.id,
                'certification-center-id': certificationCenter.id,
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

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not connected', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401 HTTP status code if user is not authenticated', async function () {
        // given
        const user = databaseBuilder.factory.buildUser();
        const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
        await databaseBuilder.commit();

        const options = {
          method: 'POST',
          url: '/api/certification-center-memberships',
          payload: {
            data: {
              type: 'certification-center-membership',
              attributes: {
                'user-id': user.id,
                'certification-center-id': certificationCenter.id,
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/certification-center-memberships/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status', async function () {
      // given
      const now = new Date();
      const clock = sinon.useFakeTimers({
        now,
        toFake: ['Date'],
      });
      const userId = databaseBuilder.factory.buildUser().id;
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const certificationCenterMembershipId = databaseBuilder.factory.buildCertificationCenterMembership({
        userId,
        certificationCenterId,
      }).id;
      await databaseBuilder.commit();

      const options = {
        method: 'DELETE',
        url: `/api/certification-center-memberships/${certificationCenterMembershipId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader() },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
      clock.restore();
    });
  });
});
