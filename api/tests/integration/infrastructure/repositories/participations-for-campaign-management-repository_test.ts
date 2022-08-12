// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, catchErr, knex } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const participationsForCampaignManagementRepository = require('../../../../lib/infrastructure/repositories/participations-for-campaign-management-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationForCampaignManagement = require('../../../../lib/domain/models/ParticipationForCampaignManagement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Participations-For-Campaign-Management', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedParticipationsForCampaignManagement', function () {
    let page: $TSFixMe;
    let campaignId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();

      page = { number: 1, size: 3 };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given campaign has no participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // given
        databaseBuilder.factory.buildCampaignParticipation();
        await databaseBuilder.commit();

        // when
        const { models: participationsForCampaignManagement } =
          await participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement({
            campaignId,
            page,
          });

        // then
        expect(participationsForCampaignManagement).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the given campaign has participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only participations for given campaign', async function () {
        // given
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner();
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId: organizationLearner.id,
          participantExternalId: 'special',
        });
        const otherCampaignId = databaseBuilder.factory.buildCampaign().id;
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaignId,
          organizationLearnerId: organizationLearner.id,
        });
        await databaseBuilder.commit();

        // when
        const { models: participationsForCampaignManagement } =
          await participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement({
            campaignId,
            page,
          });

        // then
        expect(participationsForCampaignManagement).to.have.lengthOf(1);
        expect(participationsForCampaignManagement[0].participantExternalId).to.equal(
          campaignParticipation.participantExternalId
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return participations with all attributes', async function () {
        // given
        const organizationLearner = databaseBuilder.factory.buildOrganizationLearner({
          lastName: 'King',
          firstName: 'Arthur',
        });
        const user = databaseBuilder.factory.buildUser({ firstName: 'Ar', lastName: 'Thur' });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId: user.id,
          organizationLearnerId: organizationLearner.id,
          participantExternalId: '123',
          status: SHARED,
          createdAt: new Date('2010-10-10'),
          sharedAt: new Date('2010-10-11'),
        });

        await databaseBuilder.commit();

        // when
        const { models: participationsForCampaignManagement } =
          await participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement({
            campaignId,
            page,
          });

        // then
        expect(participationsForCampaignManagement[0]).to.be.instanceOf(ParticipationForCampaignManagement);
        expect(participationsForCampaignManagement[0]).to.deep.includes({
          id: campaignParticipation.id,
          lastName: 'King',
          firstName: 'Arthur',
          userId: campaignParticipation.userId,
          userFullName: 'Ar Thur',
          participantExternalId: campaignParticipation.participantExternalId,
          status: campaignParticipation.status,
          createdAt: campaignParticipation.createdAt,
          sharedAt: campaignParticipation.sharedAt,
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('When a participation is deleted', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return participation with deletion attributes', async function () {
          // given
          const deletingUser = databaseBuilder.factory.buildUser({ id: 666, firstName: 'The', lastName: 'Terminator' });
          const campaignParticipation = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
            {},
            {
              campaignId,
              deletedAt: new Date('2010-10-12'),
              deletedBy: deletingUser.id,
            }
          );

          await databaseBuilder.commit();

          // when
          const { models: participationsForCampaignManagement } =
            await participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement({
              campaignId,
              page,
            });

          // then
          expect(participationsForCampaignManagement[0]).to.deep.includes({
            deletedAt: campaignParticipation.deletedAt,
            deletedBy: campaignParticipation.deletedBy,
            deletedByFullName: 'The Terminator',
          });
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should sort participations by ascending lastName and then ascending firstName', async function () {
        // given
        const organizationLearnerId1 = databaseBuilder.factory.buildOrganizationLearner({
          lastName: 'Baobab',
          firstName: 'Anatole',
        }).id;
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId: organizationLearnerId1,
          participantExternalId: '2',
        });
        const organizationLearnerId2 = databaseBuilder.factory.buildOrganizationLearner({
          lastName: 'Baobab',
          firstName: 'Bernard',
        }).id;
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId: organizationLearnerId2,
          participantExternalId: '3',
        });
        const organizationLearnerId3 = databaseBuilder.factory.buildOrganizationLearner({
          lastName: 'Athele',
          firstName: 'Peu importe',
        }).id;
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId: organizationLearnerId3,
          participantExternalId: '1',
        });

        await databaseBuilder.commit();

        // when
        const { models: participationsForCampaignManagement } =
          await participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement({
            campaignId,
            page,
          });

        // then
        expect(_.map(participationsForCampaignManagement, 'participantExternalId')).to.exactlyContainInOrder([
          '1',
          '2',
          '3',
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participations amount exceed page size', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return page size number of participations', async function () {
        page = { number: 2, size: 2 };

        _.times(4, () => databaseBuilder.factory.buildCampaignParticipation({ campaignId }));
        const expectedPagination = { page: 2, pageSize: 2, pageCount: 2, rowCount: 4 };
        await databaseBuilder.commit();
        // when
        const { models: participationsForCampaignManagement, meta: pagination } =
          await participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement({
            campaignId,
            page,
          });

        // then
        expect(participationsForCampaignManagement).to.have.lengthOf(2);
        expect(pagination).to.include(expectedPagination);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateParticipantExternalId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When campaign participation is not null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update  ', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;
        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
        const newParticipantExternalId = 'newExternal';
        await databaseBuilder.commit();

        await participationsForCampaignManagementRepository.updateParticipantExternalId({
          campaignParticipationId,
          participantExternalId: newParticipantExternalId,
        });
        const { participantExternalId } = await knex('campaign-participations')
          .select('*')
          .where('id', campaignParticipationId)
          .first();

        // then
        expect(participantExternalId).to.equal(newParticipantExternalId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When campaign participation is null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update  ', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;
        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
        const newParticipantExternalId = null;
        await databaseBuilder.commit();

        await participationsForCampaignManagementRepository.updateParticipantExternalId({
          campaignParticipationId,
          participantExternalId: newParticipantExternalId,
        });
        const { participantExternalId } = await knex('campaign-participations')
          .select('*')
          .where('id', campaignParticipationId)
          .first();

        // then
        expect(participantExternalId).to.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('campaign participation does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        const campaignId = databaseBuilder.factory.buildCampaign().id;
        databaseBuilder.factory.buildCampaignParticipation({ campaignId });
        await databaseBuilder.commit();

        const unexistingCampaignParticipationId = 90;
        const newParticipantExternalId = 'newExternal';

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(participationsForCampaignManagementRepository.updateParticipantExternalId)({
          unexistingCampaignParticipationId,
          participantExternalId: newParticipantExternalId,
        });

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });
});
