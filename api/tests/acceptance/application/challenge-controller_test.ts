// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
const { learningContentBuilder, expect, mockLearningContent } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | ChallengeController', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/challenges/:challenge_id', function () {
    const proposals =
      '- Ils sont bio.\n' +
      '- Ils pèsent plus de 63 grammes.\n' +
      '- Ce sont des oeufs frais.\n' +
      '- Ils sont destinés aux consommateurs.\n' +
      '- Ils ne sont pas lavés.\n';
    const instruction = 'Que peut-on dire des œufs de catégorie A ?\n';
    const challengeId = 'recLt9uwa2dR3IYpi';
    const challengeType = 'QCM';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const learningContent = [
        {
          id: 'recArea0',
          competences: [
            {
              id: 'recCompetence',
              titreFrFr: 'Mener une recherche et une veille d’information',
              index: '1.1',
              tubes: [
                {
                  id: 'recTube0_0',
                  skills: [
                    {
                      id: 'skillWeb1',
                      nom: '@skillWeb1',
                      challenges: [
                        {
                          id: challengeId,
                          type: challengeType,
                          instruction,
                          proposals,
                        },
                      ],
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
    });

    const options = {
      method: 'GET',
      url: `/api/challenges/${challengeId}`,
    };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 200 HTTP status code', function () {
      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return application/json', function () {
      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        const contentType = response.headers['content-type'];
        expect(contentType).to.contain('application/json');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the expected challenge', function () {
      // when
      const promise = server.inject(options);

      // then
      return promise.then((response: $TSFixMe) => {
        const challenge = response.result.data;
        expect(challenge.id).to.equal(challengeId);
        expect(challenge.attributes.instruction).to.equal(instruction);
        expect(challenge.attributes.proposals).to.equal(proposals);
        expect(challenge.attributes.type).to.equal(challengeType);
      });
    });
  });
});
