// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | users-controller-reset-scorecard', function () {
  let options: $TSFixMe;
  let server: $TSFixMe;

  let userId: $TSFixMe;
  const competenceId = 'recAbe382T0e1337';
  const competence = {
    id: competenceId,
    nameFr: 'Mener une recherche et une veille d’information',
    descriptionFr: 'descriptionCompetence1',
    index: '1.1',
    origin: 'Pix',
    areaId: 'recvoGdo7z2z7pXWa',
  };
  const area = {
    id: 'recvoGdo7z2z7pXWa',
    titleFr: 'Information et données',
    color: 'jaffa',
    code: '1',
    competenceIds: [competenceId],
  };

  function inspectCompetenceEvaluationInDb({
    userId,
    competenceId
  }: $TSFixMe) {
    return knex.select('*').from('competence-evaluations').where({ userId, competenceId });
  }

  function inspectCampaignAssessmentsInDb({
    userId,
    state
  }: $TSFixMe) {
    return knex.select('*').from('assessments').where({ userId, state });
  }

  function inspectKnowledgeElementsInDb({
    userId,
    competenceId
  }: $TSFixMe) {
    return knex.select('*').from('knowledge-elements').where({ userId, competenceId }).orderBy('createdAt', 'DESC');
  }

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    await databaseBuilder.commit();

    options = {
      method: 'POST',
      url: `/api/users/${userId}/competences/${competenceId}/reset`,
      payload: {},
      headers: { 'accept-language': 'fr-fr' },
    };

    const learningContent = [
      {
        ...area,
        competences: [
          {
            ...competence,
            tubes: [
              {
                id: 'recTube1',
                skills: [
                  {
                    id: 'web1',
                  },
                  {
                    id: 'web2',
                  },
                  {
                    id: 'web3',
                  },
                  {
                    id: 'web4',
                  },
                ],
              },
              {
                id: 'recTube2',
                skills: [
                  {
                    id: 'url1',
                  },
                  {
                    id: 'url2',
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

    server = await createServer();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('knowledge-elements').delete();
    await knex('answers').delete();
    await knex('competence-evaluations').delete();
    await knex('assessments').delete();
    await knex('campaign-participations').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /users/{id}/competences/{id}/reset', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Resource access management', function () {
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
      it('should respond with a 403 - forbidden access - if requested user is not the same as authenticated user', async function () {
        // given
        const otherUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Precondition verification', function () {
      const competenceEvaluationId = 111;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        options.headers.authorization = generateValidRequestAuthorizationHeader(userId);

        databaseBuilder.factory.buildCompetenceEvaluation({
          id: competenceEvaluationId,
          userId,
          competenceId,
        });

        databaseBuilder.factory.buildKnowledgeElement({
          id: 1,
          userId,
          competenceId,
          createdAt: new Date(),
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should respond with a 412 - precondition failed - if last knowledge element date is not old enough', async function () {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(412);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Success case', function () {
      let response;
      const otherStartedCompetenceId = 'recBejNZgJke422G';
      const createdAt = new Date('2019-01-01');

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        options.headers.authorization = generateValidRequestAuthorizationHeader(userId);

        sinon.useFakeTimers({
          now: new Date('2019-01-10'),
          toFake: ['Date'],
        });

        const targetProfile = databaseBuilder.factory.buildTargetProfile();
        databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: 'url1' });
        const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });

        _.each(
          [
            {
              assessment: { userId },
              competenceEvaluation: { competenceId, userId, status: 'started' },
              knowledgeElements: [
                { skillId: 'web1', status: 'validated', source: 'direct', competenceId, earnedPix: 1, createdAt },
                { skillId: 'web2', status: 'invalidated', source: 'direct', competenceId, earnedPix: 2, createdAt },
                { skillId: 'web4', status: 'invalidated', source: 'inferred', competenceId, earnedPix: 4, createdAt },
                { skillId: 'url2', status: 'validated', source: 'direct', competenceId, earnedPix: 4, createdAt },
              ],
            },
            {
              assessment: { userId },
              competenceEvaluation: { competenceId: otherStartedCompetenceId, userId, status: 'started' },
              knowledgeElements: [
                {
                  skillId: 'rechInfo3',
                  status: 'validated',
                  source: 'direct',
                  competenceId: otherStartedCompetenceId,
                  earnedPix: 3,
                  createdAt,
                },
              ],
            },
            {
              assessment: { userId, type: 'CAMPAIGN' },
              campaignParticipation: { campaignId: campaign.id, status: STARTED },
              knowledgeElements: [
                { skillId: 'url1', status: 'validated', source: 'direct', competenceId, earnedPix: 2, createdAt },
              ],
            },
          ],
          ({
            assessment,
            competenceEvaluation,
            knowledgeElements,
            campaignParticipation
          }: $TSFixMe) => {
            const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
              ...campaignParticipation,
            }).id;
            const assessmentId = databaseBuilder.factory.buildAssessment({ ...assessment, campaignParticipationId }).id;
            databaseBuilder.factory.buildCompetenceEvaluation({ ...competenceEvaluation, assessmentId });
            _.each(knowledgeElements, (ke: $TSFixMe) => databaseBuilder.factory.buildKnowledgeElement({ ...ke, userId, assessmentId })
            );
          }
        );

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 200 and the updated scorecard', async function () {
        // given
        const expectedScorecardJSONApi = {
          data: {
            type: 'scorecards',
            id: `${userId}_${competenceId}`,
            attributes: {
              name: competence.nameFr,
              description: competence.descriptionFr,
              'competence-id': competenceId,
              index: competence.index,
              'earned-pix': 0,
              level: 0,
              'pix-score-ahead-of-next-level': 0,
              status: 'NOT_STARTED',
              'remaining-days-before-reset': null,
              'remaining-days-before-improving': null,
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
                title: area.titleFr,
                color: area.color,
              },
              id: area.id,
              type: 'areas',
            },
          ],
        };

        // when
        response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal(expectedScorecardJSONApi);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have reset the competence evaluation', async function () {
        // when
        response = await server.inject(options);

        // then
        const competenceEvaluation = await inspectCompetenceEvaluationInDb({ userId, competenceId });
        const otherCompetenceEvaluation = await inspectCompetenceEvaluationInDb({
          userId,
          competenceId: otherStartedCompetenceId,
        });
        expect(competenceEvaluation[0].status).to.equal('reset');
        expect(otherCompetenceEvaluation[0].status).to.equal('started');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have reset the assessment of campaign participation', async function () {
        // given
        const state = 'aborted';

        // when
        response = await server.inject(options);

        // then
        const campaignAssessments = await inspectCampaignAssessmentsInDb({ userId, state });
        expect(campaignAssessments).to.have.lengthOf(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have reset the knowledge elements created from both competence evaluations and campaign', async function () {
        // when
        response = await server.inject(options);

        // then
        const knowledgeElement = await inspectKnowledgeElementsInDb({ userId, competenceId });
        const knowledgeElementsOtherCompetence = await inspectKnowledgeElementsInDb({
          userId,
          competenceId: otherStartedCompetenceId,
        });

        expect(knowledgeElement).to.have.length(10);
        expect(knowledgeElement[0].earnedPix).to.equal(0);
        expect(knowledgeElement[0].status).to.equal('reset');
        expect(knowledgeElementsOtherCompetence[0].earnedPix).to.equal(3);
        expect(knowledgeElementsOtherCompetence[0].status).to.equal('validated');
      });
    });
  });
});
