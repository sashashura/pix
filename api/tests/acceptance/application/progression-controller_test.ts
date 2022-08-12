const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Progressions', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/progressions/:id', function () {
    let assessmentId: $TSFixMe;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const learningContent = [
        {
          id: 'recArea1',
          competences: [
            {
              id: 'recCompetence1',
              tubes: [
                {
                  id: 'recTube1',
                  skills: [
                    {
                      id: 'recSkill1',
                      challenges: ['recChallenge1'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);

      userId = databaseBuilder.factory.buildUser({}).id;
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId });
      const campaignId = databaseBuilder.factory.buildCampaign({
        name: 'Campaign',
        targetProfileId,
      }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
      assessmentId = databaseBuilder.factory.buildAssessment({
        userId: userId,
        type: 'CAMPAIGN',
        state: 'completed',
        campaignParticipationId,
      }).id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('without authorization token', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 401 HTTP status code', function () {
        // given
        const progressionId = assessmentId;
        const options = {
          method: 'GET',
          url: `/api/progressions/${progressionId}`,
          headers: {
            authorization: 'invalid.access.token',
          },
        };

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(401);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('with authorization token', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the assessment does not exists', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 404', function () {
          // given
          const progressionId = assessmentId + 1;
          const options = {
            method: 'GET',
            url: `/api/progressions/${progressionId}`,
            headers: {
              authorization: generateValidRequestAuthorizationHeader(userId),
            },
          };

          // when
          const promise = server.inject(options);

          // then
          return promise.then((response: $TSFixMe) => {
            expect(response.statusCode).to.equal(404);
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('allowed to access the progression', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should respond with a 200', function () {
          // given
          const progressionId = assessmentId;
          const options = {
            method: 'GET',
            url: `/api/progressions/${progressionId}`,
            headers: {
              authorization: generateValidRequestAuthorizationHeader(userId),
            },
          };

          // when
          const promise = server.inject(options);

          // then
          return promise.then((response: $TSFixMe) => {
            expect(response.statusCode).to.equal(200);
          });
        });
      });
    });
  });
});
