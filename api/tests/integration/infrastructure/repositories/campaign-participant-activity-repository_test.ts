// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipantActivityRepository = require('../../../../lib/infrastructure/repositories/campaign-participant-activity-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED, SHARED, TO_SHARE } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Participant activity', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findPaginatedByCampaignId', function () {
    let campaign: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is participations for another campaign', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildCampaign();
        const otherCampaign = databaseBuilder.factory.buildCampaign();

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'The good',
          campaignId: campaign.id,
        });

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'The bad',
          campaignId: otherCampaign.id,
        });

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'The ugly',
          campaignId: campaign.id,
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Returns a participation activity for each participant of the given campaign', async function () {
        const { campaignParticipantsActivities } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id });
        const participantExternalIds = campaignParticipantsActivities.map((activity: $TSFixMe) => activity.participantExternalId);

        expect(participantExternalIds).to.exactlyContain(['The good', 'The ugly']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there are several participations for the same participant', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Returns one CampaignParticipantActivity with the most recent participation (isImproved = false)', async function () {
        // given
        const campaign = databaseBuilder.factory.buildCampaign();
        const user = databaseBuilder.factory.buildUser();

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'The bad',
          campaignId: campaign.id,
          status: STARTED,
          userId: user.id,
          isImproved: true,
        });

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'The good',
          campaignId: campaign.id,
          status: STARTED,
          userId: user.id,
          isImproved: false,
        });

        await databaseBuilder.commit();

        //when
        const { campaignParticipantsActivities } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id });

        //then
        expect(campaignParticipantsActivities).to.have.lengthOf(1);
        expect(campaignParticipantsActivities[0].participantExternalId).to.equal('The good');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('status', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participation is shared', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return status shared', async function () {
          // given
          campaign = databaseBuilder.factory.buildCampaign();
          databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign.id, status: SHARED });
          await databaseBuilder.commit();

          // when
          const { campaignParticipantsActivities } =
            await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id });

          // then
          expect(campaignParticipantsActivities[0].status).to.equal(SHARED);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participation is not shared', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return status to share', async function () {
          // given
          campaign = databaseBuilder.factory.buildCampaign();
          databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign.id, status: TO_SHARE });
          await databaseBuilder.commit();

          // when
          const { campaignParticipantsActivities } =
            await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id });

          // then
          expect(campaignParticipantsActivities[0].status).to.equal(TO_SHARE);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the participation is started', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return status started', async function () {
          // given
          campaign = databaseBuilder.factory.buildCampaign();
          databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign.id, status: STARTED });
          await databaseBuilder.commit();

          // when
          const { campaignParticipantsActivities } =
            await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id });

          // then
          expect(campaignParticipantsActivities[0].status).to.equal(STARTED);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('order', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return participants activities ordered by last name then first name asc from organization-learner', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        campaign = databaseBuilder.factory.buildCampaign({ organizationId });
        const campaignParticipation = { campaignId: campaign.id };
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Jaja', lastName: 'Le raplapla', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'jiji', lastName: 'Le riquiqui', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Jojo', lastName: 'Le rococo', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { firstName: 'Juju', lastName: 'Le riquiqui', organizationId },
          campaignParticipation,
          true
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id });
        const names = campaignParticipantsActivities.map((result: $TSFixMe) => result.firstName);

        // then
        expect(names).exactlyContainInOrder(['Jaja', 'jiji', 'Juju', 'Jojo']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on division', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have the correct division', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign();
        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, division: 'Good Guys Team' },
          { participantExternalId: 'The good', campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, division: 'Bad Guys Team' },
          { participantExternalId: 'The bad', campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, division: 'Ugly Guys Team' },
          { participantExternalId: 'The ugly', campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { divisions: ['Good Guys Team', 'Ugly Guys Team'] },
          });

        const participantExternalIds = campaignParticipantsActivities.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good', 'The ugly']);
        expect(pagination.rowCount).to.equal(2);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on status', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have the correct status', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId },
          { participantExternalId: 'The good', campaignId: campaign.id, status: STARTED }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId },
          { participantExternalId: 'The bad', campaignId: campaign.id, status: TO_SHARE }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { status: STARTED },
          });

        const participantExternalIds = campaignParticipantsActivities.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good']);
        expect(pagination.rowCount).to.equal(1);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on the firstname and lastname', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns all participants if the filter is empty', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Eurasier' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Salto', lastName: 'Irish terrier' },
          { campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { pagination } = await campaignParticipantActivityRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { search: '' },
        });

        // then
        expect(pagination.rowCount).to.equal(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search part its firstname', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Eurasier' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Salto', lastName: 'Irish terrier' },
          { campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { search: 'Chou' },
          });

        // then
        expect(pagination.rowCount).to.equal(1);
        expect(campaignParticipantsActivities[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search contains a space before', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Eurasier' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Salto', lastName: 'Irish terrier' },
          { campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { search: ' Cho' },
          });

        // then
        expect(pagination.rowCount).to.equal(1);
        expect(campaignParticipantsActivities[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search contains a space after', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Eurasier' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Salto', lastName: 'Irish terrier' },
          { campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { search: 'Cho ' },
          });

        // then
        expect(pagination.rowCount).to.equal(1);
        expect(campaignParticipantsActivities[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search part its lastname', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Eurasier' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Salto', lastName: 'Irish terrier' },
          { campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { search: 'Eura' },
          });

        // then
        expect(pagination.rowCount).to.equal(1);
        expect(campaignParticipantsActivities[0].lastName).to.equal('Eurasier');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant when we search part its fullname', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Eurasier' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Salto', lastName: 'Irish terrier' },
          { campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { search: 'Choupette E' },
          });

        // then
        expect(pagination.rowCount).to.equal(1);
        expect(campaignParticipantsActivities[0].firstName).to.equal('Choupette');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return Choupette participant only for the involved campaign when we search part of its full name', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});
        const otherCampaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Right' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Choupette', lastName: 'Wrong' },
          { campaignId: otherCampaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { search: 'Choupette' },
          });

        // then
        expect(pagination.rowCount).to.equal(1);
        expect(campaignParticipantsActivities[0].lastName).to.equal('Right');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return all participants when we search similar part of firstname', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign({});

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Saphira', lastName: 'Eurasier' },
          { campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, firstName: 'Salto', lastName: 'Irish terrier' },
          { campaignId: campaign.id }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { search: 'Sa' },
          });

        // then
        expect(pagination.rowCount).to.equal(2);
        expect(campaignParticipantsActivities[0].firstName).to.equal('Saphira');
        expect(campaignParticipantsActivities[1].firstName).to.equal('Salto');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a filter on group', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns participants which have the correct group', async function () {
        // given
        campaign = databaseBuilder.factory.buildCampaign();

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, group: 'L1' },
          { participantExternalId: 'The good', campaignId: campaign.id }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, group: 'T1' },
          { participantExternalId: 'The bad', campaignId: campaign.id, status: 'STARTED' }
        );

        databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          { organizationId: campaign.organizationId, group: 'T2' },
          { participantExternalId: 'The ugly', campaignId: campaign.id, status: 'STARTED' }
        );

        await databaseBuilder.commit();

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            filters: { groups: ['L1', 'T2'] },
          });

        const participantExternalIds = campaignParticipantsActivities.map((result: $TSFixMe) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good', 'The ugly']);
        expect(pagination.rowCount).to.equal(2);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('pagination', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildCampaign();

        const participation = { campaignId: campaign.id };
        databaseBuilder.factory.buildCampaignParticipation(participation);
        databaseBuilder.factory.buildCampaignParticipation(participation);
        databaseBuilder.factory.buildCampaignParticipation({ ...participation, deletedAt: new Date() });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated campaign participations based on the given size and number', async function () {
        // given
        const page = { size: 1, number: 1 };

        // when
        const { campaignParticipantsActivities, pagination } =
          await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id, page });

        // then
        expect(campaignParticipantsActivities).to.have.lengthOf(1);
        expect(pagination).to.deep.equals({ page: 1, pageCount: 2, pageSize: 1, rowCount: 2 });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('default pagination', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a page size of 25', async function () {
          // when
          const { pagination } = await campaignParticipantActivityRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
          });

          // then
          expect(pagination.pageSize).to.equals(25);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are zero rows', function () {
        // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
        beforeEach(async function () {
          campaign = databaseBuilder.factory.buildCampaign();

          await databaseBuilder.commit();
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return the first page with 0 elements', async function () {
          // when
          const { campaignParticipantsActivities, pagination } =
            await campaignParticipantActivityRepository.findPaginatedByCampaignId({ campaignId: campaign.id });

          // then
          expect(campaignParticipantsActivities).to.have.lengthOf(0);
          expect(pagination).to.deep.equals({ page: 1, pageCount: 0, pageSize: 25, rowCount: 0 });
        });
      });
    });
  });
});
