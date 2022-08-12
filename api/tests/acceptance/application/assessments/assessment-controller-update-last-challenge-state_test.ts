const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceId = 'recCompetence';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillWeb2I... Remove this comment to see the full error message
const skillWeb2Id = 'recAcquisWeb2';

const nonFocusedChallengeId = 'recFirstChallengeId';
const focusedChallengeId = 'recSecondChallengeId';
const anotherChallengeId = 'anotherChallengeId';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const learningContent = [
  {
    id: 'recArea1',
    titleFrFr: 'area1_Title',
    color: 'someColor',
    competences: [
      {
        id: competenceId,
        nameFrFr: 'Mener une recherche et une veille d’information',
        index: '1.1',
        tubes: [
          {
            id: 'recTube0_0',
            skills: [
              {
                id: skillWeb2Id,
                nom: '@web2',
                challenges: [
                  { id: nonFocusedChallengeId, alpha: 2.8, delta: 1.1, focusable: false, langues: ['Franco Français'] },
                  { id: focusedChallengeId, alpha: 2.8, delta: 1.1, focusable: true, langues: ['Franco Français'] },
                  { id: anotherChallengeId },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | assessment-controller-update-last-challenge-state', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
    mockLearningContent(learningContentObjects);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/assessments/{id}/last-challenge-state/{state}', function () {
    const assessmentId = 1;
    const userId = 1234;
    let user;
    let assessment: $TSFixMe;
    let newState;
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Resource access management', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        server = await createServer();

        user = databaseBuilder.factory.buildUser();
        assessment = databaseBuilder.factory.buildAssessment({
          lastQuestionState: Assessment.statesOfLastQuestion.ASKED,
          userId: user.id,
        });
        newState = 'timeout';
        options = {
          method: 'PATCH',
          url: `/api/assessments/${assessment.id}/last-challenge-state/${newState}`,
          headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        };

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 if requested user is not the same as the user of the assessment', async function () {
        // given
        const otherUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);
        options.payload = {};

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 400 when the state is not correct', async function () {
        // given
        options.url = `/api/assessments/${assessment.id}/last-challenge-state/truc`;

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment lastQuestionState is not FOCUSEDOUT', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When current challenge is focused', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          databaseBuilder.factory.buildUser({ id: userId });
          databaseBuilder.factory.buildAssessment({
            id: assessmentId,
            userId,
            lastQuestionDate: new Date('2020-01-20'),
            lastQuestionState: Assessment.statesOfLastQuestion.ASKED,
            lastChallengeId: focusedChallengeId,
            state: 'started',
          });
          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should update assessment lastQuestionState if there is no payload', async function () {
          // given
          const state = 'focusedout';
          const options = {
            method: 'PATCH',
            url: `/api/assessments/${assessmentId}/last-challenge-state/${state}`,
            headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
            payload: {},
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
          const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('lastQuestionState');
          expect(assessmentsInDb.lastQuestionState).to.deep.equal(Assessment.statesOfLastQuestion.FOCUSEDOUT);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should update assessment lastQuestionState', async function () {
          // given
          const state = 'focusedout';
          const payload = {
            data: {
              attributes: {
                'challenge-id': focusedChallengeId,
              },
            },
          };
          const options = {
            method: 'PATCH',
            url: `/api/assessments/${assessmentId}/last-challenge-state/${state}`,
            headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
            payload,
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
          const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('lastQuestionState');
          expect(assessmentsInDb.lastQuestionState).to.deep.equal(Assessment.statesOfLastQuestion.FOCUSEDOUT);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When current challenge is not focused', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          databaseBuilder.factory.buildUser({ id: userId });
          databaseBuilder.factory.buildAssessment({
            id: assessmentId,
            userId,
            lastQuestionDate: new Date('2020-01-20'),
            lastQuestionState: Assessment.statesOfLastQuestion.ASKED,
            lastChallengeId: nonFocusedChallengeId,
            state: 'started',
          });
          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update assessment lastQuestionState', async function () {
          // given
          const state = 'focusedout';
          const payload = {
            data: {
              attributes: {
                'challenge-id': nonFocusedChallengeId,
              },
            },
          };
          const options = {
            method: 'PATCH',
            url: `/api/assessments/${assessmentId}/last-challenge-state/${state}`,
            headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
            payload,
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
          const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('lastQuestionState');
          expect(assessmentsInDb.lastQuestionState).to.deep.equal(Assessment.statesOfLastQuestion.ASKED);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When current challengeId is not the lastChallengeId', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          databaseBuilder.factory.buildUser({ id: userId });
          databaseBuilder.factory.buildAssessment({
            id: assessmentId,
            userId,
            lastQuestionDate: new Date('2020-01-20'),
            lastQuestionState: Assessment.statesOfLastQuestion.ASKED,
            lastChallengeId: nonFocusedChallengeId,
            state: 'started',
          });
          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not update assessment lastQuestionState', async function () {
          // given
          const state = 'focusedout';
          const payload = {
            data: {
              attributes: {
                'challenge-id': anotherChallengeId,
              },
            },
          };
          const options = {
            method: 'PATCH',
            url: `/api/assessments/${assessmentId}/last-challenge-state/${state}`,
            headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
            payload,
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(204);
          const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('lastQuestionState');
          expect(assessmentsInDb.lastQuestionState).to.deep.equal(Assessment.statesOfLastQuestion.ASKED);
        });
      });
    });
  });
});
