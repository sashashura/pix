// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PassThroug... Remove this comment to see the full error message
const { PassThrough } = require('stream');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, streamToPromise, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'startWriti... Remove this comment to see the full error message
const startWritingCampaignProfilesCollectionResultsToStream = require('../../../../lib/domain/usecases/start-writing-campaign-profiles-collection-results-to-stream');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToGetCampaignResultsError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfilesCollectionExport = require('../../../../lib/infrastructure/serializers/csv/campaign-profiles-collection-export');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getI18n'.
const { getI18n } = require('../../../tooling/i18n/i18n');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Use Cases | start-writing-campaign-profiles-collection-results-to-stream', function () {
  const campaignRepository = { get: () => undefined };
  const userRepository = { getWithMemberships: () => undefined };
  const competenceRepository = { listPixCompetencesOnly: () => undefined };
  const organizationRepository = { get: () => undefined };
  const campaignParticipationRepository = { findProfilesCollectionResultDataByCampaignId: () => undefined };
  let writableStream: $TSFixMe;
  let csvPromise: $TSFixMe;
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const placementProfileService = Symbol('placementProfileService');
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const i18n = getI18n();

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(campaignRepository, 'get').rejects('error for campaignRepository.get');
    sinon.stub(userRepository, 'getWithMemberships').rejects('error for userRepository.getWithMemberships');
    sinon
      .stub(competenceRepository, 'listPixCompetencesOnly')
      .rejects('error for competenceRepository.listPixCompetencesOnly');
    sinon.stub(organizationRepository, 'get').rejects('error for organizationRepository.get');
    sinon
      .stub(campaignParticipationRepository, 'findProfilesCollectionResultDataByCampaignId')
      .rejects('error for campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId');
    sinon
      .stub(CampaignProfilesCollectionExport.prototype, 'export')
      .rejects('CampaignProfilesCollectionExport.prototype.export');
    writableStream = new PassThrough();
    csvPromise = streamToPromise(writableStream);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a UserNotAuthorizedToGetCampaignResultsError when user is not authorized', async function () {
    // given
    const notAuthorizedUser = domainBuilder.buildUser({ memberships: [] });
    const campaign = domainBuilder.buildCampaign();
    (campaignRepository.get as $TSFixMe).withArgs(campaign.id).resolves(campaign);
    (userRepository.getWithMemberships as $TSFixMe).withArgs(notAuthorizedUser.id).resolves(notAuthorizedUser);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const err = await catchErr(startWritingCampaignProfilesCollectionResultsToStream)({
      userId: notAuthorizedUser.id,
      campaignId: campaign.id,
      writableStream,
      i18n,
      campaignRepository,
      userRepository,
      competenceRepository,
      campaignParticipationRepository,
      organizationRepository,
      placementProfileService,
    });

    // then
    expect(err).to.be.instanceOf(UserNotAuthorizedToGetCampaignResultsError);
    expect((err as $TSFixMe).message).to.equal(`User does not have an access to the organization ${campaign.organization.id}`);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should process result for each participation and add it to csv', async function () {
    // given
    const competences = Symbol('competences');
    const campaignParticipationResultDatas = Symbol('campaignParticipationResultDatas');
    const organization = domainBuilder.buildOrganization();
    const user = domainBuilder.buildUser();
    domainBuilder.buildMembership({ user, organization });
    const campaign = domainBuilder.buildCampaign();
    (campaignRepository.get as $TSFixMe).withArgs(campaign.id).resolves(campaign);
    (userRepository.getWithMemberships as $TSFixMe).withArgs(user.id).resolves(user);
    (organizationRepository.get as $TSFixMe).withArgs(organization.id).resolves(organization);
    (competenceRepository.listPixCompetencesOnly as $TSFixMe).withArgs({ locale: 'fr' }).resolves(competences);
    (campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId as $TSFixMe).withArgs(campaign.id)
    .resolves(campaignParticipationResultDatas);
    CampaignProfilesCollectionExport.prototype.export
      .withArgs(campaignParticipationResultDatas, placementProfileService)
      .callsFake(async () => {
        await writableStream.write('result');
      });

    // when
    await startWritingCampaignProfilesCollectionResultsToStream({
      userId: user.id,
      campaignId: campaign.id,
      writableStream,
      i18n,
      campaignRepository,
      userRepository,
      competenceRepository,
      campaignParticipationRepository,
      organizationRepository,
      placementProfileService,
    });
    const csv = await csvPromise;

    // then
    expect(csv).to.equal('result');
  });
});
