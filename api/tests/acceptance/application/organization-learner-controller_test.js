const {
  databaseBuilder,
  expect,
  insertUserWithRoleSuperAdmin,
  generateValidRequestAuthorizationHeader,
} = require('../../test-helper');

const createServer = require('../../../server');

describe('Acceptance | Controller | organization-learner', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('DELETE /api/schooling-registration-user-associations/{id}', function () {
    context('When user has the role SUPER_ADMIN and organization learner can be dissociated', function () {
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

  describe('DELETE /api/admin/organization-learners/{id}/association', function () {
    context('When user has the role SUPER_ADMIN and organization learner can be dissociated', function () {
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

  describe('GET /api/schooling-registration-user-associations', function () {
    let options;
    let user;
    let organization;
    let organizationLearner;
    let campaignCode;

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

    describe('Resource access management', function () {
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

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

    describe('Success case', function () {
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

    describe('There is no organizationLearner linked to the user', function () {
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

    describe('There is no organizationLearner linked to the organization owning the campaign', function () {
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

  describe('GET /api/organization-learners', function () {
    let options;
    let user;
    let organization;
    let organizationLearner;
    let campaignCode;

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

    describe('Resource access management', function () {
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    describe('Success case', function () {
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
