// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationInfoRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-info-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Participation Info', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCampaignId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are several campaign', function () {
      let campaignParticipation1: $TSFixMe;
      let campaign1: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const userId = databaseBuilder.factory.buildUser().id;

        campaign1 = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });

        campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          {
            firstName: 'First',
            lastName: 'Last',
            division: null,
            group: null,
            userId,
          },
          {
            campaignId: campaign1.id,
            userId,
          },
          false
        );

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation1.id,
          userId,
          state: 'started',
          createdAt: new Date('2020-01-01'),
        });

        const campaign2 = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });

        const campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation(
          {
            firstName: 'First',
            lastName: 'Last',
            userId,
          },
          {
            campaignId: campaign2.id,
            userId,
          }
        );

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation2.id,
          userId,
          state: 'completed',
          createdAt: new Date('2020-01-01'),
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the campaign-participation for the given campaign', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign1.id);

        // then
        expect(campaignParticipationInfos).to.deep.equal([
          {
            sharedAt: campaignParticipation1.sharedAt,
            createdAt: campaignParticipation1.createdAt,
            participantExternalId: campaignParticipation1.participantExternalId,
            userId: campaignParticipation1.userId,
            campaignParticipationId: campaignParticipation1.id,
            isCompleted: false,
            masteryRate: null,
            participantFirstName: 'First',
            participantLastName: 'Last',
            studentNumber: null,
            division: null,
            group: null,
          },
        ]);
        expect(campaignParticipationInfos[0].isShared).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are several participants', function () {
      let campaign: $TSFixMe;
      let campaignParticipation1: $TSFixMe;
      let campaignParticipation2: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });

        const user1Id = databaseBuilder.factory.buildUser().id;
        const user2Id = databaseBuilder.factory.buildUser().id;
        const user3Id = databaseBuilder.factory.buildUser().id;

        campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'The', lastName: 'Narrator', division: null, group: null },
          {
            campaignId: campaign.id,
            userId: user1Id,
            sharedAt: new Date(),
          }
        );

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation1.id,
          userId: user1Id,
          state: 'started',
        });

        campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Tyler', lastName: 'Durden', division: null, group: null },
          {
            campaignId: campaign.id,
            userId: user2Id,
            status: STARTED,
            sharedAt: null,
          }
        );

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation2.id,
          userId: user2Id,
          state: 'completed',
        });

        const campaignParticipation3 = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Kiri', lastName: 'Kou', division: null, group: null },
          {
            campaignId: campaign.id,
            userId: user3Id,
            status: STARTED,
            sharedAt: null,
            deletedAt: new Date(),
          }
        );

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation3.id,
          userId: user1Id,
          state: 'started',
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all non deleted campaign-participation', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);
        const campaignParticipationInfosOrdered = campaignParticipationInfos.sort((a: $TSFixMe, b: $TSFixMe) => a.lastName < b.lastName);
        // then
        expect(campaignParticipationInfosOrdered.length).to.equal(2);
        expect(campaignParticipationInfosOrdered[0]).to.deep.equal({
          sharedAt: campaignParticipation1.sharedAt,
          createdAt: campaignParticipation1.createdAt,
          participantExternalId: campaignParticipation1.participantExternalId,
          userId: campaignParticipation1.userId,
          campaignParticipationId: campaignParticipation1.id,
          isCompleted: false,
          masteryRate: null,
          participantFirstName: 'The',
          participantLastName: 'Narrator',
          studentNumber: null,
          division: null,
          group: null,
        });
        expect(campaignParticipationInfosOrdered[0].isShared).to.equal(true);

        expect(campaignParticipationInfosOrdered[1]).to.deep.equal({
          sharedAt: campaignParticipation2.sharedAt,
          createdAt: campaignParticipation2.createdAt,
          participantExternalId: campaignParticipation2.participantExternalId,
          userId: campaignParticipation2.userId,
          campaignParticipationId: campaignParticipation2.id,
          isCompleted: true,
          masteryRate: null,
          participantFirstName: 'Tyler',
          participantLastName: 'Durden',
          studentNumber: null,
          division: null,
          group: null,
        });
        expect(campaignParticipationInfosOrdered[1].isShared).to.equal(false);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a participant has several assessment', function () {
      let campaign: $TSFixMe;
      let campaignParticipation: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });

        const userId = databaseBuilder.factory.buildUser().id;

        campaignParticipation = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'The', lastName: 'Narrator', division: null, group: null },
          {
            campaignId: campaign.id,
            userId,
            sharedAt: new Date(),
          }
        );

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation.id,
          userId,
          state: 'completed',
          createdAt: '2020-01-02',
        });

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation.id,
          userId,
          state: 'started',
          createdAt: '2020-01-01',
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return information about the newest assessment', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);
        // then
        expect(campaignParticipationInfos).to.deep.equal([
          {
            sharedAt: campaignParticipation.sharedAt,
            createdAt: campaignParticipation.createdAt,
            participantExternalId: campaignParticipation.participantExternalId,
            userId: campaignParticipation.userId,
            campaignParticipationId: campaignParticipation.id,
            isCompleted: true,
            masteryRate: null,
            participantFirstName: 'The',
            participantLastName: 'Narrator',
            studentNumber: null,
            division: null,
            group: null,
          },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a participant has several campaign participation', function () {
      let campaign: $TSFixMe;
      let campaignParticipation1;
      let campaignParticipation2: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });

        const userId = databaseBuilder.factory.buildUser().id;
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
          firstName: 'The',
          lastName: 'Narrator',
          division: null,
          group: null,
        }).id;

        campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
          organizationLearnerId,
          sharedAt: new Date(),
          isImproved: true,
        });

        campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
          organizationLearnerId,
          sharedAt: new Date(),
          isImproved: false,
        });

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation1.id,
          userId,
          state: 'completed',
          createdAt: '2020-01-02',
        });

        databaseBuilder.factory.buildAssessment({
          campaignParticipationId: campaignParticipation2.id,
          userId,
          state: 'completed',
          createdAt: '2020-01-01',
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return information with last campaign participation', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);
        // then
        expect(campaignParticipationInfos).to.deep.equal([
          {
            sharedAt: campaignParticipation2.sharedAt,
            createdAt: campaignParticipation2.createdAt,
            participantExternalId: campaignParticipation2.participantExternalId,
            userId: campaignParticipation2.userId,
            campaignParticipationId: campaignParticipation2.id,
            isCompleted: true,
            masteryRate: null,
            participantFirstName: 'The',
            participantLastName: 'Narrator',
            studentNumber: null,
            division: null,
            group: null,
          },
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a participant has several organization-learners', function () {
      let campaign: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const userId = databaseBuilder.factory.buildUser().id;
        campaign = databaseBuilder.factory.buildCampaign({ organizationId });
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          userId,
          firstName: 'John',
          lastName: 'Doe',
        }).id;
        databaseBuilder.factory.buildOrganizationLearner({
          organizationId: otherOrganizationId,
          userId,
          firstName: 'Jane',
          lastName: 'Doe',
        });
        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
          organizationLearnerId,
        }).id;
        databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return the first name and the last name of the correct organization-learner', async function () {
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);

        expect(campaignParticipationInfos.length).to.equal(1);
        expect(campaignParticipationInfos[0].participantFirstName).to.equal('John');
        expect(campaignParticipationInfos[0].participantLastName).to.equal('Doe');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context("when the participant has an organization learner for the campaign's organization", function () {
      let organizationLearner: $TSFixMe;
      let campaign: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const userId = databaseBuilder.factory.buildUser().id;
        campaign = databaseBuilder.factory.buildCampaign();
        organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          organizationId: campaign.organizationId,
          userId,
          studentNumber: 'Pipon et Jambon',
          division: '6eme',
          group: 'G1',
        });
        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
          organizationLearnerId: organizationLearner.id,
        }).id;
        databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId, state: 'started' });

        databaseBuilder.factory.buildOrganizationLearner({
          userId,
          studentNumber: 'Yippee Ki Yay',
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the student number of the organization learner associated to the given organization', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);

        // then
        expect(campaignParticipationInfos[0].studentNumber).to.equal(organizationLearner.studentNumber);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the first name and last of the organization learner associated to the given organization', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);

        // then
        expect(campaignParticipationInfos[0].participantFirstName).to.equal(organizationLearner.firstName);
        expect(campaignParticipationInfos[0].participantLastName).to.equal(organizationLearner.lastName);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the division', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);

        // then
        expect(campaignParticipationInfos[0].division).to.equal(organizationLearner.division);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the group', async function () {
        // when
        const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);

        // then
        expect(campaignParticipationInfos[0].group).to.equal(organizationLearner.group);
      });
    });
  });
});
