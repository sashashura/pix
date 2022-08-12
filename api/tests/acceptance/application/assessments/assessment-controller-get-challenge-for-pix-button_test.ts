const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

const lastChallengeAnswer = 'last challenge answer';
const lastChallengeId = 'lastChallengeId';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const learningContent = [
  {
    id: 'recArea1',
    titleFrFr: 'area1_Title',
    color: 'someColor',
    competences: [
      {
        id: 'competenceId',
        nameFrFr: 'Mener une recherche et une veille d’information',
        index: '1.1',
        tubes: [
          {
            id: 'recTube0_0',
            skills: [
              {
                id: 'skillWeb2Id',
                nom: '@web2',
                challenges: [{ id: lastChallengeId, solution: lastChallengeAnswer, type: 'QROC', autoReply: false }],
              },
            ],
          },
        ],
      },
    ],
  },
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | assessment-controller-get-challenge-answer-for-pix-auto-answer', function () {
  let server: $TSFixMe;
  let options: $TSFixMe;
  let assessmentId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
    mockLearningContent(learningContentObjects);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/assessments/:id/challenge-for-pix-auto-answer', function () {
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const user = await insertUserWithRoleSuperAdmin();
      userId = user.id;
      assessmentId = databaseBuilder.factory.buildAssessment({
        state: Assessment.states.STARTED,
        type: Assessment.types.PREVIEW,
        lastChallengeId,
        userId,
      }).id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      return knex('assessments').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Nominal case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        options = {
          method: 'GET',
          url: `/api/assessments/${assessmentId}/challenge-for-pix-auto-answer`,
          headers: {
            authorization: `Bearer ${generateValidRequestAuthorizationHeader(userId)}`,
          },
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 HTTP status code', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return application/json; charset=utf-8', async function () {
        // when
        const response = await server.inject(options);

        // then
        const contentType = response.headers['content-type'];
        expect(contentType).to.contain('application/json; charset=utf-8');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return challengeForPixAutoAnswer', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.result).to.deep.equal({
          id: lastChallengeId,
          type: 'QROC',
          autoReply: false,
          solution: lastChallengeAnswer,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user does not have role Super Admin', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 403 HTTP status code', async function () {
        const userId = 456;
        options = {
          method: 'GET',
          url: `/api/assessments/${assessmentId}/challenge-for-pix-auto-answer`,
          headers: {
            authorization: `Bearer ${generateValidRequestAuthorizationHeader(userId)}`,
          },
        };

        const response = await server.inject(options);
        expect(response.statusCode).to.equal(403);
      });
    });
  });
});
