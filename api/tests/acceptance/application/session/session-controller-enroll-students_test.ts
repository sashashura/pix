const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-enroll-students-to-session', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#enrollStudentsToSession', function () {
    let options: $TSFixMe;
    let payload;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser().id;
      options = {
        method: 'POST',
        url: '/api/sessions/1/enroll-students-to-session',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is not authenticated', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options = {
          method: 'PUT',
          url: '/api/sessions/1/enroll-students-to-session',
          headers: { authorization: 'invalid.access.token' },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when session id is not an integer', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options = {
          method: 'PUT',
          url: '/api/sessions/2.1/enroll-students-to-session',
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 400 - Bad Request', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
        expect(response.result.errors[0].title).to.equal('Bad Request');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user is authenticated', function () {
      let sessionId;
      let organizationLearner: $TSFixMe;
      let country: $TSFixMe;
      const birthCityCode = 'Detroit313';
      const FRANCE_INSEE_CODE = '99100';
      const FRANCE_ORGANIZATION_LEARNER_INSEE_CODE = '100';

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        return knex('certification-candidates').delete();
      });

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const { id: certificationCenterId, externalId } = databaseBuilder.factory.buildCertificationCenter({
          type: 'SCO',
        });

        sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;
        const { id: organizationId } = databaseBuilder.factory.buildOrganization({
          type: 'SCO',
          externalId,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
        country = databaseBuilder.factory.buildCertificationCpfCountry({
          code: FRANCE_INSEE_CODE,
          commonName: 'FRANCE',
          originalName: 'FRANCE',
        });

        organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          birthCityCode,
          birthCountryCode: FRANCE_ORGANIZATION_LEARNER_INSEE_CODE,
        });

        await databaseBuilder.commit();
        payload = {
          data: {
            attributes: {
              'student-ids': [organizationLearner.id],
            },
          },
        };
        options = {
          method: 'PUT',
          url: `/api/sessions/${sessionId}/enroll-students-to-session`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
          payload,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 201', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
        sinon.assert.match(response.result, {
          data: [
            {
              attributes: {
                'billing-mode': '',
                'prepayment-code': null,
                'birth-city': organizationLearner.birthCity,
                birthdate: organizationLearner.birthdate,
                'first-name': organizationLearner.firstName,
                'birth-country': country.commonName,
                'is-linked': false,
                'last-name': organizationLearner.lastName,
                'birth-province-code': null,
                'birth-insee-code': birthCityCode,
                'birth-postal-code': null,
                email: null,
                'external-id': null,
                'extra-time-percentage': null,
                'result-recipient-email': null,
                'schooling-registration-id': organizationLearner.id,
                'organization-learner-id': organizationLearner.id,
                sex: 'M',
                'complementary-certifications': [],
              },
              id: sinon.match.string,
              type: 'certification-candidates',
            },
          ],
        });
      });
    });
  });
});
