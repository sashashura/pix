// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getUserProfileSharedForCampaign = require('../../../../lib/domain/usecases/get-user-profile-shared-for-campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../../../../lib/domain/models/Scorecard');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoCampaign... Remove this comment to see the full error message
const { NoCampaignParticipationForUserAndCampaign } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | get-user-profile-shared-for-campaign', function () {
  const sharedAt = new Date('2020-02-01');
  const expectedCampaignParticipation = { id: '1', sharedAt, pixScore: 15 };
  const locale = 'fr';

  let campaignParticipationRepository: $TSFixMe;
  let knowledgeElementRepository: $TSFixMe;
  let competenceRepository: $TSFixMe;
  let campaignRepository: $TSFixMe;
  let organizationLearnerRepository: $TSFixMe;
  let userId: $TSFixMe;
  let campaignId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user has shared its profile for the campaign', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      userId = Symbol('user id');
      campaignId = Symbol('campaign id');
      campaignParticipationRepository = { findOneByCampaignIdAndUserId: sinon.stub() };
      knowledgeElementRepository = { findUniqByUserIdGroupedByCompetenceId: sinon.stub() };
      competenceRepository = { listPixCompetencesOnly: sinon.stub() };
      campaignRepository = { get: sinon.stub() };
      organizationLearnerRepository = { isActive: sinon.stub() };
      sinon.stub(Scorecard, 'buildFrom');
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      sinon.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the shared profile for campaign', async function () {
      const knowledgeElements = { competence1: [], competence2: [] };
      const competences = [{ id: 'competence1' }, { id: 'competence2' }];
      const campaign = { multipleSendings: false };
      // given
      campaignParticipationRepository.findOneByCampaignIdAndUserId
        .withArgs({ userId, campaignId })
        .resolves(expectedCampaignParticipation);
      knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId
        .withArgs({ userId, limitDate: sharedAt })
        .resolves(knowledgeElements);
      competenceRepository.listPixCompetencesOnly.withArgs({ locale: 'fr' }).resolves(competences);
      campaignRepository.get.withArgs(campaignId).resolves(campaign);
      organizationLearnerRepository.isActive.withArgs({ campaignId, userId }).resolves(false);
      (Scorecard.buildFrom as $TSFixMe).withArgs({ userId, knowledgeElements: knowledgeElements['competence1'], competence: competences[0] })
    .returns({ id: 'Score1', earnedPix: 10 });
      (Scorecard.buildFrom as $TSFixMe).withArgs({ userId, knowledgeElements: knowledgeElements['competence2'], competence: competences[1] })
    .returns({ id: 'Score2', earnedPix: 5 });

      // when
      const sharedProfile = await getUserProfileSharedForCampaign({
        userId,
        campaignId,
        campaignParticipationRepository,
        knowledgeElementRepository,
        competenceRepository,
        campaignRepository,
        organizationLearnerRepository,
        locale,
      });

      // then
      expect(sharedProfile).to.deep.equal({
        id: '1',
        sharedAt,
        pixScore: 15,
        canRetry: false,
        scorecards: [
          { id: 'Score1', earnedPix: 10 },
          { id: 'Score2', earnedPix: 5 },
        ],
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When user has not shared its profile', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error', async function () {
      // given
      campaignParticipationRepository.findOneByCampaignIdAndUserId.withArgs({ userId, campaignId }).resolves(null);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const result = await catchErr(getUserProfileSharedForCampaign)({
        userId,
        campaignId,
        campaignParticipationRepository,
        knowledgeElementRepository,
        competenceRepository,
        campaignRepository,
        organizationLearnerRepository,
      });

      // then
      expect(result).to.be.an.instanceOf(NoCampaignParticipationForUserAndCampaign);
      expect((result as $TSFixMe).message).to.be.equal("L'utilisateur n'a pas encore participé à la campagne");
    });
  });
});
