// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, generateValidRequestAuthorizationHeader } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | certification-report-controller', function () {
  let server: $TSFixMe, certificationCourseId: $TSFixMe, userId: $TSFixMe, sessionId, certificationCenterId;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    userId = databaseBuilder.factory.buildUser().id;
    ({ id: sessionId, certificationCenterId } = databaseBuilder.factory.buildSession());
    databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
    certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      sessionId,
      isPublished: false,
      maxReachableLevelOnCertificationDate: 3,
    }).id;

    return databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-reports/{id}/certification-issue-reports', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('certification-issue-reports').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 HTTP status code', async function () {
      // given
      const request = {
        method: 'POST',
        url: `/api/certification-reports/${certificationCourseId}/certification-issue-reports`,
        payload: {
          data: {
            attributes: {
              category: 'FRAUD',
              description: 'Houston nous avons un problème',
            },
            relationships: {
              'certification-report': {
                data: {
                  type: 'certification-reports',
                  id: 'CertificationReport:103836',
                },
              },
            },
            type: 'certification-issue-reports',
          },
        },
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
      };
      await databaseBuilder.commit();

      // when
      const response = await server.inject(request);

      // then
      expect(response.statusCode).to.equal(201);
      expect(response.result.data.type).to.equal('certification-issue-reports');
      expect(response.result.data.attributes.category).to.equal('FRAUD');
      expect(response.result.data.attributes.description).to.equal('Houston nous avons un problème');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/certification-reports/${id}/abort', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code if certification course is updated', async function () {
      // given
      const options = {
        method: 'POST',
        url: `/api/certification-reports/${certificationCourseId}/abort`,
        payload: { data: { attributes: { 'abort-reason': 'technical' } } },
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
