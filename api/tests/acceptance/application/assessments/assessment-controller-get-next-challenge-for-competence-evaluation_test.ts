// @ts-expect-error TS(6200): Definitions of the following identifiers conflict ... Remove this comment to see the full error message
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
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');

const competenceId = 'recCompetence';
const skillWeb1Id = 'recAcquisWeb1';
const skillWeb2Id = 'recAcquisWeb2';
const skillWeb3Id = 'recAcquisWeb3';

const firstChallengeId = 'recFirstChallenge';
const secondChallengeId = 'recSecondChallenge';
const thirdChallengeId = 'recThirdChallenge';
const otherChallengeId = 'recOtherChallenge';

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
                challenges: [{ id: firstChallengeId }],
              },
              {
                id: skillWeb3Id,
                nom: '@web3',
                challenges: [{ id: secondChallengeId, langues: ['Franco Français'] }],
              },
              {
                id: skillWeb1Id,
                nom: '@web1',
                challenges: [{ id: thirdChallengeId }, { id: otherChallengeId }],
              },
            ],
          },
        ],
      },
    ],
  },
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | assessment-controller-get-next-challenge-for-competence-evaluation', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
    mockLearningContent(learningContentObjects);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/assessments/:assessment_id/next', function () {
    const assessmentId = 1;
    const userId = 1234;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is still challenges to answer', function () {
      let clock: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildUser({ id: userId });
        databaseBuilder.factory.buildAssessment({
          id: assessmentId,
          type: Assessment.types.COMPETENCE_EVALUATION,
          userId,
          competenceId,
          lastQuestionDate: new Date('2020-01-20'),
          state: 'started',
        });
        const { id: answerId } = databaseBuilder.factory.buildAnswer({
          challengeId: firstChallengeId,
          assessmentId,
          value: 'any good answer',
          result: 'ok',
        });
        databaseBuilder.factory.buildCompetenceEvaluation({ assessmentId, competenceId, userId });
        databaseBuilder.factory.buildKnowledgeElement({
          status: KnowledgeElement.StatusType.VALIDATED,
          skillId: skillWeb2Id,
          assessmentId,
          answerId,
          userId,
          competenceId,
        });
        await databaseBuilder.commit();

        clock = sinon.useFakeTimers({
          now: Date.now(),
          toFake: ['Date'],
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(async function () {
        clock.restore();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the second challenge if the first answer is correct', async function () {
        // given
        const options = {
          method: 'GET',
          url: `/api/assessments/${assessmentId}/next`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };

        const lastQuestionDate = new Date();

        // when
        const response = await server.inject(options);

        // then
        const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('lastQuestionDate');
        expect(assessmentsInDb.lastQuestionDate).to.deep.equal(lastQuestionDate);
        expect(response.result.data.id).to.equal(secondChallengeId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save the asked challenge', async function () {
        // given
        const options = {
          method: 'GET',
          url: `/api/assessments/${assessmentId}/next`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };

        // when
        const response = await server.inject(options);

        // then
        const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('lastChallengeId');
        expect(assessmentsInDb.lastChallengeId).to.deep.equal(secondChallengeId);
        expect(response.result.data.id).to.equal(secondChallengeId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is no more challenges to answer', function () {
      const lastChallengeId = 'lastChallengeId';
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildUser({ id: userId });
        databaseBuilder.factory.buildAssessment({
          id: assessmentId,
          type: Assessment.types.COMPETENCE_EVALUATION,
          userId,
          competenceId,
          lastChallengeId,
        });
        const { id: answerId1 } = databaseBuilder.factory.buildAnswer({
          challengeId: firstChallengeId,
          assessmentId,
          value: 'any good answer',
          result: 'ok',
        });
        const { id: answerId2 } = databaseBuilder.factory.buildAnswer({
          challengeId: secondChallengeId,
          assessmentId,
          value: 'any bad answer',
          result: 'ko',
        });
        databaseBuilder.factory.buildCompetenceEvaluation({ assessmentId, competenceId, userId });
        databaseBuilder.factory.buildKnowledgeElement({
          status: KnowledgeElement.StatusType.VALIDATED,
          skillId: skillWeb2Id,
          assessmentId,
          answerId1,
          userId,
          competenceId,
        });
        databaseBuilder.factory.buildKnowledgeElement({
          source: KnowledgeElement.SourceType.INFERRED,
          status: KnowledgeElement.StatusType.VALIDATED,
          skillId: skillWeb1Id,
          assessmentId,
          answerId1,
          userId,
          competenceId,
        });
        databaseBuilder.factory.buildKnowledgeElement({
          status: KnowledgeElement.StatusType.INVALIDATED,
          skillId: skillWeb3Id,
          assessmentId,
          answerId2,
          userId,
          competenceId,
        });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should finish the test if there is no next challenge', async function () {
        // given
        const options = {
          method: 'GET',
          url: `/api/assessments/${assessmentId}/next`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: null,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not save a null challenge for the lastChallengeId', async function () {
        // given
        const options = {
          method: 'GET',
          url: `/api/assessments/${assessmentId}/next`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        };

        // when
        await server.inject(options);

        // then
        const assessmentsInDb = await knex('assessments').where('id', assessmentId).first('lastChallengeId');
        expect(assessmentsInDb.lastChallengeId).to.deep.equal(lastChallengeId);
      });
    });
  });
});
