const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_SPO... Remove this comment to see the full error message
const { FRENCH_SPOKEN } = require('../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | scorecard-controller', function () {
  let options: $TSFixMe;
  let server: $TSFixMe;
  const userId = 42;

  const competenceId = 'recCompetence';
  const skillWeb1Id = 'recAcquisWeb1';
  const skillWeb1Name = '@web1';
  const tutorialWebId = 'recTutorial1';

  const competence = {
    id: competenceId,
    nameFrFr: 'Mener une recherche et une veille d’information',
    index: '1.1',
    origin: 'Pix',
    areaId: 'recvoGdo7z2z7pXWa',
  };

  const area = {
    id: 'recvoGdo7z2z7pXWa',
    titleFrFr: 'Information et données',
    color: 'jaffa',
    code: '1',
    competenceIds: [competenceId],
  };

  const learningContent = {
    areas: [area],
    competences: [competence],
    tubes: [
      {
        id: 'recArea1_Competence1_Tube1',
        name: '@web',
        practicalDescriptionFrFr: 'Ceci est une description pratique',
        practicalTitleFrFr: 'Ceci est un titre pratique',
        competenceId: competenceId,
      },
    ],
    skills: [
      {
        id: skillWeb1Id,
        name: skillWeb1Name,
        status: 'actif',
        competenceId: competenceId,
        tutorialIds: ['recTutorial0', tutorialWebId, 'recTutorial2'],
      },
    ],
    tutorials: [
      {
        id: 'recTutorial0',
        locale: 'en-us',
        duration: '00:00:54',
        format: 'video',
        link: 'https://tuto.com',
        source: 'tuto.com',
        title: 'tuto1',
      },
      {
        id: tutorialWebId,
        locale: 'fr-fr',
        duration: '00:03:31',
        format: 'vidéo',
        link: 'http://www.example.com/this-is-an-example.html',
        source: 'Source Example, Example',
        title: 'Communiquer',
      },
      {
        id: 'recTutorial2',
        locale: 'fr-fr',
        duration: '00:03:31',
        format: 'vidéo',
        link: 'http://www.example.com/this-is-an-example.html',
        source: 'Source Example, Example',
        title: 'Communiquer',
      },
    ],
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    databaseBuilder.factory.buildUser({ id: userId });
    await databaseBuilder.commit();
    mockLearningContent(learningContent);
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('knowledge-elements').delete();
    await knex('answers').delete();
    await knex('competence-evaluations').delete();
    await knex('assessments').delete();
    return knex('campaign-participations').delete();
  });

  let knowledgeElement: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /scorecards/{id}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      options = {
        method: 'GET',
        url: `/api/scorecards/${userId}_${competenceId}`,
        payload: {},
        headers: {},
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(401);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        options.headers.authorization = generateValidRequestAuthorizationHeader(userId);

        knowledgeElement = databaseBuilder.factory.buildKnowledgeElement({
          userId,
          competenceId: competenceId,
        });

        const assessmentId = databaseBuilder.factory.buildAssessment({ state: 'started' }).id;
        databaseBuilder.factory.buildCompetenceEvaluation({
          userId,
          assessmentId,
          competenceId: competenceId,
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200', function () {
        // when
        const promise = server.inject(options);

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.statusCode).to.equal(200);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should return user's serialized scorecards", function () {
        // when
        const promise = server.inject(options);

        const expectedScorecardJSONApi = {
    data: {
        type: 'scorecards',
        id: `${userId}_${competenceId}`,
        attributes: {
            name: competence.nameFrFr,
            description: (competence as $TSFixMe).descriptionFrFr,
            'competence-id': competenceId,
            index: competence.index,
            'earned-pix': knowledgeElement.earnedPix,
            level: Math.round(knowledgeElement.earnedPix / 8),
            'pix-score-ahead-of-next-level': knowledgeElement.earnedPix,
            status: 'STARTED',
            'remaining-days-before-reset': 0,
            'remaining-days-before-improving': 0,
        },
        relationships: {
            area: {
                data: {
                    id: area.id,
                    type: 'areas',
                },
            },
            tutorials: {
                links: {
                    related: `/api/scorecards/${userId}_${competenceId}/tutorials`,
                },
            },
        },
    },
    included: [
        {
            attributes: {
                code: area.code,
                title: area.titleFrFr,
                color: area.color,
            },
            id: area.id,
            type: 'areas',
        },
    ],
};

        // then
        return promise.then((response: $TSFixMe) => {
          expect(response.result.data).to.deep.equal(expectedScorecardJSONApi.data);
          expect(response.result.included).to.deep.equal(expectedScorecardJSONApi.included);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /scorecards/{id}/tutorials', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      options = {
        method: 'GET',
        url: `/api/scorecards/${userId}_${competenceId}/tutorials`,
        payload: {},
        headers: {},
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Resource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Success case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildUserSavedTutorial({ id: 10500, userId, tutorialId: tutorialWebId });
        await databaseBuilder.commit();

        options.headers = {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        };

        knowledgeElement = databaseBuilder.factory.buildKnowledgeElement({
          userId,
          competenceId: competence.id,
          status: KnowledgeElement.StatusType.INVALIDATED,
          skillId: skillWeb1Id,
          createdAt: new Date('2018-01-01'),
        });

        const assessmentId = databaseBuilder.factory.buildAssessment({ state: 'started' }).id;
        databaseBuilder.factory.buildCompetenceEvaluation({
          userId,
          assessmentId,
          competenceId: competence.id,
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200', async function () {
        // given

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should return user's serialized tutorials", async function () {
        // given
        const expectedTutorialsJSONApi = {
          data: [
            {
              type: 'tutorials',
              id: 'recTutorial1',
              attributes: {
                duration: '00:03:31',
                format: 'vidéo',
                link: 'http://www.example.com/this-is-an-example.html',
                source: 'Source Example, Example',
                title: 'Communiquer',
                'tube-name': '@web',
                'tube-practical-description': 'Ceci est une description pratique',
                'tube-practical-title': 'Ceci est un titre pratique',
                'skill-id': 'recAcquisWeb1',
              },
              relationships: {
                'tutorial-evaluation': {
                  data: null,
                },
                'user-tutorial': {
                  data: {
                    id: '10500',
                    type: 'user-tutorial',
                  },
                },
              },
            },
            {
              type: 'tutorials',
              id: 'recTutorial2',
              attributes: {
                duration: '00:03:31',
                format: 'vidéo',
                link: 'http://www.example.com/this-is-an-example.html',
                source: 'Source Example, Example',
                title: 'Communiquer',
                'tube-name': '@web',
                'tube-practical-description': 'Ceci est une description pratique',
                'tube-practical-title': 'Ceci est un titre pratique',
                'skill-id': 'recAcquisWeb1',
              },
              relationships: {
                'tutorial-evaluation': {
                  data: null,
                },
                'user-tutorial': {
                  data: null,
                },
              },
            },
          ],
          included: [
            {
              attributes: {
                id: 10500,
                'tutorial-id': 'recTutorial1',
                'user-id': 42,
              },
              id: '10500',
              type: 'user-tutorial',
            },
          ],
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.result.data).to.deep.equal(expectedTutorialsJSONApi.data);
        expect(response.result.included).to.deep.equal(expectedTutorialsJSONApi.included);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when user resets competence', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          const options = {
            method: 'POST',
            url: `/api/users/${userId}/competences/${competenceId}/reset`,
            payload: {},
            headers: {
              authorization: generateValidRequestAuthorizationHeader(userId),
            },
          };

          await server.inject(options);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return an empty tutorial list', async function () {
          // given
          const expectedTutorialsJSONApi = {
            data: [],
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.result.data).to.deep.equal(expectedTutorialsJSONApi.data);
          expect(response.result.included).to.deep.equal((expectedTutorialsJSONApi as $TSFixMe).included);
        });
      });
    });
  });
});
