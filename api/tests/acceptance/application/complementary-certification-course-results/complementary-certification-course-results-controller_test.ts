const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Certifications', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/complementary-certification-course-results', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 HTTP status code', async function () {
      // given
      const server = await createServer();
      const badge = databaseBuilder.factory.buildBadge({
        key: Badge.keys.PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
      });
      databaseBuilder.factory.buildComplementaryCertification({
        id: 1,
        name: 'Pix+Edu',
      });
      databaseBuilder.factory.buildCertificationCourse({
        id: 456,
      });
      databaseBuilder.factory.buildComplementaryCertificationCourse({
        id: 1234,
        certificationCourseId: 456,
        complementaryCertificationId: 1,
      });

      databaseBuilder.factory.buildComplementaryCertificationCourseResult({
        complementaryCertificationCourseId: 1234,
        partnerKey: badge.key,
        source: ComplementaryCertificationCourseResult.sources.PIX,
      });

      await databaseBuilder.commit();

      const userId = (await insertUserWithRoleSuperAdmin()).id;
      const options = {
        method: 'POST',
        url: '/api/admin/complementary-certification-course-results',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        payload: {
          data: {
            attributes: {
              juryLevel: badge.key,
              complementaryCertificationCourseId: 1234,
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
