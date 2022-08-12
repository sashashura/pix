const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../../lib/domain/models/TutorialEvaluation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | tutorial-evaluations-controller', function () {
  let server: $TSFixMe;

  const learningContent = {
    tutorials: [
      {
        id: 'tutorialId',
        locale: 'en-us',
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
    await databaseBuilder.factory.buildUser({
      id: 4444,
      firstName: 'Classic',
      lastName: 'Papa',
      email: 'classic.papa@example.net',
      password: 'abcd1234',
    });
    await databaseBuilder.commit();

    mockLearningContent(learningContent);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PUT /api/users/tutorials/{tutorialId}/evaluate', function () {
    let options: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      return knex('tutorial-evaluations').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('nominal case', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 201 when a status is provided', async function () {
        // given
        options = {
          method: 'PUT',
          url: '/api/users/tutorials/tutorialId/evaluate',
          headers: {
            authorization: generateValidRequestAuthorizationHeader(4444),
          },
          payload: {
            data: {
              type: 'tutorial-evaluations',
              attributes: {
                'tutorial-id': 'tutorialId',
                'user-id': 4444,
                status: TutorialEvaluation.statuses.LIKED,
              },
            },
          },
        };

        const expectedResponse = {
          data: {
            type: 'tutorial-evaluations',
            id: '1',
            attributes: {
              'tutorial-id': 'tutorialId',
              'user-id': 4444,
              status: TutorialEvaluation.statuses.LIKED,
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.result.data.type).to.deep.equal(expectedResponse.data.type);
        expect(response.result.data.id).to.exist;
        expect(response.result.data.attributes['user-id']).to.deep.equal(expectedResponse.data.attributes['user-id']);
        expect(response.result.data.attributes['tutorial-id']).to.deep.equal(
          expectedResponse.data.attributes['tutorial-id']
        );
        expect(response.result.data.attributes.status).to.deep.equal(expectedResponse.data.attributes.status);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 201 when no status is provided', async function () {
        // given
        options = {
          method: 'PUT',
          url: '/api/users/tutorials/tutorialId/evaluate',
          headers: {
            authorization: generateValidRequestAuthorizationHeader(4444),
          },
          payload: {
            data: {
              type: 'tutorial-evaluations',
              attributes: {
                'tutorial-id': 'tutorialId',
                'user-id': 4444,
              },
            },
          },
        };

        const expectedResponse = {
          data: {
            type: 'tutorial-evaluations',
            id: '1',
            attributes: {
              'tutorial-id': 'tutorialId',
              'user-id': 4444,
              status: TutorialEvaluation.statuses.LIKED,
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.result.data.type).to.equal(expectedResponse.data.type);
        expect(response.result.data.id).to.exist;
        expect(response.result.data.attributes['user-id']).to.equal(expectedResponse.data.attributes['user-id']);
        expect(response.result.data.attributes['tutorial-id']).to.equal(
          expectedResponse.data.attributes['tutorial-id']
        );
        expect(response.result.data.attributes.status).to.equal(expectedResponse.data.attributes.status);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('error cases', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 404 - not found when tutorialId does not exist', async function () {
        // given
        options.url = '/api/users/tutorials/badId/evaluate';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(404);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 401 - not authenticated when user not connected', async function () {
        // given
        options.headers = {};

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
