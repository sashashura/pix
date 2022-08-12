// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationParticipantRepository = require('../../../../lib/infrastructure/repositories/organization-participant-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getPaginat... Remove this comment to see the full error message
const getPaginatedParticipantsForAnOrganization = require('../../../../lib/domain/usecases/get-paginated-participants-for-an-organization');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCases | get-paginated-participants-for-an-organization', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should get all participations for an organization', async function () {
    // given
    const organizationId = databaseBuilder.factory.buildOrganization().id;
    const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
      firstName: 'Ah',
      organizationId,
    }).id;
    const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
    databaseBuilder.factory.buildCampaignParticipation({
      organizationLearnerId,
      campaignId,
    });

    await databaseBuilder.commit();

    // when
    const results = await getPaginatedParticipantsForAnOrganization({
      organizationId,
      filters: { fullName: 'Ah' },
      page: { number: 1, size: 10 },
      organizationParticipantRepository,
    });

    // then
    const ids = results.organizationParticipants.map(({
      id
    }: $TSFixMe) => id);
    expect(ids).to.deep.equals([organizationLearnerId]);
  });
});
