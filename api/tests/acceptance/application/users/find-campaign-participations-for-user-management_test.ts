// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, generateValidRequestAuthorizationHeader, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | Controller | GET /api/admin/users/{id}/participations', function () {
  let server: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return participations', async function () {
    // given
    const user = databaseBuilder.factory.buildUser();
    const campaign = databaseBuilder.factory.buildCampaign();
    const organizationLearner = databaseBuilder.factory.buildOrganizationLearner();
    const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
      userId: user.id,
      campaignId: campaign.id,
      organizationLearnerId: organizationLearner.id,
    });
    const admin = databaseBuilder.factory.buildUser.withRole();
    await databaseBuilder.commit();

    // when
    const response = await server.inject({
      method: 'GET',
      url: `/api/admin/users/${user.id}/participations`,
      headers: { authorization: generateValidRequestAuthorizationHeader(admin.id) },
    });

    // then
    expect(response.statusCode).to.equal(200);
    expect(response.result).to.deep.equal({
      data: [
        {
          id: campaignParticipation.id.toString(),
          type: 'user-participations',
          attributes: {
            'campaign-code': campaign.code,
            'campaign-id': campaign.id,
            'created-at': campaignParticipation.createdAt,
            'deleted-at': null,
            'deleted-by': null,
            'participant-external-id': campaignParticipation.participantExternalId,
            'shared-at': campaignParticipation.sharedAt,
            status: campaignParticipation.status,
            'organization-learner-full-name': `${organizationLearner.firstName} ${organizationLearner.lastName}`,
          },
        },
      ],
    });
  });
});
