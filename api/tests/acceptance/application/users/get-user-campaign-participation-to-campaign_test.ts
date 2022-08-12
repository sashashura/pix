// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Route | GET /users/id/campaigns/id/campaign-participations', function () {
  let userId;
  let campaign;
  let campaignParticipation: $TSFixMe;
  let options: $TSFixMe;
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /users/:id/campaigns/:id/campaign-participations', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = databaseBuilder.factory.buildUser().id;
      campaign = databaseBuilder.factory.buildCampaign();
      campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        campaignId: campaign.id,
        status: 'SHARED',
      });

      options = {
        method: 'GET',
        url: `/api/users/${userId}/campaigns/${campaign.id}/campaign-participations`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return campaign participation with 200 HTTP status code', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal({
        data: {
          type: 'campaign-participations',
          id: campaignParticipation.id.toString(),
          attributes: {
            'is-shared': true,
            'participant-external-id': campaignParticipation.participantExternalId,
            'shared-at': campaignParticipation.sharedAt,
            'deleted-at': campaignParticipation.deletedAt,
            'created-at': campaignParticipation.createdAt,
          },
          relationships: {
            campaign: {
              data: null,
            },
            trainings: {
              links: {
                related: `/api/campaign-participations/${campaignParticipation.id}/trainings`,
              },
            },
          },
        },
      });
    });
  });
});
