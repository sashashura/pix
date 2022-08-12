// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationParticipantRepository = require('../../../../lib/infrastructure/repositories/organization-participant-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

function buildLearnerWithParticipation(organizationId: $TSFixMe, learnerAttributes = {}, participationAttributes = {}) {
  const learner = databaseBuilder.factory.buildOrganizationLearner({
    organizationId,
    ...learnerAttributes,
  });
  const { id: campaignId } = databaseBuilder.factory.buildCampaign({ organizationId });
  databaseBuilder.factory.buildCampaignParticipation({
    campaignId,
    organizationLearnerId: learner.id,
    ...participationAttributes,
  });
  return learner;
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | OrganizationParticipant', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getParticipantsByOrganizationId', function () {
    let organizationId: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('display participants', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return no participants', async function () {
        databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;
        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        // then
        expect(organizationParticipants.length).to.equal(0);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return participants', async function () {
        buildLearnerWithParticipation(organizationId);
        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        // then
        expect(organizationParticipants.length).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not return participants from other organization', async function () {
        // given
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        buildLearnerWithParticipation(otherOrganizationId);
        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        // then
        expect(organizationParticipants.length).to.equal(0);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not take into account deleted participations', async function () {
        buildLearnerWithParticipation(organizationId, {}, { deletedAt: '2022-01-01' });
        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        // then
        expect(organizationParticipants.length).to.equal(0);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not take into account anonymous users', async function () {
        // given
        const anonymousUserId = databaseBuilder.factory.buildUser({ isAnonymous: true }).id;
        buildLearnerWithParticipation(organizationId, { userId: anonymousUserId });

        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        // then
        expect(organizationParticipants.length).to.equal(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('display number of participations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the count of participations for each participant', async function () {
        const organizationLearnerId = buildLearnerWithParticipation(organizationId).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, organizationLearnerId });
        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        // then
        expect(organizationParticipants[0].participationCount).to.equal(2);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only 1 participation even when the participant has improved its participation', async function () {
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        databaseBuilder.factory.buildCampaignParticipation({ organizationLearnerId, campaignId, isImproved: true });
        databaseBuilder.factory.buildCampaignParticipation({ organizationLearnerId, campaignId, isImproved: false });
        await databaseBuilder.commit();
        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });
        // then
        expect(organizationParticipants[0].participationCount).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only 1 result even when the participant has participated to several campaigns of the organization', async function () {
        const organizationLearnerId = buildLearnerWithParticipation(organizationId).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        databaseBuilder.factory.buildCampaignParticipation({ organizationLearnerId, campaignId });
        await databaseBuilder.commit();
        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });
        // then
        expect(organizationParticipants.length).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 1 as result even when the participant has participated to several campaigns from different the organization with the same organizationLearner', async function () {
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        databaseBuilder.factory.buildCampaignParticipation({ organizationLearnerId, campaignId });
        databaseBuilder.factory.buildCampaignParticipation({ organizationLearnerId });
        await databaseBuilder.commit();
        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });
        // then
        expect(organizationParticipants[0].participationCount).to.equal(1);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('Display last participation informations', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the name of the campaign for the most recent participation', async function () {
        const organizationLearnerId = buildLearnerWithParticipation(organizationId, {}, { createdAt: '2022-03-14' }).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId, name: 'King Arthur Campaign' }).id;
        databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId,
          campaignId,
          createdAt: new Date('2022-03-17'),
        });
        await databaseBuilder.commit();
        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        //then
        expect(organizationParticipants[0].campaignName).to.equal('King Arthur Campaign');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the type of the campaign for the most recent participation', async function () {
        const organizationLearnerId = buildLearnerWithParticipation(organizationId, {}, { createdAt: '2022-03-14' }).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId, type: 'PROFILES_COLLECTION' }).id;
        databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId,
          campaignId,
          createdAt: new Date('2022-03-17'),
        });
        await databaseBuilder.commit();
        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        //then
        expect(organizationParticipants[0].campaignType).to.equal('PROFILES_COLLECTION');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the status of the most recent participation', async function () {
        const organizationLearnerId = buildLearnerWithParticipation(organizationId, {}, { createdAt: '2022-03-14' }).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        databaseBuilder.factory.buildCampaignParticipation({
    organizationLearnerId,
    status: (campaignParticipationStatuses as $TSFixMe).TO_SHARE,
    campaignId,
    createdAt: new Date('2022-03-17'),
});
        await databaseBuilder.commit();
        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        //then
