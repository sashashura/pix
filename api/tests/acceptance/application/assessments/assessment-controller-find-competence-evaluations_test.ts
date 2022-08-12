// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | assessment-controller-find-competence-evaluations', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/assessments/:id/competence-evaluations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const assessmentId = databaseBuilder.factory.buildAssessment({ userId }).id;
      const competenceEvaluationId = databaseBuilder.factory.buildCompetenceEvaluation({ assessmentId, userId }).id;
      await databaseBuilder.commit();
      const options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}/competence-evaluations`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data[0].id).to.deep.equal(competenceEvaluationId.toString());
    });
  });
});
