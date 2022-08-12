const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | organization-learner', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/schooling-registration-user-associations/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user has the role SUPER_ADMIN and organization learner can be dissociated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an 204 status after having successfully dissociated user from organizationLearner', async function () {
        const organizationId = databaseBuilder.factory.buildOrganization({ isManagingStudents: true }).id;
        const superAdmin = await insertUserWithRoleSuperAdmin();
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId });

        await databaseBuilder.commit();

        const options = {
          method: 'DELETE',
          url: `/api/schooling-registration-user-associations/${organizationLearner.id}`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
          },
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(204);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/admin/organization-learners/{id}/association', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When user has the role SUPER_ADMIN and organization learner can be dissociated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an 204 status after having successfully dissociated user from organizationLearner', async function () {
        const organizationId = databaseBuilder.factory.buildOrganization({ isManagingStudents: true }).id;
        const superAdmin = await insertUserWithRoleSuperAdmin();
        const userId = databaseBuilder.factory.buildUser().id;
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({ organizationId, userId });

        await databaseBuilder.commit();

        const options = {
          method: 'DELETE',
          url: `/api/admin/organization-learners/${organizationLearner.id}/association`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
          },
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(204);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/schooling-registration-user-associations', function () {
    let options: $TSFixMe;
    let user: $TSFixMe;
    let organization;
    let organizationLearner: $TSFixMe;
    let campaignCode: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization({ isManagingStudents: true });
      campaignCode = databaseBuilder.factory.buildCampaign({ organizationId: organization.id, code: 'YUTR789' }).code;
      user = databaseBuilder.factory.buildUser();
      organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'josé',
        lastName: 'bové',
        birthdate: '2020-01-01',
        nationalStudentId: 'josébové123',
        organizationId: organization.id,
        userId: user.id,
      });
      await databaseBuilder.commit();
      options = {
        method: 'GET',
        url: `/api/schooling-registration-user-associations?userId=${user.id}&campaignCode=${campaignCode}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 - forbidden access - if requested user is not the same as authenticated user', async function () {
        // given
        const otherUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the organizationLearner linked to the user and a 200 status code response', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.type).to.equal('schooling-registration-user-associations');
        expect(response.result.data.attributes['first-name']).to.deep.equal(organizationLearner.firstName);
        expect(response.result.data.attributes['last-name']).to.deep.equal(organizationLearner.lastName);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('There is no organizationLearner linked to the user', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a data null', async function () {
        // given
        const userWithoutStudent = databaseBuilder.factory.buildUser({
          firstName: 'jack',
          lastName: 'black',
        });
        await databaseBuilder.commit();

        options = {
          method: 'GET',
          url: `/api/schooling-registration-user-associations?userId=${userWithoutStudent.id}&campaignCode=${campaignCode}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userWithoutStudent.id) },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.result.data).to.equal(null);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('There is no organizationLearner linked to the organization owning the campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a data null', async function () {
        // given
        const otherCampaignCode = databaseBuilder.factory.buildCampaign({ code: 'ABCDE123' }).code;
        await databaseBuilder.commit();
        options = {
          method: 'GET',
          url: `/api/schooling-registration-user-associations?userId=${user.id}&campaignCode=${otherCampaignCode}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.result.data).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/organization-learners', function () {
    let options: $TSFixMe;
    let user;
    let organization;
    let organizationLearner: $TSFixMe;
    let campaignCode;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organization = databaseBuilder.factory.buildOrganization({ isManagingStudents: true });
      campaignCode = databaseBuilder.factory.buildCampaign({ organizationId: organization.id, code: 'YUTR789' }).code;
      user = databaseBuilder.factory.buildUser();
      organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'josé',
        lastName: 'bové',
        birthdate: '2020-01-01',
        nationalStudentId: 'josébové123',
        organizationId: organization.id,
        userId: user.id,
      });
      await databaseBuilder.commit();
      options = {
        method: 'GET',
        url: `/api/organization-learners?userId=${user.id}&campaignCode=${campaignCode}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the organizationLearner linked to the user and a 200 status code response', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.type).to.equal('organization-learner-identities');
        expect(response.result.data.attributes['first-name']).to.deep.equal(organizationLearner.firstName);
        expect(response.result.data.attributes['last-name']).to.deep.equal(organizationLearner.lastName);
      });
    });
  });
});