expect(organizationParticipants[0].participationStatus).to.equal((campaignParticipationStatuses as $TSFixMe).TO_SHARE);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the date of the last participation', async function () {
        const organizationLearnerId = buildLearnerWithParticipation(
          organizationId,
          {},
          { createdAt: new Date('2021-03-17') }
        ).id;
        const campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const lastParticipation = databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId,
          campaignId,
          createdAt: new Date('2022-03-17'),
        });
        await databaseBuilder.commit();
        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
        });

        // // then
        expect(organizationParticipants[0].lastParticipationDate).to.deep.equal(lastParticipation.createdAt);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('order', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when learners have the different last names', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should order participant by last name', async function () {
          // given
          buildLearnerWithParticipation(organizationId, { lastName: 'Marsiac' });
          buildLearnerWithParticipation(organizationId, { lastName: 'Frin' });
          await databaseBuilder.commit();

          // when
          const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
            organizationId,
          });

          // then
          expect(organizationParticipants.map(({
            lastName
          }: $TSFixMe) => lastName)).to.exactlyContainInOrder([
            'Frin',
            'Marsiac',
          ]);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when learners have the same last name', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should order participant by first name', async function () {
          // given
          buildLearnerWithParticipation(organizationId, {
            lastName: 'Frin',
            firstName: 'Yvo',
          });

          buildLearnerWithParticipation(organizationId, {
            lastName: 'Frin',
            firstName: 'Gwen',
          });
          await databaseBuilder.commit();

          // when
          const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
            organizationId,
          });

          // then
          expect(organizationParticipants.map(({
            firstName
          }: $TSFixMe) => firstName)).to.exactlyContainInOrder(['Gwen', 'Yvo']);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when learners have the same last name and first name', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should order participant by id', async function () {
          //given
          buildLearnerWithParticipation(organizationId, { id: 1, lastName: 'Frin', firstName: 'Yvo' });
          buildLearnerWithParticipation(organizationId, { id: 2, lastName: 'Frin', firstName: 'Yvo' });
          await databaseBuilder.commit();

          // when
          const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
            organizationId,
          });

          // then
          expect(organizationParticipants.map(({
            id
          }: $TSFixMe) => id)).to.exactlyContainInOrder([1, 2]);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('pagination', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return paginated campaign participations based on the given size and number', async function () {
        // given
        const page = { size: 1, number: 2 };
        const { id: otherOrganizationLearnerId } = buildLearnerWithParticipation(organizationId, {
          lastName: 'Joanny',
          firstName: 'Isaac',
        });
        buildLearnerWithParticipation(organizationId, { lastName: 'Joanny', firstName: 'Arthur' });

        await databaseBuilder.commit();

        // when
        const { organizationParticipants, pagination } =
          await organizationParticipantRepository.getParticipantsByOrganizationId({
            organizationId,
            page,
          });

        // then
        expect(organizationParticipants).to.have.lengthOf(1);
        expect(organizationParticipants[0].id).to.equal(otherOrganizationLearnerId);
        expect(pagination).to.deep.equals({ page: 2, pageCount: 2, pageSize: 1, rowCount: 2 });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('fullName', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the participants which match by first name', async function () {
        // given
        const { id: id1 } = buildLearnerWithParticipation(organizationId, { firstName: 'Anton' });
        const { id: id2 } = buildLearnerWithParticipation(organizationId, { firstName: 'anton' });
        buildLearnerWithParticipation(organizationId, { firstName: 'Llewelyn' });

        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
          filters: { fullName: ' Anton ' },
        });

        const ids = organizationParticipants.map(({
          id
        }: $TSFixMe) => id);

        // then
        expect(ids).to.exactlyContain([id1, id2]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the participants which match by last name when fullName text is a part of first name', async function () {
        // given
        const { id: id1 } = buildLearnerWithParticipation(organizationId, { firstName: 'Anton' });
        buildLearnerWithParticipation(organizationId, { firstName: 'Llewelyn' });

        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
          filters: { fullName: 'nt' },
        });

        const ids = organizationParticipants.map(({
          id
        }: $TSFixMe) => id);

        // then
        expect(ids).to.exactlyContain([id1]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the participants which match by last name', async function () {
        // given
        const { id: id1 } = buildLearnerWithParticipation(organizationId, { lastName: 'Chigurh' });
        const { id: id2 } = buildLearnerWithParticipation(organizationId, { lastName: 'chigurh' });
        buildLearnerWithParticipation(organizationId, { lastName: 'Moss' });

        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
          filters: { fullName: ' chigurh ' },
        });

        const ids = organizationParticipants.map(({
          id
        }: $TSFixMe) => id);

        // then
        expect(ids).to.exactlyContain([id1, id2]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the participants which match by last name when fullName text is a part of last name', async function () {
        // given
        // given
        buildLearnerWithParticipation(organizationId, { lastName: 'Moss' });
        const { id: id1 } = buildLearnerWithParticipation(organizationId, { lastName: 'Chigur' });

        await databaseBuilder.commit();

        // when
        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
          filters: { fullName: 'gu' },
        });

        const ids = organizationParticipants.map(({
          id
        }: $TSFixMe) => id);

        // then
        expect(ids).to.exactlyContain([id1]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns the participants which match by full name', async function () {
        const { id: id1 } = buildLearnerWithParticipation(organizationId, { firstName: 'Anton', lastName: 'Chigurh' });

        await databaseBuilder.commit();

        const { organizationParticipants } = await organizationParticipantRepository.getParticipantsByOrganizationId({
          organizationId,
          filters: { fullName: 'anton chur' },
        });

        const ids = organizationParticipants.map(({
          id
        }: $TSFixMe) => id);

        expect(ids).to.exactlyContain([id1]);
      });
    });
  });
});
