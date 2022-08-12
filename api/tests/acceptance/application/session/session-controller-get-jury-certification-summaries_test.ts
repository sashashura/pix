// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
const { CLEA } = require('../../../../lib/domain/models/ComplementaryCertification');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-get-jury-certification-summaries', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/sessions/{id}/jury-certification-summaries', function () {
    let sessionId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sessionId = databaseBuilder.factory.buildSession().id;

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has not the role Super Admin', function () {
      let userId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userId = databaseBuilder.factory.buildUser().id;
        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 403 HTTP status code', async function () {
        // when
        const response = await server.inject({
          method: 'GET',
          url: `/api/admin/sessions/${sessionId}/jury-certification-summaries`,
          payload: {},
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has role Super Admin', function () {
      let superAdminId;
      let certif1: $TSFixMe;
      let certif2: $TSFixMe;
      let asr1;
      let expectedJuryCertifSumm1: $TSFixMe;
      let expectedJuryCertifSumm2: $TSFixMe;
      let request: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const dbf = databaseBuilder.factory;
        superAdminId = dbf.buildUser.withRole().id;
        sessionId = dbf.buildSession().id;
        const badge = dbf.buildBadge({ key: Badge.keys.PIX_EMPLOI_CLEA_V3 });

        certif1 = dbf.buildCertificationCourse({ sessionId, lastName: 'AAA' });
        const { id } = dbf.buildComplementaryCertificationCourse({ certificationCourseId: certif1.id, name: CLEA });
        dbf.buildComplementaryCertificationCourseResult({
          complementaryCertificationCourseId: id,
          partnerKey: badge.key,
          acquired: true,
        });
        const assessmentId1 = dbf.buildAssessment({ certificationCourseId: certif1.id }).id;
        asr1 = dbf.buildAssessmentResult({ assessmentId: assessmentId1, createdAt: new Date('2018-04-15T00:00:00Z') });

        certif2 = dbf.buildCertificationCourse({ sessionId, lastName: 'CCC' });
        dbf.buildAssessment({ certificationCourseId: certif2.id });

        expectedJuryCertifSumm1 = {
          'first-name': certif1.firstName,
          'last-name': certif1.lastName,
          status: asr1.status,
          'pix-score': asr1.pixScore,
          'is-published': certif1.isPublished,
          'created-at': certif1.createdAt,
          'completed-at': certif1.completedAt,
          'number-of-certification-issue-reports': 0,
          'number-of-certification-issue-reports-with-required-action': 0,
          'complementary-certification-taken-labels': ['CléA Numérique'],
          'examiner-comment': undefined,
          'has-seen-end-test-screen': certif1.hasSeenEndTestScreen,
          'is-flagged-aborted': false,
        };
        expectedJuryCertifSumm2 = {
          'first-name': certif2.firstName,
          'last-name': certif2.lastName,
          status: 'started',
          'pix-score': null,
          'is-published': certif2.isPublished,
          'created-at': certif2.createdAt,
          'number-of-certification-issue-reports': 0,
          'number-of-certification-issue-reports-with-required-action': 0,
          'complementary-certification-taken-labels': [],
          'completed-at': certif2.completedAt,
          'examiner-comment': undefined,
          'has-seen-end-test-screen': certif2.hasSeenEndTestScreen,
          'is-flagged-aborted': false,
        };

        request = {
          method: 'GET',
          url: `/api/admin/sessions/${sessionId}/jury-certification-summaries`,
          payload: {},
          headers: { authorization: generateValidRequestAuthorizationHeader(superAdminId) },
        };

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(request);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the expected data', async function () {
        // when
        const response = await server.inject(request);

        // then
        expect(response.result.data[0].attributes).to.deep.equal(expectedJuryCertifSumm1);
        expect(response.result.data[0].id).to.deep.equal(certif1.id.toString());
        expect(response.result.data[1].attributes).to.deep.equal(expectedJuryCertifSumm2);
        expect(response.result.data[1].id).to.deep.equal(certif2.id.toString());
      });
    });
  });
});
