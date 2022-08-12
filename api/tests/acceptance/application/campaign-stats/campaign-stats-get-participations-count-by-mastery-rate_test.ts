// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Campaign Stats | GetParticipationCountByMasteryRate', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaigns/{id}/stats/participations-by-mastery-rate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the mastery rate distribution', async function () {
      const { id: userId } = databaseBuilder.factory.buildUser();
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildMembership({ organizationId, userId });
      const { id: campaignId } = databaseBuilder.factory.buildCampaign({ organizationId });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.5, sharedAt: '2020-01-01' });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/api/campaigns/${campaignId}/stats/participations-by-mastery-rate`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      const { statusCode, result } = await server.inject(options);

      expect(statusCode).to.equal(200);
      expect(result.data.attributes['result-distribution']).to.deep.equal([{ count: 1, masteryRate: '0.50' }]);
    });
  });
});
