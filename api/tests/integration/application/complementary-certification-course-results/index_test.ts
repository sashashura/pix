// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securityPr... Remove this comment to see the full error message
const securityPreHandlers = require('../../../../lib/application/security-pre-handlers');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/complementary-certification-course-results');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'complement... Remove this comment to see the full error message
const complementaryCertificationCourseResultsController = require('../../../../lib/application/complementary-certification-course-results/complementary-certification-course-results-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Application | Route | Certifications', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    sinon
      .stub(complementaryCertificationCourseResultsController, 'saveJuryComplementaryCertificationCourseResult')
      .callsFake((request: $TSFixMe, h: $TSFixMe) => h.response('ok').code(200));
    sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request: $TSFixMe, h: $TSFixMe) => h.response(true));

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/admin/complementary-certification-course-results', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should exist', async function () {
      // given
      const payload = {
        data: {
          attributes: {
            juryLevel: 'REJECTED',
            complementaryCertificationCourseId: 123456,
          },
        },
      };
      // when
      const response = await httpTestServer.request(
        'POST',
        '/api/admin/complementary-certification-course-results',
        payload
      );

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
