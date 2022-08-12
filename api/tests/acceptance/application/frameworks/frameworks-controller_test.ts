const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | frameworks-controller', function () {
  let server: $TSFixMe;

  const learningContent = {
    frameworks: [
      {
        id: 'pix123',
        name: 'Pix',
      },
    ],
    areas: [
      {
        id: 'areaId',
        code: 1,
        titleFrFr: 'Area fr',
        color: 'some color',
        competenceIds: ['competenceId'],
        frameworkId: 'pix123',
      },
    ],
    competences: [
      {
        id: 'competenceId',
        nameFrFr: 'Competence name',
        nameEnUs: 'test',
        areaId: 'areaId',
        index: 0,
        origin: 'Pix',
        thematicIds: ['thematic1'],
      },
    ],
    thematics: [
      {
        id: 'thematic1',
        name: 'Test',
        index: 0,
        tubeIds: ['tubeId'],
        competenceId: 'competenceId',
      },
    ],
    tubes: [
      {
        id: 'tubeId',
        name: '@tube',
        description: 'Description tube',
        practicalTitleFrFr: 'Titre pratique',
        practicalDescriptionFrFr: 'description pratique',
        competenceId: 'competenceId',
      },
    ],
    skills: [
      {
        id: 'skillId',
        status: 'actif',
        tubeId: 'tubeId',
      },
    ],
    challenges: [
      {
        id: 'challengeId',
        skillId: 'skillId',
      },
    ],
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/frameworks/pix/areas', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('User is authenticated', function () {
      let userId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        userId = databaseBuilder.factory.buildUser().id;
        const organization = databaseBuilder.factory.buildOrganization();

        databaseBuilder.factory.buildMembership({ userId, organizationId: organization.id });

        await databaseBuilder.commit();
        mockLearningContent(learningContent);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return response code 200', async function () {
        // given
        const options = {
          method: 'GET',
          url: `/api/frameworks/pix/areas`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
          },
        };

        const expectedResult = {
          data: [
            {
              id: 'areaId',
              type: 'areas',
              attributes: {
                code: 1,
                title: 'Area fr',
                color: 'some color',
              },
              relationships: {
                competences: {
                  data: [
                    {
                      id: 'competenceId',
                      type: 'competences',
                    },
                  ],
                },
              },
            },
          ],
          included: [
            {
              id: 'tubeId',
              type: 'tubes',
              attributes: {
                name: '@tube',
                'practical-title': 'Titre pratique',
                'practical-description': 'description pratique',
                mobile: false,
                tablet: false,
              },
              relationships: {
                skills: {
                  links: {
                    related: '/api/admin/tubes/tubeId/skills',
                  },
                },
              },
            },

            {
              type: 'thematics',
              id: 'thematic1',
              attributes: {
                name: 'Test',
                index: 0,
              },
              relationships: {
                tubes: {
                  data: [
                    {
                      id: 'tubeId',
                      type: 'tubes',
                    },
                  ],
                },
              },
            },
            {
              id: 'competenceId',
              type: 'competences',
              attributes: {
                name: 'Competence name',
                index: 0,
              },
              relationships: {
                thematics: {
                  data: [
                    {
                      id: 'thematic1',
                      type: 'thematics',
                    },
                  ],
                },
              },
            },
          ],
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedResult);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('User is not authenticated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return response code 401', async function () {
        // given
        const options = {
          method: 'GET',
          url: `/api/frameworks/pix/areas`,
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
