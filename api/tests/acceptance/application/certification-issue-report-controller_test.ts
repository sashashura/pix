const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | certification-issue-report-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/certification-issue-reports/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      const server = await createServer();
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
      const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;
      const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ sessionId }).id;
      const certificationIssueReportId = databaseBuilder.factory.buildCertificationIssueReport({
        certificationCourseId,
      }).id;
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/certification-issue-reports/${certificationIssueReportId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
      });

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/certification-issue-reports/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve report and return 204 HTTP status code', async function () {
      // given
      const server = await createServer();
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;
      const certificationCourseId = databaseBuilder.factory.buildCertificationCourse({ sessionId }).id;
      const certificationIssueReportId = databaseBuilder.factory.buildCertificationIssueReport({
        certificationCourseId,
      }).id;
      await databaseBuilder.commit();

      const request = {
        method: 'PATCH',
        url: `/api/certification-issue-reports/${certificationIssueReportId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
        },
        payload: {
          data: {
            resolution: 'resolved',
          },
        },
      };

      // when
      const response = await server.inject(request);

      // then
      expect(response.statusCode).to.equal(204);
      const { resolution } = await knex
        .from('certification-issue-reports')
        .select('resolution')
        .where({ id: certificationIssueReportId })
        .first();
      expect(resolution).to.equal('resolved');
    });
  });
});
