// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../../db/knex-database-connection');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const campaignParticipantRepository = require('../../../../lib/infrastructure/repositories/campaign-participant-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipant = require('../../../../lib/domain/models/CampaignParticipant');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
const CampaignToStartParticipation = require('../../../../lib/domain/models/CampaignToStartParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'pick'.
const pick = require('lodash/pick');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingCampaignParticipationError, NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
const campaignParticipationDBAttributes = [
  'id',
  'campaignId',
  'userId',
  'status',
  'organizationLearnerId',
  'participantExternalId',
];

const assessmentAttributes = ['userId', 'method', 'state', 'type', 'courseId', 'isImproving'];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | CampaignParticipant', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('save', function () {
    let userIdentity: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const user = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();
      userIdentity = { id: user.id, firstName: user.firstName, lastName: user.lastName };
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('assessments').delete();
      await knex('campaign-participations').delete();
      await knex('organization-learners').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns campaign participation id', async function () {
      const campaignParticipant = await makeCampaignParticipant({
        campaignAttributes: { idPixLabel: null },
        userIdentity,
        participantExternalId: null,
      });

      const id = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        return campaignParticipantRepository.save(campaignParticipant, domainTransaction);
      });

      const [campaignParticipationId] = await knex('campaign-participations').pluck('id');

      expect(id).to.equal(campaignParticipationId);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is profile collection', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create a campaign participation', async function () {
        const campaignParticipant = await makeCampaignParticipant({
          campaignAttributes: { type: 'PROFILES_COLLECTION', idPixLabel: null },
          userIdentity,
          participantExternalId: null,
        });

        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        const campaignParticipation = await knex('campaign-participations')
          .select(campaignParticipationDBAttributes)
          .first();

        expect(campaignParticipation).to.deep.equal(
          getExpectedCampaignParticipation(campaignParticipation.id, campaignParticipant)
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not create an assessment', async function () {
        const campaignParticipant = await makeCampaignParticipant({
          campaignAttributes: { type: 'PROFILES_COLLECTION', idPixLabel: null },
          userIdentity,
          participantExternalId: null,
        });

        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        const assessments = await knex('assessments');

        expect(assessments).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is assessment', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create a campaign participation and an assessment', async function () {
        //GIVEN
        const campaignParticipant = await makeCampaignParticipant({
          campaignAttributes: {
            type: 'ASSESSMENT',
            idPixLabel: null,
            method: 'SMART_RANDOM',
          },
          userIdentity,
          participantExternalId: null,
        });

        //WHEN
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        //THEN
        const campaignParticipation = await knex('campaign-participations')
          .select(['id', ...campaignParticipationDBAttributes])
          .first();

        const assessment = await knex('assessments')
          .select(['campaignParticipationId', ...assessmentAttributes])
          .first();

        expect(campaignParticipation).to.deep.equal(
          getExpectedCampaignParticipation(campaignParticipation.id, campaignParticipant)
        );
        expect(assessment).to.deep.equal(getExpectedAssessment(campaignParticipation.id, campaignParticipant));
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is already an organization learner', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create a campaign participation linked to this organization learner', async function () {
        //GIVEN
        const campaign = databaseBuilder.factory.buildCampaign({ idPixLabel: null });
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
        await databaseBuilder.commit();

        const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          organizationLearnerId,
          organizationLearner: {
            id: organizationLearnerId,
            hasParticipated: false,
          },
          userIdentity,
          previousCampaignParticipationForUser: null,
        });

        campaignParticipant.start({ participantExternalId: null });

        //WHEN
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        //THEN
        const campaignParticipation = await knex('campaign-participations').select('organizationLearnerId').first();
        expect(campaignParticipation.organizationLearnerId).to.equal(organizationLearnerId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no organization learner linked', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create a new organization learner', async function () {
        //GIVEN
        userIdentity = databaseBuilder.factory.buildUser({ firstName: 'Valentin', lastName: 'Tamare' });
        const campaign = databaseBuilder.factory.buildCampaign({ idPixLabel: null });
        await databaseBuilder.commit();

        const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
          userIdentity,
          previousCampaignParticipationForUser: null,
        });

        campaignParticipant.start({ participantExternalId: null });

        //WHEN
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        //THEN
        const organizationLearner = await knex('organization-learners')
          .select('firstName', 'lastName', 'userId', 'organizationId')
          .first();

        expect(organizationLearner).to.deep.equal({
          firstName: userIdentity.firstName,
          lastName: userIdentity.lastName,
          organizationId: campaignToStartParticipation.organizationId,
          userId: userIdentity.id,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('create a campaign participation linked to the new organization learner', async function () {
        //GIVEN
        const campaign = databaseBuilder.factory.buildCampaign({ idPixLabel: null });
        await databaseBuilder.commit();

        const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
          userIdentity,
          previousCampaignParticipationForUser: null,
        });

        campaignParticipant.start({ participantExternalId: null });

        //WHEN
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        //THEN
        const campaignParticipation = await knex('campaign-participations').select('organizationLearnerId').first();
        const organizationLearner = await knex('organization-learners').select('id').first();
        expect(campaignParticipation.organizationLearnerId).to.equal(organizationLearner.id);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a previous participation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('update the previous participation', async function () {
        //GIVEN
        const campaign = databaseBuilder.factory.buildCampaign({
          multipleSendings: true,
        });
        const { id: previousCampaignParticipationForUserId } = databaseBuilder.factory.buildCampaignParticipation({
          userId: userIdentity.id,
          campaignId: campaign.id,
          isImproved: false,
          status: 'SHARED',
        });

        await databaseBuilder.commit();

        const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          previousCampaignParticipationForUser: {
            id: previousCampaignParticipationForUserId,
            status: 'SHARED',
            validatedSkillsCount: 0,
          },
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });

        campaignParticipant.start({ participantExternalId: null });

        //WHEN
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        //THEN
        const campaignParticipation = await knex('campaign-participations')
          .select('isImproved')
          .where({ id: previousCampaignParticipationForUserId })
          .first();

        expect(campaignParticipation.isImproved).to.deep.equal(true);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not update participation for other user or campaign', async function () {
        //GIVEN
        const campaign = databaseBuilder.factory.buildCampaign({
          idPixLabel: null,
          multipleSendings: true,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          isImproved: false,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          userId: userIdentity.id,
          isImproved: false,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          isImproved: false,
        });
        const { id: previousCampaignParticipationForUserId } = databaseBuilder.factory.buildCampaignParticipation({
          userId: userIdentity.id,
          campaignId: campaign.id,
          isImproved: false,
        });

        await databaseBuilder.commit();

        const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          previousCampaignParticipationForUser: {
            id: previousCampaignParticipationForUserId,
            status: 'SHARED',
            validatedSkillsCount: 0,
          },
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });

        campaignParticipant.start({ participantExternalId: null });

        //WHEN
        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        //THEN
        const campaignParticipations = await knex('campaign-participations').pluck('id').where({ isImproved: true });

        expect(campaignParticipations).to.deep.equal([previousCampaignParticipationForUserId]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when external id is asked', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('save participant external id', async function () {
        const campaignParticipant = await makeCampaignParticipant({
          campaignAttributes: { idPixLabel: 'some external id' },
          userIdentity,
          participantExternalId: 'some participant external id',
        });

        await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
        });

        const campaignParticipation = await knex('campaign-participations')
          .select(campaignParticipationDBAttributes)
          .first();

        expect(campaignParticipation).to.deep.equal(
          getExpectedCampaignParticipation(campaignParticipation.id, campaignParticipant)
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is an exception', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there already is a participation for this campaign', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an exception AlreadyExistingCampaignParticipationError', async function () {
          //GIVEN
          const campaign = databaseBuilder.factory.buildCampaign({
            idPixLabel: null,
          });
          databaseBuilder.factory.buildCampaignParticipation({
            userId: userIdentity.id,
            campaignId: campaign.id,
            isImproved: false,
          });

          await databaseBuilder.commit();

          const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation,
            userIdentity,
            organizationLearner: {
              id: null,
              hasParticipated: false,
            },
          });

          campaignParticipant.start({ participantExternalId: null });

          //WHEN
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => {
            return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
              await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
            });
          })();

          //THEN
          expect(error).to.be.an.instanceof(AlreadyExistingCampaignParticipationError);
          expect((error as $TSFixMe).message).to.equal(`User ${userIdentity.id} has already a campaign participation with campaign ${campaign.id}`);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there is another error', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws the original exception', async function () {
          //GIVEN
          const campaign = databaseBuilder.factory.buildCampaign({
            idPixLabel: null,
          });

          await databaseBuilder.commit();

          const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation,
            userIdentity: { id: 12, firstName: '', lastName: '' },
            organizationLearner: {
              id: null,
              hasParticipated: false,
            },
          });

          campaignParticipant.start({ participantExternalId: null });

          //WHEN
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(() => {
            return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
              await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
            });
          })();

          //THEN
