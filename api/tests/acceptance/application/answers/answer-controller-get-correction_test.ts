const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | answer-controller-get-correction', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/answers/{id}/correction', function () {
    let assessment = null;
    let answer: $TSFixMe = null;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      assessment = databaseBuilder.factory.buildAssessment({
        courseId: 'adaptive_course_id',
        state: 'completed',
        userId,
      });

      answer = databaseBuilder.factory.buildAnswer({
        value: 'any good answer',
        result: 'ok',
        challengeId: 'q_first_challenge',
        assessmentId: assessment.id,
      });

      await databaseBuilder.commit();

      const learningContent = {
        challenges: [
          {
            id: 'q_first_challenge',
            status: 'validé',
            competenceId: 'competence_id',
            solution: 'fromage',
            solutionToDisplay: 'camembert',
            skillId: 'q_first_acquis',
          },
        ],
        tutorials: [
          {
            id: 'english-tutorial-id',
            locale: 'en-us',
            duration: '00:00:54',
            format: 'video',
            link: 'https://tuto.com',
            source: 'tuto.com',
            title: 'tuto1',
          },
          {
            id: 'french-tutorial-id',
            locale: 'fr-fr',
            duration: '00:03:31',
            format: 'vidéo',
            link: 'http://www.example.com/this-is-an-example.html',
            source: 'Source Example, Example',
            title: 'Communiquer',
          },
        ],
        skills: [
          {
            id: 'q_first_acquis',
            name: '@web3',
            hintFrFr: 'Geolocaliser ?',
            hintEnUs: 'Geolocate ?',
            hintStatus: 'Validé',
            competenceId: 'recABCD',
            tutorialIds: ['english-tutorial-id', 'french-tutorial-id'],
            learningMoreTutorialIds: [],
          },
        ],
      };
      mockLearningContent(learningContent);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when Accept-Language header is specified', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the answer correction with tutorials restricted to given language', async function () {
        // given
        const options = {
          method: 'GET',
          url: `/api/answers/${answer.id}/correction`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
            'accept-language': FRENCH_FRANCE,
          },
        };

        const expectedBody = {
          data: {
            id: 'q_first_challenge',
            type: 'corrections',
            attributes: {
              solution: 'fromage',
              'solution-to-display': 'camembert',
              hint: 'Geolocaliser ?',
            },
            relationships: {
              tutorials: {
                data: [
                  {
                    id: 'french-tutorial-id',
                    type: 'tutorials',
                  },
                ],
              },
              'learning-more-tutorials': {
                data: [],
              },
            },
          },
          included: [
            {
              attributes: {
                duration: '00:03:31',
                format: 'vidéo',
                id: 'french-tutorial-id',
                link: 'http://www.example.com/this-is-an-example.html',
                'skill-id': 'q_first_acquis',
                source: 'Source Example, Example',
                title: 'Communiquer',
              },
              id: 'french-tutorial-id',
              type: 'tutorials',
            },
          ],
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedBody);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 when user does not have access to this answer', async function () {
      // given
      const options = {
        method: 'GET',
        url: `/api/answers/${answer.id}/correction`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId + 3) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(404);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 when the answer id provided is not an integer', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/answers/1/correction',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(404);
    });
  });
});
