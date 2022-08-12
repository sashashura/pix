// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participationsForUserManagementRepository = require('../../../../lib/infrastructure/repositories/participations-for-user-management-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationForUserManagement = require('../../../../lib/domain/read-models/CampaignParticipationForUserManagement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Participations-For-User-Management', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserId', function () {
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given user has no participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // given
        databaseBuilder.factory.buildCampaignParticipation();
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given user has participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only participations for given user', async function () {
        // given
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          participantExternalId: 'special',
        });
        const otherUserId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCampaignParticipation({
          userId: otherUserId,
        });
        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement).to.have.lengthOf(1);
        expect(participationsForUserManagement[0].participantExternalId).to.equal(
          campaignParticipation.participantExternalId
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return participations with all attributes', async function () {
        // given
        const campaign = databaseBuilder.factory.buildCampaign({ code: 'FUNCODE' });
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          firstName: 'Blanche',
          lastName: 'Isserie',
        });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          userId,
          organizationLearnerId: organizationLearner.id,
          campaignId: campaign.id,
          participantExternalId: '123',
          status: SHARED,
          createdAt: new Date('2010-10-10'),
          sharedAt: new Date('2010-10-11'),
        });

        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(participationsForUserManagement[0]).to.be.instanceOf(CampaignParticipationForUserManagement);
        expect(participationsForUserManagement[0]).to.deep.includes({
          id: campaignParticipation.id,
          participantExternalId: campaignParticipation.participantExternalId,
          status: campaignParticipation.status,
          createdAt: campaignParticipation.createdAt,
          sharedAt: campaignParticipation.sharedAt,
          campaignId: campaign.id,
          campaignCode: campaign.code,
          organizationLearnerFullName: `${organizationLearner.firstName} ${organizationLearner.lastName}`,
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When a participation is deleted', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return participation with deletion attributes', async function () {
          // given
          const deletingUser = databaseBuilder.factory.buildUser({ id: 666, firstName: 'The', lastName: 'Terminator' });
          const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
            userId,
            deletedAt: new Date('2010-10-12'),
            deletedBy: deletingUser.id,
          });

          await databaseBuilder.commit();

          // when
          const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

          // then
          expect(participationsForUserManagement[0]).to.deep.includes({
            deletedAt: campaignParticipation.deletedAt,
            deletedBy: campaignParticipation.deletedBy,
            deletedByFullName: 'The Terminator',
          });
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should sort participations by descending createdAt', async function () {
        // given
        databaseBuilder.factory.buildCampaignParticipation({
          userId,
          participantExternalId: '2',
          createdAt: new Date('2020-01-02'),
        });
        databaseBuilder.factory.buildCampaignParticipation({
          userId,
          participantExternalId: '3',
          createdAt: new Date('2020-01-01'),
        });
        databaseBuilder.factory.buildCampaignParticipation({
          userId,
          participantExternalId: '1',
          createdAt: new Date('2020-01-03'),
        });

        await databaseBuilder.commit();

        // when
        const participationsForUserManagement = await participationsForUserManagementRepository.findByUserId(userId);

        // then
        expect(_.map(participationsForUserManagement, 'participantExternalId')).to.exactlyContainInOrder([
          '1',
          '2',
          '3',
        ]);
      });
    });
  });
});
