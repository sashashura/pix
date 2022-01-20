const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
const createServer = require('../../../../server');
const { FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;
const Assessment = require('../../../../lib/domain/models/Assessment');

describe('Acceptance | API | assessment-controller-get', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  let userId;
  const courseId = 'courseId';

  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-sibling-hooks
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser({}).id;
    await databaseBuilder.commit();
  });

  describe('(no provided answer) GET /api/assessments/:id', function () {
    let options;
    let assessmentId;

    beforeEach(async function () {
      assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        courseId,
        state: Assessment.states.STARTED,
        type: Assessment.types.PREVIEW,
      }).id;
      await databaseBuilder.commit();
      options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
      };
    });

    it('should return 200 HTTP status code', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return application/json', async function () {
      // when
      const response = await server.inject(options);

      // then
      const contentType = response.headers['content-type'];
      expect(contentType).to.contain('application/json');
    });

    it('should return the expected assessment', async function () {
      // when
      const response = await server.inject(options);

      // then
      const expectedAssessment = {
        type: 'assessments',
        id: assessmentId.toString(),
        attributes: {
          state: Assessment.states.STARTED,
          title: 'Preview',
          type: Assessment.types.PREVIEW,
          'certification-number': null,
          'last-question-state': Assessment.statesOfLastQuestion.ASKED,
          'competence-id': 'recCompetenceId',
          method: Assessment.methods.CHOSEN,
          'estimated-flash-level': undefined,
        },
        relationships: {
          course: {
            data: {
              id: 'courseId',
              type: 'courses',
            },
          },
          answers: {
            data: [],
            links: {
              related: `/api/answers?assessmentId=${assessmentId}`,
            },
          },
        },
      };
      const assessment = response.result.data;
      expect(assessment).to.deep.equal(expectedAssessment);
    });
  });

  describe('(when userId and assessmentId match) GET /api/assessments/:id', function () {
    let assessmentId;
    let options;

    beforeEach(async function () {
      assessmentId = databaseBuilder.factory.buildAssessment({ userId, courseId, type: Assessment.types.PREVIEW }).id;
      await databaseBuilder.commit();
      options = {
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
      };
    });

    it('should return 200 HTTP status code, when userId provided is linked to assessment', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('(answers provided, assessment completed) GET /api/assessments/:id', function () {
    let assessmentId, answer1, answer2;

    beforeEach(async function () {
      assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        courseId,
        state: Assessment.states.COMPLETED,
        type: Assessment.types.PREVIEW,
      }).id;

      answer1 = databaseBuilder.factory.buildAnswer({ assessmentId, challengeId: 'rec1' });
      answer2 = databaseBuilder.factory.buildAnswer({ assessmentId, challengeId: 'rec2' });

      await databaseBuilder.commit();
    });

    it('should return 200 HTTP status code', async function () {
      const options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return application/json', async function () {
      const options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
      };

      // when
      const response = await server.inject(options);

      // then
      const contentType = response.headers['content-type'];
      expect(contentType).to.contain('application/json');
    });

    it('should return the expected assessment', async function () {
      // given
      const options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
      };

      // when
      const response = await server.inject(options);

      // then
      const expectedAssessment = {
        type: 'assessments',
        id: assessmentId.toString(),
        attributes: {
          state: 'completed',
          title: 'Preview',
          type: Assessment.types.PREVIEW,
          'certification-number': null,
          'competence-id': 'recCompetenceId',
          'last-question-state': Assessment.statesOfLastQuestion.ASKED,
          method: Assessment.methods.CHOSEN,
          'estimated-flash-level': undefined,
        },
        relationships: {
          course: { data: { type: 'courses', id: courseId } },
          answers: {
            data: [
              {
                type: 'answers',
                id: answer1.id.toString(),
              },
              {
                type: 'answers',
                id: answer2.id.toString(),
              },
            ],
          },
        },
      };
      const assessment = response.result.data;
      expect(assessment.attributes).to.deep.equal(expectedAssessment.attributes);
      expect(assessment.relationships.answers.data).to.have.deep.members(expectedAssessment.relationships.answers.data);
    });
  });

  describe('GET /api/assessments/', function () {
    let assessmentId;

    beforeEach(async function () {
      const campaignId = databaseBuilder.factory.buildCampaign({ code: 'TESTCODE', name: 'CAMPAIGN TEST' }).id;
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId });
      assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        courseId: 'anyFromLearningContent',
        type: 'CAMPAIGN',
        campaignParticipationId: campaignParticipation.id,
      }).id;

      await databaseBuilder.commit();
    });

    it('should return 200 HTTP status code', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/assessments/',
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return application/json', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/assessments/',
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
      };

      // when
      const response = await server.inject(options);

      // then
      const contentType = response.headers['content-type'];
      expect(contentType).to.contain('application/json');
    });

    it('should return an array of assessments, with code campaign', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/assessments?filter[codeCampaign]=TESTCODE',
        headers: {
          authorization: generateValidRequestAuthorizationHeader(userId),
          'accept-language': FRENCH_SPOKEN,
        },
      };
      const expectedFirstAssessment = {
        type: 'assessment',
        id: assessmentId,
        attributes: {
          state: 'completed',
          title: undefined,
          type: 'CAMPAIGN',
          'certification-number': null,
          'code-campaign': 'TESTCODE',
          'competence-id': 'recCompetenceId',
          'last-question-state': Assessment.statesOfLastQuestion.ASKED,
          method: Assessment.methods.SMART_RANDOM,
          'estimated-flash-level': undefined,
        },
        relationships: {
          course: { data: { type: 'courses', id: 'anyFromLearningContent' } },
          answers: {
            data: [],
          },
        },
      };
      // when
      const response = await server.inject(options);

      // then
      expect(response.result.data).to.be.an('array');
      const assessment = response.result.data[0];
      expect(assessment.attributes).to.deep.equal(expectedFirstAssessment.attributes);
    });

    it('should return an empty array since no user is logged', async function () {
      // given
      const options = {
        method: 'GET',
        url: '/api/assessments?filter[codeCampaign]=TESTCODE',
      };
      // when
      const response = await server.inject(options);

      // then
      expect(response.result.data).to.be.an('array');
      expect(response.result.data).to.be.empty;
    });
  });
});
