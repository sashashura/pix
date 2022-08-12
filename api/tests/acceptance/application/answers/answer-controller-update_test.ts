// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | answer-controller-update', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/answers/:id', function () {
    let server: $TSFixMe;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      server = await createServer();
      const userId = databaseBuilder.factory.buildUser().id;
      const assessment = databaseBuilder.factory.buildAssessment({ userId, type: 'COMPETENCE_EVALUATION' });
      const answer = databaseBuilder.factory.buildAnswer({
        assessmentId: assessment.id,
        value: '1.2',
        result: 'ok',
        challengeId: 'rec1',
      });
      await databaseBuilder.commit();
      options = {
        method: 'PATCH',
        url: '/api/answers/' + answer.id,
        payload: {},
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', function () {
      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(200);
      });
    });
  });
});
