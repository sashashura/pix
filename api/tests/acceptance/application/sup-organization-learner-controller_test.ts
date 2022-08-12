// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, generateValidRequestAuthorizationHeader } = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../lib/domain/models/Membership');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | sup-organization-learners', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/schooling-registration-user-associations/student', function () {
    let organization;
    let campaign: $TSFixMe;
    let options: $TSFixMe;
    let user: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      options = {
        method: 'POST',
        url: '/api/schooling-registration-user-associations/student',
        headers: {},
        payload: {},
      };

      user = databaseBuilder.factory.buildUser();
      organization = databaseBuilder.factory.buildOrganization();
      campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id });
      databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Jean',
        lastName: 'Michel',
        birthdate: new Date('2010-01-01'),
        studentNumber: '12345',
        organizationId: organization.id,
        userId: null,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an 204 status after updating higher organization learner', async function () {
      // given
      options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
      options.payload.data = {
        attributes: {
          'student-number': '12345',
          'first-name': 'Jean',
          'last-name': 'Michel',
          birthdate: '2010-01-01',
          'campaign-code': campaign.code,
        },
        type: 'schooling-registration-user-associations',
      };

      // when
      const response = await server.inject(options);
      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/sup-organization-learners/association', function () {
    let organization;
    let campaign: $TSFixMe;
    let options: $TSFixMe;
    let user: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      options = {
        method: 'POST',
        url: '/api/sup-organization-learners/association',
        headers: {},
        payload: {},
      };

      user = databaseBuilder.factory.buildUser();
      organization = databaseBuilder.factory.buildOrganization();
      campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id });
      databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Jean',
        lastName: 'Michel',
        birthdate: new Date('2010-01-01'),
        studentNumber: '12345',
        organizationId: organization.id,
        userId: null,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an 204 status after updating higher organization learner', async function () {
      // given
      options.headers.authorization = generateValidRequestAuthorizationHeader(user.id);
      options.payload.data = {
        attributes: {
          'student-number': '12345',
          'first-name': 'Jean',
          'last-name': 'Michel',
          birthdate: '2010-01-01',
          'campaign-code': campaign.code,
        },
        type: 'sup-organization-learners',
      };

      // when
      const response = await server.inject(options);
      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/organizations/id/schooling-registration-user-associations/schoolingRegistrationId', function () {
    let organizationId: $TSFixMe;
    const studentNumber = '54321';
    let organizationLearnerId: $TSFixMe;
    let authorizationToken: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization({ isManagingStudents: true, type: 'SUP' }).id;

      const user = databaseBuilder.factory.buildUser();
      authorizationToken = generateValidRequestAuthorizationHeader(user.id);
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;
      databaseBuilder.factory.buildMembership({
        organizationId,
        userId: user.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 204', async function () {
        const options = {
          method: 'PATCH',
          url: `/api/organizations/${organizationId}/schooling-registration-user-associations/${organizationLearnerId}`,
          headers: {
            authorization: authorizationToken,
          },
          payload: {
            data: {
              attributes: {
                'student-number': studentNumber,
              },
            },
          },
        };
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/organizations/id/sup-organization-learners/organizationLearnerId', function () {
    let organizationId: $TSFixMe;
    const studentNumber = '54321';
    let organizationLearnerId: $TSFixMe;
    let authorizationToken: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization({ isManagingStudents: true, type: 'SUP' }).id;

      const user = databaseBuilder.factory.buildUser();
      authorizationToken = generateValidRequestAuthorizationHeader(user.id);
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;
      databaseBuilder.factory.buildMembership({
        organizationId,
        userId: user.id,
        organizationRole: Membership.roles.ADMIN,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an HTTP response with status code 204', async function () {
        const options = {
          method: 'PATCH',
          url: `/api/organizations/${organizationId}/sup-organization-learners/${organizationLearnerId}`,
          headers: {
            authorization: authorizationToken,
          },
          payload: {
            data: {
              attributes: {
                'student-number': studentNumber,
              },
            },
          },
        };
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });
  });
});