expect((error as $TSFixMe).constraint).to.equal('organization_learners_userid_foreign');
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not update data', async function () {
        const campaign = databaseBuilder.factory.buildCampaign({
          multipleSendings: true,
          idPixLabel: null,
        });
        const { id: previousCampaignParticipationForUserId } = databaseBuilder.factory.buildCampaignParticipation({
          userId: userIdentity.id,
          campaignId: campaign.id,
          isImproved: false,
        });

        await databaseBuilder.commit();

        const campaignToStartParticipation = new CampaignToStartParticipation({ ...campaign, id: 13 });
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          previousCampaignParticipationForUser: {
            id: previousCampaignParticipationForUserId,
            status: 'SHARED',
            validatedSkillsCount: 0,
          },
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });

        campaignParticipant.start({ participantExternalId: null });

        //WHEN
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(() => {
          return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
            await campaignParticipantRepository.save(campaignParticipant, domainTransaction);
          });
        })();

        //THEN
        const campaignParticipations = await knex('campaign-participations').select(['id', 'isImproved']);
        const assessments = await knex('assessments');

        expect(campaignParticipations).to.deep.equal([
          { id: previousCampaignParticipationForUserId, isImproved: false },
        ]);
        expect(assessments).to.be.empty;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get', function () {
    let organizationId: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      organizationId = 12;
      const learningContent = { skills: [{ id: 'skill1', status: 'actif' }] };

      mockLearningContent(learningContent);
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('set the userId', async function () {
      const campaign = buildCampaignWithCompleteTargetProfile({});
      const { id: userId } = databaseBuilder.factory.buildUser();

      await databaseBuilder.commit();

      const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        return campaignParticipantRepository.get({
          userId,
          campaignId: campaign.id,
          domainTransaction,
        });
      });

      expect(campaignParticipant.userIdentity.id).to.equal(userId);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a previous campaign participation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('find the most recent campaign participation', async function () {
        const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({
          organizationId,
          multipleSendings: true,
          idPixLabel: 'externalId',
        });
        const { id: userId } = databaseBuilder.factory.buildUser();

        databaseBuilder.factory.buildCampaignParticipation({ userId });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaignToStartParticipation.id });
        databaseBuilder.factory.buildCampaignParticipation({
          userId,
          campaignId: campaignToStartParticipation.id,
          isImproved: true,
        });
        const expectedAttributes = {
          id: 10,
          participantExternalId: 'something',
          validatedSkillsCount: 1,
          status: 'SHARED',
          isDeleted: true,
        };
        databaseBuilder.factory.buildCampaignParticipation({
          id: 10,
          participantExternalId: 'something',
          validatedSkillsCount: 1,
          status: 'SHARED',
          deletedAt: new Date(),
          userId,
          campaignId: campaignToStartParticipation.id,
        });

        await databaseBuilder.commit();

        const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          return campaignParticipantRepository.get({
            userId,
            campaignId: campaignToStartParticipation.id,
            domainTransaction,
          });
        });

        expect(campaignParticipant.previousCampaignParticipationForUser).to.deep.equal(expectedAttributes);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is no previous campaign participation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return null', async function () {
        const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({
          organizationId,
          idPixLabel: 'externalId',
        });
        const { id: userId } = databaseBuilder.factory.buildUser();

        await databaseBuilder.commit();

        const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          return campaignParticipantRepository.get({
            userId,
            campaignId: campaignToStartParticipation.id,
            domainTransaction,
          });
        });

        expect(campaignParticipant.previousCampaignParticipationForUser).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is one organization learner', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('find the organization learner', async function () {
        const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({ organizationId });
        const { id: userId } = databaseBuilder.factory.buildUser();
        const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
          userId,
          organizationId,
        });

        await databaseBuilder.commit();

        const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          return campaignParticipantRepository.get({
            userId,
            campaignId: campaignToStartParticipation.id,
            domainTransaction,
          });
        });

        expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
        expect(campaignParticipant.organizationLearnerHasParticipatedForAnotherUser).to.equal(false);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('find only organization learner which is not disabled', async function () {
        const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({ organizationId });
        const { id: userId } = databaseBuilder.factory.buildUser();
        databaseBuilder.factory.buildOrganizationLearner({
          userId,
          organizationId,
          isDisabled: true,
        });

        await databaseBuilder.commit();

        const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          return campaignParticipantRepository.get({
            userId,
            campaignId: campaignToStartParticipation.id,
            domainTransaction,
          });
        });

        expect(campaignParticipant.organizationLearnerId).to.equal(null);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the organization learner has already participated', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the participation associated to the same user', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('returns false for organizationLearnerHasParticipatedForAnotherUser', async function () {
            const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({
              organizationId,
            });
            const { id: userId } = databaseBuilder.factory.buildUser();
            const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
              userId,
              organizationId,
            });
            databaseBuilder.factory.buildCampaignParticipation({
              organizationLearnerId,
              campaignId: campaignToStartParticipation.id,
              organizationId,
              userId,
            });

            await databaseBuilder.commit();

            const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
              return campaignParticipantRepository.get({
                userId,
                campaignId: campaignToStartParticipation.id,
                domainTransaction,
              });
            });

            expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
            expect(campaignParticipant.organizationLearnerHasParticipatedForAnotherUser).to.equal(false);
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when there is participation for another campaign', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('returns organization learner id', async function () {
              const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({ organizationId });
              const { id: userId } = databaseBuilder.factory.buildUser();
              const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
                userId,
                organizationId,
              });
              databaseBuilder.factory.buildCampaignParticipation({
                organizationLearnerId,
                organizationId,
              });

              await databaseBuilder.commit();

              const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
                return campaignParticipantRepository.get({
                  userId,
                  campaignId: campaignToStartParticipation.id,
                  domainTransaction,
                });
              });

              expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
              expect(campaignParticipant.organizationLearnerHasParticipatedForAnotherUser).to.equal(false);
            });
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the participation associated to another user', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('takes into account the participation', async function () {
            const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({ organizationId });
            const { id: userId } = databaseBuilder.factory.buildUser();
            const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
              userId,
              organizationId,
            });
            databaseBuilder.factory.buildCampaignParticipation({
              organizationLearnerId,
              campaignId: campaignToStartParticipation.id,
              organizationId,
            });

            await databaseBuilder.commit();

            const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
              return campaignParticipantRepository.get({
                userId,
                campaignId: campaignToStartParticipation.id,
                domainTransaction,
              });
            });

            expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
            expect(campaignParticipant.organizationLearnerHasParticipatedForAnotherUser).to.equal(true);
          });

          // @ts-expect-error TS(2304): Cannot find name 'context'.
          context('when the participation is deleted', function () {
            // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
            it('does not take into account the participation', async function () {
              const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({ organizationId });
              const { id: userId } = databaseBuilder.factory.buildUser();
              const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
                userId,
                organizationId,
              });
              databaseBuilder.factory.buildCampaignParticipation({
                organizationLearnerId,
                campaignId: campaignToStartParticipation.id,
                organizationId,
                deletedAt: new Date('2020-01-01'),
                deletedBy: userId,
              });

              await databaseBuilder.commit();

              const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
                return campaignParticipantRepository.get({
                  userId,
                  campaignId: campaignToStartParticipation.id,
                  domainTransaction,
                });
              });

              expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
              expect(campaignParticipant.organizationLearnerHasParticipatedForAnotherUser).to.equal(false);
            });

            // @ts-expect-error TS(2304): Cannot find name 'context'.
            context('when there are several previous participations', function () {
              // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
              it('does not take into account participations', async function () {
                const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({
                  multipleSendings: true,
                  organizationId,
                });
                const { id: userId } = databaseBuilder.factory.buildUser();
                const { id: otherUser } = databaseBuilder.factory.buildUser();
                const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
                  userId,
                  organizationId,
                });
                databaseBuilder.factory.buildCampaignParticipation({
                  organizationLearnerId,
                  campaignId: campaignToStartParticipation.id,
                  organizationId,
                  userId: otherUser,
                  isImproved: true,
                  deletedBy: otherUser,
                });
                databaseBuilder.factory.buildCampaignParticipation({
                  organizationLearnerId,
                  campaignId: campaignToStartParticipation.id,
                  organizationId,
                  userId: otherUser,
                  deletedAt: new Date('2020-01-01'),
                  deletedBy: otherUser,
                });

                await databaseBuilder.commit();

                const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
                  return campaignParticipantRepository.get({
                    userId,
                    campaignId: campaignToStartParticipation.id,
                    domainTransaction,
                  });
                });

                expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
                expect(campaignParticipant.organizationLearnerHasParticipatedForAnotherUser).to.equal(false);
              });
            });
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are several organization learners', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are several organization Learners for the same user', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('find the organizationLearnerId for the correct organization', async function () {
          const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({ organizationId });
          const { id: userId } = databaseBuilder.factory.buildUser();
          databaseBuilder.factory.buildOrganizationLearner({
            userId,
          });
          const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
            userId,
            organizationId,
          });

          await databaseBuilder.commit();

          const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
            return campaignParticipantRepository.get({
              userId,
              campaignId: campaignToStartParticipation.id,
              domainTransaction,
            });
          });

          expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when there are several organization learners for the same organization', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('find the organizationLearnerId for the correct user', async function () {
          const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile({ organizationId });
          const { id: userId } = databaseBuilder.factory.buildUser();
          databaseBuilder.factory.buildOrganizationLearner({
            organizationId,
          });
          const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
            userId,
            organizationId,
          });

          await databaseBuilder.commit();

          const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
            return campaignParticipantRepository.get({
              userId,
              campaignId: campaignToStartParticipation.id,
              domainTransaction,
            });
          });

          expect(campaignParticipant.organizationLearnerId).to.equal(organizationLearnerId);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is one campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('find campaign with operative skills', async function () {
        const learningContent = {
          skills: [
            { id: 'skill1', status: 'actif' },
            { id: 'skill2', status: 'archivé' },
            { id: 'skill3', status: 'inactif' },
          ],
        };

        mockLearningContent(learningContent);
        const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile(
          {
            idPixLabel: 'email',
            type: 'ASSESSMENT',
            isRestricted: true,
            archivedAt: new Date('2022-01-01'),
            assessmentMethod: 'SMART_RANDOM',
            skillCount: 1,
          },
          ['skill1']
        );
        const { id: userId } = databaseBuilder.factory.buildUser();

        await databaseBuilder.commit();

        const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          return campaignParticipantRepository.get({
            userId,
            campaignId: campaignToStartParticipation.id,
            domainTransaction,
          });
        });

        expect(campaignParticipant.campaignToStartParticipation).to.deep.equal(campaignToStartParticipation);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are several campaigns', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('find skills for the correct campaign', async function () {
        const learningContent = {
          skills: [
            { id: 'skill1', status: 'actif' },
            { id: 'skill2', status: 'actif' },
          ],
        };

        mockLearningContent(learningContent);

        const campaignToStartParticipation = buildCampaignWithCompleteTargetProfile(
          {
            idPixLabel: 'email',
            type: 'ASSESSMENT',
            isRestricted: true,
            archivedAt: new Date('2022-01-01'),
            assessmentMethod: 'SMART_RANDOM',
            skillCount: 1,
          },
          ['skill1']
        );
        buildCampaignWithCompleteTargetProfile(
          {
            idPixLabel: 'id',
            type: 'ASSESSMENT',
            isRestricted: false,
            archivedAt: new Date('2022-01-02'),
            assessmentMethod: 'SMART_RANDOM',
            skillCount: 1,
          },
          ['skill2']
        );
        const { id: userId } = databaseBuilder.factory.buildUser();

        await databaseBuilder.commit();

        const campaignParticipant = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          return campaignParticipantRepository.get({
            userId,
            campaignId: campaignToStartParticipation.id,
            domainTransaction,
          });
        });

        expect(campaignParticipant.campaignToStartParticipation).to.deep.equal(campaignToStartParticipation);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error when the campaign does not exist', async function () {
      const { id: userId } = databaseBuilder.factory.buildUser();

      await databaseBuilder.commit();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(() => {
        return DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
          await campaignParticipantRepository.get({
            userId,
            campaignId: 12,
            domainTransaction,
          });
        });
      })();

      expect(error).to.be.an.instanceof(NotFoundError);
      expect((error as $TSFixMe).message).to.equal("La campagne d'id 12 n'existe pas ou son accès est restreint");
    });
  });
});

