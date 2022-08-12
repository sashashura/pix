const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-get-user-profile-for-admin', function () {
  let options: $TSFixMe;
  let server: $TSFixMe;
  let userId: $TSFixMe;

  const skillWeb1Id = 'recAcquisWeb1';
  const skillWeb1Name = '@web1';

  const competenceId = 'recCompetence';

  const area = {
    id: 'recvoGdo7z2z7pXWa',
    titleFrFr: 'Information et données',
    color: 'jaffa',
    code: '1',
    competenceIds: [competenceId],
  };

  const competence = {
    id: competenceId,
    nameFrFr: 'Mener une recherche et une veille d’information',
    descriptionFrFr: 'Une description',
    index: '1.1',
    origin: 'Pix',
    areaId: 'recvoGdo7z2z7pXWa',
  };

  const learningContent = {
    areas: [area],
    competences: [competence],
    skills: [
      {
        id: skillWeb1Id,
        name: skillWeb1Name,
        status: 'actif',
        competenceId: competenceId,
      },
    ],
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser({}).id;
    await databaseBuilder.commit();
    options = {
      method: 'GET',
      url: `/api/admin/users/${userId}/profile`,
      payload: {},
      headers: {},
    };
    server = await createServer();
  });

  let knowledgeElement: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /admin/users/:id/profile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Ressource access management', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - unauthorized access - if user is not authenticated', async function () {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 403 - forbidden access - if requested user is not admin', async function () {
        // given
        options.headers.authorization = generateValidRequestAuthorizationHeader(userId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const superAdmin = await insertUserWithRoleSuperAdmin();
        options.headers.authorization = generateValidRequestAuthorizationHeader(superAdmin.id);

        mockLearningContent(learningContent);

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
      it('should return 200', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should return user's serialized scorecards", async function () {
        // when
        const response = await server.inject(options);

        const expectedScorecardJSONApi = {
          data: {
            id: userId.toString(),
            type: 'Profiles',
            attributes: {
              'pix-score': knowledgeElement.earnedPix,
            },
            relationships: {
              scorecards: {
                data: [
                  {
                    id: `${userId}_${competenceId}`,
                    type: 'scorecards',
                  },
                ],
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
            {
              attributes: {
                name: competence.nameFrFr,
                description: competence.descriptionFrFr,
                index: competence.index,
                'competence-id': competenceId,
                'earned-pix': knowledgeElement.earnedPix,
                level: Math.round(knowledgeElement.earnedPix / 8),
                'pix-score-ahead-of-next-level': knowledgeElement.earnedPix,
                status: 'STARTED',
                'remaining-days-before-reset': 0,
                'remaining-days-before-improving': 0,
              },
              id: `${userId}_${competenceId}`,
              type: 'scorecards',
              relationships: {
                area: {
                  data: {
                    id: area.id,
                    type: 'areas',
                  },
                },
              },
            },
          ],
        };

        // then
        expect(response.result.data).to.deep.equal(expectedScorecardJSONApi.data);
        expect(response.result.included).to.deep.equal(expectedScorecardJSONApi.included);
      });
    });
  });
});
