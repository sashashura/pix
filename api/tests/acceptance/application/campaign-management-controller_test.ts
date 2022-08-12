// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, expect, generateValidRequestAuthorizationHeader, knex } = require('../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Campaign Management Controller', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/campaigns/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign details', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign();
      const user = databaseBuilder.factory.buildUser.withRole();
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'GET',
        url: `/api/admin/campaigns/${campaign.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data.id).to.equal(campaign.id.toString());
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/admin/campaigns/{id}/participations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return participations', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign();
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign.id });
      const user = databaseBuilder.factory.buildUser.withRole();
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'GET',
        url: `/api/admin/campaigns/${campaign.id}/participations`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
      });

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data[0].id).to.equal(campaignParticipation.id.toString());
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('PATCH /api/admin/campaigns/{id}', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the updated campaign', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ name: 'odlName', multipleSendings: false });
      const user = databaseBuilder.factory.buildUser.withRole();
      await databaseBuilder.commit();

      // when
      const response = await server.inject({
        method: 'PATCH',
        url: `/api/admin/campaigns/${campaign.id}`,
        headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
        payload: {
          data: {
            attributes: {
              name: 'newName',
              title: campaign.title,
              'custom-landing-page-text': campaign.customLandingPageText,
              'custom-result-page-button-text': null,
              'custom-result-page-button-url': null,
              'custom-result-page-text': null,
              'multiple-sendings': true,
            },
          },
        },
      });
      const updatedCampaign = await knex('campaigns').first();
      // then
      expect(response.statusCode).to.equal(204);
      expect(updatedCampaign.name).to.equal('newName');
      expect(updatedCampaign.multipleSendings).to.be.true;
    });
  });
});
