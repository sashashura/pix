// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, knex, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Campaign'.
const Campaign = require('../../../../lib/domain/models/Campaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'STARTED'.
const { STARTED, SHARED, TO_SHARE } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Campaign Participation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasAssessmentParticipations', function () {
    let userId: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if the user has participations to campaigns of type assement', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId,
      });
      await databaseBuilder.commit();

      // when
      const result = await campaignParticipationRepository.hasAssessmentParticipations(userId);

      // then
      expect(result).to.equal(true);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the user does not have participations', async function () {
      // given
      const otherUser = databaseBuilder.factory.buildUser();
      const campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.ASSESSMENT });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId: otherUser.id,
      });
      await databaseBuilder.commit();

      // when
      const result = await campaignParticipationRepository.hasAssessmentParticipations(userId);

      // then
      expect(result).to.equal(false);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if the user does not have participations to campaigns of type assement', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        userId,
      });
      await databaseBuilder.commit();

      // when
      const result = await campaignParticipationRepository.hasAssessmentParticipations(userId);

      // then
      expect(result).to.equal(false);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCodeOfLastParticipationToProfilesCollectionCampaignForUser', function () {
    let userId: $TSFixMe;
    const expectedCode = 'GOOD';
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no participations', async function () {
      // when
      const code = await campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(
        userId
      );

      // then
      expect(code).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no participations to share', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ type: 'PROFILES_COLLECTION' });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: SHARED,
        userId,
      });
      await databaseBuilder.commit();

      // when
      const code = await campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(
        userId
      );

      // then
      expect(code).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if participations are deleted', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ type: 'PROFILES_COLLECTION' });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: TO_SHARE,
        deletedAt: new Date(),
        userId,
      });
      await databaseBuilder.commit();

      // when
      const code = await campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(
        userId
      );

      // then
      expect(code).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no campaigns of type profiles collection', async function () {
      const campaign = databaseBuilder.factory.buildCampaign({ type: 'ASSESSMENT' });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: TO_SHARE,
        userId,
      });
      await databaseBuilder.commit();

      // when
      const code = await campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(
        userId
      );

      // then
      expect(code).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if there is no participations for the user', async function () {
      const otherUser = databaseBuilder.factory.buildUser();
      const campaign = databaseBuilder.factory.buildCampaign({ type: 'PROFILES_COLLECTION' });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: TO_SHARE,
        userId: otherUser.id,
      });
      await databaseBuilder.commit();

      // when
      const code = await campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(
        userId
      );

      // then
      expect(code).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if campaign is archived', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ type: 'PROFILES_COLLECTION', archivedAt: new Date() });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: TO_SHARE,
        userId,
        createdAt: new Date(),
      });
      await databaseBuilder.commit();

      // when
      const code = await campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(
        userId
      );

      // then
      expect(code).to.equal(null);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return code of the last participation to a campaign of type PROFILES_COLLECTION for the user', async function () {
      // given
      const campaign = databaseBuilder.factory.buildCampaign({ type: 'PROFILES_COLLECTION', code: expectedCode });
      const otherCampaign = databaseBuilder.factory.buildCampaign({ type: 'PROFILES_COLLECTION', code: 'BAD' });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: otherCampaign.id,
        status: TO_SHARE,
        createdAt: new Date(Date.parse('11/11/2011')),
        userId,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
        status: TO_SHARE,
        userId,
        createdAt: new Date(Date.parse('12/11/2011')),
      });
      await databaseBuilder.commit();

      // when
      const code = await campaignParticipationRepository.getCodeOfLastParticipationToProfilesCollectionCampaignForUser(
        userId
      );

      // then
      expect(code).to.equal(expectedCode);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let campaignId: $TSFixMe;
    let campaignParticipationId: $TSFixMe, campaignParticipationNotSharedId: $TSFixMe;
    let campaignParticipationAssessments: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignId = databaseBuilder.factory.buildCampaign({}).id;
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        validatedSkillsCount: 12,
      }).id;
      campaignParticipationNotSharedId = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        status: STARTED,
        sharedAt: null,
      }).id;

      const assessment1 = databaseBuilder.factory.buildAssessment({
        type: 'CAMPAIGN',
        campaignParticipationId,
        createdAt: new Date('2000-01-01T10:00:00Z'),
      });

      const assessment2 = databaseBuilder.factory.buildAssessment({
        type: 'CAMPAIGN',
        campaignParticipationId,
        createdAt: new Date('2000-03-01T10:00:00Z'),
      });

      databaseBuilder.factory.buildAssessment({
        type: 'CAMPAIGN',
        campaignParticipationId: campaignParticipationNotSharedId,
        createdAt: new Date('2000-02-01T10:00:00Z'),
      });

      campaignParticipationAssessments = [assessment1, assessment2];

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a campaign participation object', async function () {
      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

      // then
      expect(foundCampaignParticipation.id).to.equal(campaignParticipationId);
      expect(foundCampaignParticipation.validatedSkillsCount).to.equal(12);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a null object for sharedAt when the campaign-participation is not shared', async function () {
      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationNotSharedId);

      // then
      expect(foundCampaignParticipation.sharedAt).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the assessments of campaignParticipation', async function () {
      //given
      const expectedAssessmentIds = campaignParticipationAssessments.map(({
        id
      }: $TSFixMe) => id);

      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);
      const assessmentIds = foundCampaignParticipation.assessments.map(({
        id
      }: $TSFixMe) => id);

      // then
      expect(assessmentIds).to.exactlyContain(expectedAssessmentIds);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the campaign of campaignParticipation', async function () {
      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

      // then
      expect(foundCampaignParticipation.campaign.id).to.equal(campaignId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the assessments of campaignParticipation using the transaction', async function () {
      //given
      const expectedAssessmentIds = campaignParticipationAssessments.map(({
        id
      }: $TSFixMe) => id);

      // when
      const foundCampaignParticipation = await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
        return campaignParticipationRepository.get(campaignParticipationId, domainTransaction);
      });
      const assessmentIds = foundCampaignParticipation.assessments.map(({
        id
      }: $TSFixMe) => id);

      // then
      expect(assessmentIds).to.exactlyContain(expectedAssessmentIds);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('save the changes of the campaignParticipation', async function () {
      const campaignParticipationId = 12;
      const campaignParticipationToUpdate = databaseBuilder.factory.buildCampaignParticipation({
        id: campaignParticipationId,
        status: STARTED,
        sharedAt: null,
        validatedSkillsCount: null,
      });

      await databaseBuilder.commit();

      await campaignParticipationRepository.update({
        ...campaignParticipationToUpdate,
        sharedAt: new Date('2021-01-01'),
        status: SHARED,
        validatedSkillsCount: 10,
        pixScore: 10,
        masteryRate: 0.9,
      });
      const campaignParticipation = await knex('campaign-participations')
        .where({ id: campaignParticipationId })
        .first();

      expect(campaignParticipation.sharedAt).to.deep.equals(new Date('2021-01-01'));
      expect(campaignParticipation.status).to.equals(SHARED);
      expect(campaignParticipation.validatedSkillsCount).to.equals(10);
      expect(campaignParticipation.pixScore).to.equals(10);
      expect(campaignParticipation.masteryRate).to.equals('0.90');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not update because the leaner can not have 2 active participations for the same campaign', async function () {
      const campaignId = databaseBuilder.factory.buildCampaign().id;
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ organizationLearnerId, campaignId });
      const campaignParticipationToUpdate = databaseBuilder.factory.buildCampaignParticipation({
        organizationLearnerId,
      });

      await databaseBuilder.commit();

      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(campaignParticipationRepository.update)({
        ...campaignParticipationToUpdate,
        campaignId,
      });

      expect((error as $TSFixMe).constraint).to.equals('one_active_participation_by_learner');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findProfilesCollectionResultDataByCampaignId', function () {
    let campaign1: $TSFixMe;
    let campaign2;
    let campaignParticipation1: $TSFixMe;
    let organizationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      campaign1 = databaseBuilder.factory.buildCampaign({ organizationId, type: CampaignTypes.PROFILES_COLLECTION });
      campaign2 = databaseBuilder.factory.buildCampaign({ organizationId, type: CampaignTypes.PROFILES_COLLECTION });

      campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
        { organizationId, firstName: 'Hubert', lastName: 'Parterre', division: '6emeD' },
        {
          campaignId: campaign1.id,
          createdAt: new Date('2017-03-15T14:59:35Z'),
        }
      );
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign2.id,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign-participation linked to the given campaign', async function () {
      // given
      const campaignId = campaign1.id;

      // when
      const participationResultDatas =
        await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaignId);

      // then
      const attributes = participationResultDatas.map((participationResultData: $TSFixMe) => _.pick(participationResultData, ['id', 'isShared', 'sharedAt', 'participantExternalId', 'userId'])
      );
      expect(attributes).to.deep.equal([
        {
          id: campaignParticipation1.id,
          isShared: true,
          sharedAt: campaignParticipation1.sharedAt,
          participantExternalId: campaignParticipation1.participantExternalId,
          userId: campaignParticipation1.userId,
        },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return the deleted campaign-participation linked to the given campaign', async function () {
      // given
      const campaignId = campaign1.id;
      databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
        { organizationId, firstName: 'Piere', lastName: 'Pi air', division: '6emeD' },
        {
          campaignId: campaign1.id,
          createdAt: new Date('2017-03-15T14:59:35Z'),
          deletedAt: new Date(),
        }
      );
      await databaseBuilder.commit();

      // when
      const participationResultDatas =
        await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaignId);

      // then
      const attributes = participationResultDatas.map((participationResultData: $TSFixMe) => _.pick(participationResultData, ['id', 'isShared', 'sharedAt', 'participantExternalId', 'userId'])
      );
      expect(attributes).to.deep.equal([
        {
          id: campaignParticipation1.id,
          isShared: true,
          sharedAt: campaignParticipation1.sharedAt,
          participantExternalId: campaignParticipation1.participantExternalId,
          userId: campaignParticipation1.userId,
        },
      ]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign participation with firstName and lastName from the organization learner', async function () {
      // given
      const campaignId = campaign1.id;

      // when
      const participationResultDatas =
        await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaignId);

      // then
      const attributes = participationResultDatas.map((participationResultData: $TSFixMe) => _.pick(participationResultData, ['participantFirstName', 'participantLastName', 'division'])
      );
      expect(attributes).to.deep.equal([
        {
          participantFirstName: 'Hubert',
          participantLastName: 'Parterre',
          division: '6emeD',
        },
      ]);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a participant has several organization-learners for different organizations', function () {
      let campaign: $TSFixMe;
      let otherCampaign;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        campaign = databaseBuilder.factory.buildCampaign({ organizationId });
        otherCampaign = databaseBuilder.factory.buildCampaign({ organizationId });
        const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
          organizationId,
          division: '3eme',
        }).id;
        const otherOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
          organizationId: otherOrganizationId,
          division: '2nd',
        }).id;
        databaseBuilder.factory.buildCampaignParticipation({ campaignId: campaign.id, organizationLearnerId });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaign.id,
          organizationLearnerId,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaign.id,
          organizationLearnerId: otherOrganizationLearnerId,
        });

        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the division of the school registration linked to the campaign', async function () {
        const campaignParticipationInfos =
          await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaign.id);

        expect(campaignParticipationInfos.length).to.equal(1);
        expect(campaignParticipationInfos[0].division).to.equal('3eme');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the participant has improved its participation', function () {
      let campaignId: $TSFixMe, improvedCampaignParticipation: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaignId = databaseBuilder.factory.buildCampaign({
          type: CampaignTypes.PROFILES_COLLECTION,
          multipleSendings: true,
        }).id;

        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId,
          createdAt: new Date('2016-01-15T14:59:35Z'),
          isImproved: true,
        });
        improvedCampaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaignId,
          createdAt: new Date('2016-07-15T14:59:35Z'),
          isImproved: false,
        });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the non improved campaign-participation', async function () {
        const participationResultDatas =
          await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaignId);

        expect(participationResultDatas.length).to.eq(1);
        expect(participationResultDatas[0].id).to.eq(improvedCampaignParticipation.id);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When sharedAt is null', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('Should return null as shared date', async function () {
        // given
        const campaign = databaseBuilder.factory.buildCampaign({ sharedAt: null });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          status: STARTED,
          sharedAt: null,
        });

        await databaseBuilder.commit();

        // when
        const participationResultDatas =
          await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaign.id);

        // then
        expect(participationResultDatas[0].sharedAt).to.equal(null);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findLatestOngoingByUserId', function () {
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve the most recent campaign participations where the campaign is not archived', async function () {
      const campaignId = databaseBuilder.factory.buildCampaign({
        createdAt: new Date('2000-01-01T10:00:00Z'),
        archivedAt: null,
      }).id;
      const moreRecentCampaignId = databaseBuilder.factory.buildCampaign({
        createdAt: new Date('2000-02-01T10:00:00Z'),
        archivedAt: null,
      }).id;
      const mostRecentButArchivedCampaignId = databaseBuilder.factory.buildCampaign({
        createdAt: new Date('2001-03-01T10:00:00Z'),
        archivedAt: new Date('2000-09-01T10:00:00Z'),
      }).id;

      databaseBuilder.factory.buildCampaignParticipation({
        userId,
        createdAt: new Date('2000-04-01T10:00:00Z'),
        campaignId: moreRecentCampaignId,
      });
      const expectedCampaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
        userId,
        createdAt: new Date('2000-07-01T10:00:00Z'),
        campaignId,
      }).id;
      databaseBuilder.factory.buildCampaignParticipation({
        userId,
        createdAt: new Date('2001-08-01T10:00:00Z'),
        campaignId: mostRecentButArchivedCampaignId,
      });

      databaseBuilder.factory.buildAssessment({ userId, campaignParticipationId: expectedCampaignParticipationId });
      databaseBuilder.factory.buildAssessment({ userId, campaignParticipationId: expectedCampaignParticipationId });

      await databaseBuilder.commit();

      const latestCampaignParticipations = await campaignParticipationRepository.findLatestOngoingByUserId(userId);
      const [latestCampaignParticipation1, latestCampaignParticipation2] = latestCampaignParticipations;

      expect(latestCampaignParticipation1.createdAt).to.deep.equal(new Date('2000-07-01T10:00:00Z'));
      expect(latestCampaignParticipation2.createdAt).to.deep.equal(new Date('2000-04-01T10:00:00Z'));
      expect(latestCampaignParticipation1.assessments).to.be.instanceOf(Array);
      expect(latestCampaignParticipation1.campaign).to.be.instanceOf(Campaign);
      expect(latestCampaignParticipations).to.have.lengthOf(2);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOneByCampaignIdAndUserId', function () {
    let userId: $TSFixMe;
    let campaignId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      const otherUserId = databaseBuilder.factory.buildUser().id;

      campaignId = databaseBuilder.factory.buildCampaign().id;
      const otherCampaignId = databaseBuilder.factory.buildCampaign().id;

      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId: otherUserId,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: otherCampaignId,
        userId,
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign participation found', async function () {
      // given
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
      });
      await databaseBuilder.commit();

      // when
      const response = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

      // then
      expect(response).to.be.instanceOf(CampaignParticipation);
      expect(response.id).to.equal(campaignParticipation.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the non improved campaign participation found', async function () {
      // given
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
        isImproved: true,
      });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
      });

      await databaseBuilder.commit();

      // when
      const response = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

      // then
      expect(response).to.be.instanceOf(CampaignParticipation);
      expect(response.id).to.equal(campaignParticipation.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include assessments found too', async function () {
      // given
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
      });
      const assessment = databaseBuilder.factory.buildAssessment({ campaignParticipationId: campaignParticipation.id });
      await databaseBuilder.commit();

      // when
      const response = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

      // then
      expect(response.assessments).to.have.lengthOf(1);
      expect(response.assessments[0]).to.be.instanceOf(Assessment);
      expect(response.assessments[0].id).to.equal(assessment.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return no campaign participation', async function () {
      // when
      const response = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

      // then
      expect(response).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateWithSnapshot', function () {
    let clock: $TSFixMe;
    let campaignParticipation: $TSFixMe;
    const frozenTime = new Date('1987-09-01T00:00:00Z');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        status: STARTED,
        sharedAt: null,
      });

      databaseBuilder.factory.buildKnowledgeElement({
        userId: campaignParticipation.userId,
        createdAt: new Date('1985-09-01T00:00:00Z'),
      });
      clock = sinon.useFakeTimers(frozenTime);

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
      return knex('knowledge-element-snapshots').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('persists the campaign-participation changes', async function () {
      // given
      campaignParticipation.campaign = {};
      campaignParticipation.assessments = [];
      campaignParticipation.user = {};
      campaignParticipation.assessmentId = {};
      campaignParticipation.isShared = true;
      campaignParticipation.status = SHARED;
      campaignParticipation.participantExternalId = 'Laura';

      // when
      await campaignParticipationRepository.updateWithSnapshot(campaignParticipation);

      const updatedCampaignParticipation = await knex('campaign-participations')
        .where({ id: campaignParticipation.id })
        .first();
      // then
      expect(updatedCampaignParticipation.status).to.equals(SHARED);
      expect(updatedCampaignParticipation.participantExternalId).to.equals('Laura');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save a snapshot', async function () {
      // given
      campaignParticipation.sharedAt = new Date();

      // when
      await campaignParticipationRepository.updateWithSnapshot(campaignParticipation);

      // then
      const snapshotInDB = await knex.select('id').from('knowledge-element-snapshots');
      expect(snapshotInDB).to.have.length(1);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is a transaction', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save a snapshot using a transaction', async function () {
        campaignParticipation.sharedAt = new Date();

        await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return campaignParticipationRepository.updateWithSnapshot(campaignParticipation, domainTransaction);
        });

        const snapshotInDB = await knex.select('id').from('knowledge-element-snapshots');
        expect(snapshotInDB).to.have.length(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not save a snapshot when there is an error', async function () {
        campaignParticipation.sharedAt = new Date();

        try {
          await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
            await campaignParticipationRepository.updateWithSnapshot(campaignParticipation, domainTransaction);
            throw new Error();
          });
          // eslint-disable-next-line no-empty
        } catch (error) {}

        const snapshotInDB = await knex.select('id').from('knowledge-element-snapshots');
        const participations = await knex.select('sharedAt').from('campaign-participations');
        expect(participations.sharedAt).to.be.undefined;
        expect(snapshotInDB).to.be.empty;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isRetrying', function () {
    let campaignId: $TSFixMe;
    let campaignParticipationId: $TSFixMe;
    let userId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser().id;
      campaignId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user has just one participation shared', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: false,
          sharedAt: new Date('2002-10-10'),
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user has just one participation not shared', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: false,
          sharedAt: null,
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user has several participations but all shared', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: true,
          sharedAt: new Date('2002-10-10'),
        });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: false,
          sharedAt: new Date('2002-10-10'),
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user has several participations but not in the same campaign', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const otherCampaignId = databaseBuilder.factory.buildCampaign().id;
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaignId,
          userId,
          isImproved: true,
          sharedAt: new Date('2002-10-10'),
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaignId,
          userId,
          isImproved: false,
          sharedAt: null,
        });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: false,
          sharedAt: null,
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When there is several participations but not for the same user', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const otherUserId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId: otherUserId,
          isImproved: true,
          sharedAt: new Date('2002-10-10'),
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId: otherUserId,
          isImproved: false,
          sharedAt: null,
        });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: false,
          sharedAt: null,
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', async function () {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user is retrying the campaign', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: true,
          sharedAt: new Date('2002-10-10'),
        });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          userId,
          isImproved: false,
          sharedAt: null,
        }).id;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', async function () {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#countParticipationsByStage', function () {
    let campaignId: $TSFixMe;

    const stagesBoundaries = [
      { id: 1, from: 0, to: 4 },
      { id: 2, from: 5, to: 9 },
      { id: 3, from: 10, to: 19 },
    ];

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      campaignId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns an empty object when no participations', async function () {
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({});
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the distribution for the campaign', async function () {
      databaseBuilder.factory.buildCampaignParticipation({ masteryRate: 0 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0 });
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({ 1: 1, 2: 0, 3: 0 });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the distribution for only isImproved=false participations', async function () {
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0, isImproved: false });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0, isImproved: true });
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({ 1: 1, 2: 0, 3: 0 });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the distribution for not deleted participations', async function () {
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0, deletedAt: null });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        masteryRate: 0,
        deletedAt: new Date('2019-03-13'),
      });
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({ 1: 1, 2: 0, 3: 0 });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the distribution of participations by stage', async function () {
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.05 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.06 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.1 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.12 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, masteryRate: 0.19 });
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({ 1: 1, 2: 2, 3: 3 });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#countParticipationsByStatus', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('For assessment campaign', function () {
      let campaignId: $TSFixMe;
      let campaignType: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const campaign = databaseBuilder.factory.buildCampaign();
        campaignId = campaign.id;
        campaignType = campaign.type;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns a default object when no participations', async function () {
        await databaseBuilder.commit();

        const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

        expect(result).to.deep.equal({ started: 0, completed: 0, shared: 0 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should not count any participation regardless of it's status when participation is deleted ", async function () {
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: SHARED, deletedAt: '2022-03-17' });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: TO_SHARE, deletedAt: '2022-03-17' });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: STARTED, deletedAt: '2022-03-17' });
        await databaseBuilder.commit();

        const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

        expect(result).to.deep.equal({ started: 0, completed: 0, shared: 0 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('Count shared Participation', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts participations shared', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: SHARED });
          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ started: 0, completed: 0, shared: 1 });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts the last participation shared by user', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ campaignId, isImproved: true });
          databaseBuilder.factory.buildCampaignParticipation({ campaignId });
          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ started: 0, completed: 0, shared: 1 });
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('Count completed Participation', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts participations completed', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ status: TO_SHARE });
          databaseBuilder.factory.buildCampaignParticipation({
            campaignId,
            status: TO_SHARE,
          });

          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ started: 0, completed: 1, shared: 0 });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts the last participations completed by user', async function () {
          databaseBuilder.factory.buildCampaignParticipation({
            campaignId,
            status: TO_SHARE,
            isImproved: true,
          });
          databaseBuilder.factory.buildCampaignParticipation({
            campaignId,
            status: TO_SHARE,
          });

          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ started: 0, completed: 1, shared: 0 });
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('Count started Participation', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts participations started', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ status: STARTED });
          databaseBuilder.factory.buildCampaignParticipation({
            campaignId,
            status: STARTED,
          });

          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ started: 1, completed: 0, shared: 0 });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts the last participation started by user', async function () {
          databaseBuilder.factory.buildCampaignParticipation({
            campaignId,
            status: STARTED,
            isImproved: true,
          });
          databaseBuilder.factory.buildCampaignParticipation({
            campaignId,
            status: STARTED,
          });

          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ started: 1, completed: 0, shared: 0 });
        });
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('For profile collection campaign', function () {
      let campaignId: $TSFixMe;
      let campaignType: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
        campaignId = campaign.id;
        campaignType = campaign.type;
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns a default object when no participations', async function () {
        await databaseBuilder.commit();

        const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

        expect(result).to.deep.equal({ completed: 0, shared: 0 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("should not count any participation regardless of it's status when participation is deleted ", async function () {
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: SHARED, deletedAt: '2022-03-17' });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: TO_SHARE, deletedAt: '2022-03-17' });
        await databaseBuilder.commit();

        const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

        expect(result).to.deep.equal({ completed: 0, shared: 0 });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('Count shared Participation', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts participations shared', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: SHARED });
          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ completed: 0, shared: 1 });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts the last participation shared by user', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ campaignId, isImproved: true });
          databaseBuilder.factory.buildCampaignParticipation({ campaignId });
          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ completed: 0, shared: 1 });
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
      describe('Count completed Participation', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts participations completed', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ status: TO_SHARE });
          databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: TO_SHARE });
          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ completed: 1, shared: 0 });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('counts the last participation completed by user', async function () {
          databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: TO_SHARE, isImproved: true });
          databaseBuilder.factory.buildCampaignParticipation({ campaignId, status: TO_SHARE });
          await databaseBuilder.commit();

          const result = await campaignParticipationRepository.countParticipationsByStatus(campaignId, campaignType);

          expect(result).to.deep.equal({ completed: 1, shared: 0 });
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAllCampaignParticipationsInCampaignForASameLearner', function () {
    let campaignId: $TSFixMe;
    let organizationLearnerId: $TSFixMe;
    let organizationId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      organizationId = databaseBuilder.factory.buildOrganization().id;
      campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ organizationId }).id;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the participation is not from the given campaignId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an error 400', async function () {
        const otherCampaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
        const campaignParticipationToDelete = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaignId,
          organizationLearnerId,
          status: SHARED,
          isImproved: false,
        });

        await databaseBuilder.commit();

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(async function () {
          await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
            await campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
              campaignId,
              campaignParticipationId: campaignParticipationToDelete.id,
              domainTransaction,
            });
          });
        })();
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the participant only has participations for the same campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all participations for the given campaign', async function () {
        const campaignParticipationImproved = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          status: SHARED,
          isImproved: true,
        });
        const campaignParticipationToDelete = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          status: SHARED,
          isImproved: false,
        });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId });

        await databaseBuilder.commit();

        const participations = await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
            campaignId,
            campaignParticipationId: campaignParticipationToDelete.id,
            domainTransaction,
          });
        });

        expect(participations[0]).to.be.instanceOf(CampaignParticipation);
        expect(participations[1]).to.be.instanceOf(CampaignParticipation);
        expect(participations.map((participation: $TSFixMe) => participation.id)).to.deep.equal([
          campaignParticipationImproved.id,
          campaignParticipationToDelete.id,
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the participant has deleted participations for the same campaigns', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only participations which are not deleted', async function () {
        const userId = databaseBuilder.factory.buildUser().id;
        const campaignParticipationToDelete = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
          deletedBy: userId,
          deletedAt: new Date('2021-06-07'),
        });

        await databaseBuilder.commit();

        const participations = await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
            campaignId,
            campaignParticipationId: campaignParticipationToDelete.id,
            domainTransaction,
          });
        });

        expect(participations.map((participation: $TSFixMe) => participation.id)).to.deep.equal([
          campaignParticipationToDelete.id,
        ]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the participant has participations for differents campaigns', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only participations for the given campaign', async function () {
        const otherOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
        const otherCampaignId = databaseBuilder.factory.buildCampaign().id;
        const campaignParticipationToDelete = databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          organizationLearnerId,
        });
        databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId: otherOrganizationLearnerId,
          campaignId,
        });

        databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId,
          campaignId: otherCampaignId,
        });

        await databaseBuilder.commit();

        const participations = await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
          return campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
            campaignId,
            campaignParticipationId: campaignParticipationToDelete.id,
            domainTransaction,
          });
        });

        expect(participations.map((participation: $TSFixMe) => participation.id)).to.deep.equal([
          campaignParticipationToDelete.id,
        ]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the campaign-participations with deletedAt and deletedBy attributes', async function () {
      const ownerId = databaseBuilder.factory.buildUser().id;
      const { id: campaignId } = databaseBuilder.factory.buildCampaign({ ownerId });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId });

      await databaseBuilder.commit();

      campaignParticipation.deletedAt = new Date('2022-11-01T23:00:00Z');
      campaignParticipation.deletedBy = ownerId;

      await DomainTransaction.execute((domainTransaction: $TSFixMe) => {
        return campaignParticipationRepository.delete({
          id: campaignParticipation.id,
          deletedAt: campaignParticipation.deletedAt,
          deletedBy: campaignParticipation.deletedBy,
          domainTransaction,
        });
      });

      const deletedCampaignParticipation = await knex('campaign-participations').first();

      expect(deletedCampaignParticipation.deletedAt).to.deep.equal(new Date('2022-11-01T23:00:00Z'));
      expect(deletedCampaignParticipation.deletedBy).to.deep.equal(ownerId);
    });
  });
});
