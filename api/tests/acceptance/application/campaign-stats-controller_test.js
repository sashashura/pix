const {
  databaseBuilder,
  expect,
  generateValidRequestAuthorizationHeader,
  learningContentBuilder,
  mockLearningContent,
} = require('../../test-helper');

const createServer = require('../../../server');

describe('Acceptance | API | Campaign Stats Controller', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/campaigns/{id}/stats/participations-by-stage', function () {
    it('should return the campaign by id', async function () {
      // given
      const learningContentObjects = learningContentBuilder.buildLearningContent([
        {
          id: 'recArea1',
          titleFrFr: 'area1_Title',
          color: 'specialColor',
          competences: [
            {
              id: 'recCompetence1',
              name: 'Fabriquer un meuble',
              index: '1.1',
              tubes: [
                {
                  id: 'recTube1',
                  skills: [
                    { id: 'recSkillId1', nom: '@web1', challenges: [] },
                    { id: 'recSkillId2', nom: '@web2', challenges: [] },
                  ],
                },
              ],
            },
          ],
        },
      ]);
      mockLearningContent(learningContentObjects);

      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkillId1' });
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId: 'recSkillId2' });
      const stage1 = databaseBuilder.factory.buildStage({
        targetProfileId,
        threshold: 0,
        prescriberTitle: 'title',
        prescriberDescription: 'desc',
      });
      const stage2 = databaseBuilder.factory.buildStage({ targetProfileId, threshold: 30 });

      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId });
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({ organizationId: campaign.organizationId, userId });
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/stats/participations-by-stage`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data.id).to.equal(campaign.id.toString());
      expect(response.result.data.attributes.data).to.deep.equal([
        { id: stage1.id, value: 0, title: stage1.prescriberTitle, description: stage1.prescriberDescription },
        { id: stage2.id, value: 0, title: null, description: null },
      ]);
    });

    it('should return HTTP code 403 if the authenticated user is not authorize to access the campaign', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign();
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/stats/participations-by-stage`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  describe('GET /api/campaigns/{id}/stats/participations-by-status', function () {
    it('should return participations counts by status for the campaign', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign();
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({ organizationId: campaign.organizationId, userId });
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/stats/participations-by-status`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data.id).to.equal(campaign.id.toString());
      expect(response.result.data.attributes).to.deep.equal({ started: 0, completed: 0, shared: 0 });
    });

    it('should return HTTP code 403 if the authenticated user is not authorize to access the campaign', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign();
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/stats/participations-by-status`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      });

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  describe('GET /api/campaigns/{id}/stats/participations-by-day', function () {
    it('should return the activity by day', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign();
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildMembership({ organizationId: campaign.organizationId, userId });
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/stats/participations-by-day`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal({
        type: 'campaign-participations-counts-by-days',
        id: `${campaign.id}`,
        attributes: {
          'started-participations': [],
          'shared-participations': [],
        },
      });
    });
  });
});
