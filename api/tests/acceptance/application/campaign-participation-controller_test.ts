// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'insertUser... Remove this comment to see the full error message
  insertUserWithRoleSuperAdmin,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Campaign Participations', function () {
  let server: $TSFixMe, options: $TSFixMe, user: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
    user = databaseBuilder.factory.buildUser();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/campaign-participations/{id}', function () {
    let campaignParticipationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignParticipationId = 123111;

      const learningContent = [
        {
          id: 'recArea1',
          competences: [
            {
              id: 'recCompetence1',
              tubes: [
                {
                  id: 'recTube1',
                  skills: [
                    {
                      id: 'recAcquisWeb1',
                      nom: '@web1',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      const learningObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningObjects);

      options = {
        method: 'PATCH',
        url: `/api/campaign-participations/${campaignParticipationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };
    });
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('pgboss.job').where({ name: 'ParticipationResultCalculationJob' }).delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('shares the campaign participation', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: 'recAcquisWeb1' });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        id: campaignParticipationId,
        userId: user.id,
        status: STARTED,
        sharedAt: null,
        campaignId: campaign.id,
      });
      databaseBuilder.factory.buildAssessment({
        campaignParticipationId: campaignParticipation.id,
        userId: user.id,
        type: Assessment.types.CAMPAIGN,
        state: Assessment.states.COMPLETED,
      });

      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);
      const result = await knex('campaign-participations').first();

      // then
      expect(response.statusCode).to.equal(204);
      expect(result.status).to.equal(SHARED);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('POST /api/campaign-participations', function () {
    let campaignId: $TSFixMe;
    const options = {
      method: 'POST',
      url: '/api/campaign-participations',
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line mocha/no-setup-in-describe
      headers: { authorization: generateValidRequestAuthorizationHeader() },
      payload: {
        data: {
          type: 'campaign-participations',
          attributes: {
            'participant-external-id': 'iuqezfh13736',
          },
          relationships: {
            campaign: {
              data: {
                id: null,
                type: 'campaigns',
              },
            },
          },
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      options.headers = { authorization: generateValidRequestAuthorizationHeader(user.id) };
      campaignId = databaseBuilder.factory.buildCampaign({}).id;
      mockLearningContent({ skills: [] });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('assessments').delete();
      await knex('campaign-participations').delete();
      await knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 201 and the campaign participation when it has been successfully created', async function () {
      // given
      options.payload.data.relationships.campaign.data.id = campaignId;

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(201);
      expect(response.result.data.id).to.exist;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 412 if the user already participated to the campaign', async function () {
      // given
      options.payload.data.relationships.campaign.data.id = campaignId;

      // when
      await server.inject(options);
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(412);
      expect(response.result.errors[0].detail).to.equal(
        `User ${user.id} has already a campaign participation with campaign ${campaignId}`
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 404 error if the campaign related to the participation does not exist', async function () {
      // given
      options.payload.data.relationships.campaign.data.id = null;

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(404);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 412 error if the user has already participated to the campaign', async function () {
      // given
      options.payload.data.relationships.campaign.data.id = campaignId;
      databaseBuilder.factory.buildCampaignParticipation({ userId: user.id, campaignId });
      await databaseBuilder.commit();

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(412);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/campaign-participations/{id}/begin-improvement', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('assessments').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 401 HTTP status code when user is not connected', async function () {
      // given
      options = {
        method: 'PATCH',
        url: '/api/campaign-participations/123/begin-improvement',
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(401);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        status: STARTED,
      }).id;
      databaseBuilder.factory.buildAssessment({
        userId,
        campaignParticipationId,
        isImproving: false,
        state: Assessment.states.COMPLETED,
        type: 'CAMPAIGN',
      });
      await databaseBuilder.commit();
      options = {
        method: 'PATCH',
        url: `/api/campaign-participations/${campaignParticipationId}/begin-improvement`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 412 HTTP status code when user has already shared his results', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ userId }).id;
      databaseBuilder.factory.buildAssessment({
        userId,
        campaignParticipationId,
        isImproving: false,
        state: Assessment.states.COMPLETED,
        type: 'CAMPAIGN',
      });
      await databaseBuilder.commit();
      options = {
        method: 'PATCH',
        url: `/api/campaign-participations/${campaignParticipationId}/begin-improvement`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(412);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 403 HTTP status code when user is not the owner of the participation', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const anotherUserId = databaseBuilder.factory.buildUser().id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId: anotherUserId,
        status: STARTED,
      }).id;
      databaseBuilder.factory.buildAssessment({
        userId,
        campaignParticipationId,
        isImproving: false,
        state: Assessment.states.COMPLETED,
        type: 'CAMPAIGN',
      });
      await databaseBuilder.commit();
      options = {
        method: 'PATCH',
        url: `/api/campaign-participations/${campaignParticipationId}/begin-improvement`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(403);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/campaign/{campaignId}/campaign-participations/{campaignParticipationId}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ organizationId, user }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
      databaseBuilder.factory.buildMembership({ userId, organizationRole: 'ADMIN', organizationId });

      await databaseBuilder.commit();
      options = {
        method: 'DELETE',
        url: `/api/campaigns/${campaignId}/campaign-participations/${campaignParticipationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{campaignId}/profiles-collection-participations/{campaignParticipationId}', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const learningObjects = learningContentBuilder.buildLearningContent([]);
      mockLearningContent(learningObjects);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign profile as JSONAPI', async function () {
      const userId = databaseBuilder.factory.buildUser().id;
      const organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildMembership({ userId, organizationId: organization.id });

      const campaign = databaseBuilder.factory.buildCampaign({ organizationId: organization.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        participantExternalId: 'Die Hard',
        campaignId: campaign.id,
      });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/api/campaigns/${campaign.id}/profiles-collection-participations/${campaignParticipation.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(200);
      const campaignProfile = response.result.data.attributes;
      expect(campaignProfile['external-id']).to.equal('Die Hard');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('DELETE /api/admin/campaign-participations/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 204 HTTP status code', async function () {
      // given
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation().id;
      await databaseBuilder.commit();

      options = {
        method: 'DELETE',
        url: `/api/admin/campaign-participations/${campaignParticipationId}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(superAdmin.id) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaign-participations/{id}/trainings', function () {
    let targetProfileId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      targetProfileId = 1;

      const learningContent = [
        {
          id: 'recArea1',
          competences: [],
          trainings: [
            {
              duration: { hours: 2 },
              link: 'https://example.net',
              locale: 'fr-fr',
              title: 'Training 1',
              type: 'webinaire',
              targetProfileIds: [targetProfileId],
            },
          ],
        },
      ];
      const learningObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningObjects);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign-participation trainings', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile({ id: targetProfileId });
      const campaign = databaseBuilder.factory.buildCampaign({ targetProfileId: targetProfile.id });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        userId: user.id,
        campaignId: campaign.id,
      });
      await databaseBuilder.commit();
      const options = {
        method: 'GET',
        url: `/api/campaign-participations/${campaignParticipation.id}/trainings`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data[0].type).to.equal('trainings');
      expect(response.result.data[0].attributes).to.deep.equal({
        duration: { hours: 2 },
        link: 'https://example.net',
        locale: 'fr-fr',
        title: 'Training 1',
        type: 'webinaire',
      });
    });
  });
});