function getExpectedCampaignParticipation(campaignParticipationId: $TSFixMe, campaignParticipant: $TSFixMe) {
  return {
    ...pick(campaignParticipant.campaignParticipation, [
      'id',
      'campaignId',
      'userId',
      'status',
      'organizationLearnerId',
      'participantExternalId',
    ]),
    id: campaignParticipationId,
  };
}

function getExpectedAssessment(campaignParticipationId: $TSFixMe, campaignParticipant: $TSFixMe) {
  return {
    ...pick(campaignParticipant.assessment, assessmentAttributes),
    campaignParticipationId,
  };
}

async function makeCampaignParticipant({
  campaignAttributes,
  userIdentity,
  organizationLearnerId,
  participantExternalId
}: $TSFixMe) {
  const campaign = databaseBuilder.factory.buildCampaign(campaignAttributes);

  await databaseBuilder.commit();

  const campaignToStartParticipation = new CampaignToStartParticipation(campaign);
  const organizationLearner = {
    id: organizationLearnerId,
    hasParticipated: false,
  };
  const campaignParticipant = new CampaignParticipant({
    campaignToStartParticipation,
    organizationLearner,
    userIdentity,
    previousCampaignParticipationForUser: null,
  });

  campaignParticipant.start({ participantExternalId });
  return campaignParticipant;
}

function buildCampaignWithCompleteTargetProfile(attributes: $TSFixMe, skills = ['skill1']) {
  const { id: organizationId } = databaseBuilder.factory.buildOrganization({
    isManagingStudents: attributes.isRestricted,
    id: attributes.organizationId,
  });
  const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
  skills.forEach((skillId) => {
    databaseBuilder.factory.buildTargetProfileSkill({ skillId, targetProfileId });
  });
  const campaign = databaseBuilder.factory.buildCampaign({
    ...attributes,
    organizationId,
    targetProfileId,
  });

  return new CampaignToStartParticipation({ ...campaign, ...attributes });
}
