const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceId = 'recCompetence';
const frenchSpokenChallengeId = 'recFrenchSpokenChallengeId';
const frenchChallengeId = 'recFrenchChallengeId';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const learningContent = [
  {
    id: 'recArea0',
    competences: [
      {
        id: competenceId,
        titreFrFr: 'Mener une recherche et une veille d’information',
        index: '1.1',
        tubes: [
          {
            id: 'recTube0_0',
            skills: [
              {
                id: 'skillWeb1',
                nom: '@skillWeb1',
                challenges: [],
              },
              {
                id: 'skillWeb2',
                nom: '@skillWeb2',
                challenges: [
                  { id: frenchChallengeId, langues: ['Franco Français'] },
                  { id: frenchSpokenChallengeId, langues: ['Francophone'] },
                ],
              },
              {
                id: 'skillWeb3',
                nom: '@skillWeb3',
                challenges: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | assessment-controller-get-next-challenge-locale-management', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/assessments/:assessment_id/next', function () {
    const assessmentId = 1;
    const userId = 1234;
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is a competence evaluation', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is one challenge in the accepted language (fr-fr)', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
          mockLearningContent(learningContentObjects);

          databaseBuilder.factory.buildUser({ id: userId });
          databaseBuilder.factory.buildAssessment({
            id: assessmentId,
            type: Assessment.types.COMPETENCE_EVALUATION,
            userId,
            competenceId,
          });
          databaseBuilder.factory.buildCompetenceEvaluation({ assessmentId, competenceId, userId });
          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the challenge in the accepted language (fr-fr)', function () {
          // given
          const options = {
            method: 'GET',
            url: `/api/assessments/${assessmentId}/next`,
            headers: {
              authorization: generateValidRequestAuthorizationHeader(userId),
              'accept-language': FRENCH_FRANCE,
            },
          };

          // when
          const promise = server.inject(options);

          // then
          return promise.then((response: $TSFixMe) => {
            expect(response.result.data.id).to.equal(frenchChallengeId);
          });
        });
      });
    });
  });
});
