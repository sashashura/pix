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

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceId = 'recCompetence';
const skillWeb1Id = 'recAcquisWeb1';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillWeb2I... Remove this comment to see the full error message
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
                challenges: [{ id: firstChallengeId, alpha: 2.8, delta: 1.1, langues: ['Franco Français'] }],
              },
              {
                id: skillWeb3Id,
                nom: '@web3',
                challenges: [{ id: secondChallengeId, langues: ['Franco Français'], alpha: -1.2, delta: 3.3 }],
              },
              {
                id: skillWeb1Id,
                nom: '@web1',
                challenges: [
                  { id: thirdChallengeId, alpha: -0.2, delta: 2.7, langues: ['Franco Français'] },
                  { id: otherChallengeId, alpha: -0.2, delta: -0.4, langues: ['Franco Français'] },
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
describe('Acceptance | API | assessment-controller-get-next-challenge-for-campaign-assessment', function () {
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
        const campaign = databaseBuilder.factory.buildCampaign({ assessmentMethod: 'FLASH' });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessment({
          id: assessmentId,
          type: Assessment.types.CAMPAIGN,
          userId,
          campaignParticipationId: campaignParticipation.id,
          lastQuestionDate: new Date('2020-01-20'),
          state: 'started',
          method: 'FLASH',
        });
        databaseBuilder.factory.buildCompetenceEvaluation({ assessmentId, competenceId, userId });
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
      it('should return a challenge', async function () {
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
        expect(response.result.data.id).to.equal(firstChallengeId);
      });
    });
  });
});
