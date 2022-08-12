// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../../../lib/config');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | session-controller-get-session-results-to-download', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/sessions/download-all-results/{token}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a valid token is given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // given
        const server = await createServer();

        const dbf = databaseBuilder.factory;

        const session = dbf.buildSession({ date: '2020/01/01', time: '12:00' });
        const sessionId = session.id;

        const candidate1 = dbf.buildCertificationCandidate({
          sessionId,
          resultRecipientEmail: 'recipientEmail@example.net',
        });
        const candidate2 = dbf.buildCertificationCandidate({
          sessionId,
          resultRecipientEmail: 'recipientEmail@example.net',
        });

        const certif1 = dbf.buildCertificationCourse({
          sessionId: candidate1.sessionId,
          userId: candidate1.userId,
          lastName: candidate1.lastName,
          birthdate: candidate1.birthdate,
          createdAt: candidate1.createdAt,
        });
        const certif2 = dbf.buildCertificationCourse({
          sessionId: candidate2.sessionId,
          userId: candidate2.userId,
          lastName: candidate2.lastName,
          birthdate: candidate2.birthdate,
          createdAt: candidate2.createdAt,
        });

        const assessmentId1 = dbf.buildAssessment({ certificationCourseId: certif1.id }).id;
        dbf.buildAssessment({ certificationCourseId: certif2.id });

        dbf.buildAssessmentResult({ assessmentId: assessmentId1, createdAt: new Date('2018-04-15T00:00:00Z') });

        const token = jsonwebtoken.sign(
          {
            session_id: sessionId,
          },
          settings.authentication.secret,
          { expiresIn: '30d' }
        );

        const request = {
          method: 'GET',
          url: `/api/sessions/download-all-results/${token}`,
          payload: {},
        };

        await databaseBuilder.commit();

        // when
        const response = await server.inject(request);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
