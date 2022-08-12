// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'useCases'.
const useCases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FRENCH_SPO... Remove this comment to see the full error message
const { FRENCH_SPOKEN } = require('../../../../lib/domain/constants').LOCALE;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | get-campaign-profile', function () {
  const locale = FRENCH_SPOKEN;
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    mockLearningContent({ competences: [], areas: [], skills: [] });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the campaign profile', async function () {
    const organizationId = databaseBuilder.factory.buildOrganization().id;
    const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
    const userId = databaseBuilder.factory.buildUser({ organizationId }).id;
    databaseBuilder.factory.buildMembership({ organizationId, userId });

    const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      participantExternalId: 'BabaYaga',
    }).id;

    await databaseBuilder.commit();
    // when
    const profile = await useCases.getCampaignProfile({
      userId,
      campaignId,
      campaignParticipationId,
      locale,
    });

    // then
    expect(profile.externalId).to.equal('BabaYaga');
  });
});
