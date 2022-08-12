// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../../../../lib/domain/models/CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ArchivedCa... Remove this comment to see the full error message
  ArchivedCampaignError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
  AssessmentNotCompletedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadySha... Remove this comment to see the full error message
  AlreadySharedCampaignParticipationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CantImprov... Remove this comment to see the full error message
  CantImproveCampaignParticipationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
  CampaignParticipationDeletedError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TO_SHARE'.
const { TO_SHARE, SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignParticipation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getTargetProfileId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the targetProfileId from campaign associated', function () {
      // given
      const campaign = domainBuilder.buildCampaign.ofTypeAssessment();
      const campaignParticipation = new CampaignParticipation({
        id: 1,
        campaign,
        assessmentId: 1,
      });

      // when
      const targetProfileId = campaignParticipation.getTargetProfileId();

      // then
      expect(targetProfileId).to.equal(campaign.targetProfile.id);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return null if has not campaign', function () {
      // given
      const campaignParticipation = new CampaignParticipation({
        id: 1,
        campaign: null,
        assessmentId: 1,
      });

      // when
      const targetProfileId = campaignParticipation.getTargetProfileId();

      // then
      expect(targetProfileId).to.equal(null);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('lastAssessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should retrieve the last assessment by creation date', function () {
      const campaignParticipation = new CampaignParticipation({
        assessments: [
          { createdAt: new Date('2010-10-02') },
          { createdAt: new Date('2010-10-06') },
          { createdAt: new Date('2010-10-04') },
        ],
      });
      expect(campaignParticipation.lastAssessment).to.deep.equal({ createdAt: new Date('2010-10-06') });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('improve', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign has the type PROFILES_COLLECTION', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an CantImproveCampaignParticipationError', async function () {
        const campaign = domainBuilder.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
        const campaignParticipation = new CampaignParticipation({ campaign });

        const error = await catchErr(campaignParticipation.improve, campaignParticipation)();

        expect(error).to.be.an.instanceOf(CantImproveCampaignParticipationError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign participation status is different from STARTED', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('changes the status to STARTED', async function () {
        const campaign = domainBuilder.buildCampaign({ type: CampaignTypes.ASSESSMENT });
        const campaignParticipation = new CampaignParticipation({ campaign, status: TO_SHARE });

        campaignParticipation.improve();

        expect(campaignParticipation.status).to.equal('STARTED');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('share', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is not archived nor deleted', function () {
      let clock: $TSFixMe;
      const now = new Date('2021-09-25');

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        clock = sinon.useFakeTimers(now.getTime());
      });

      // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
      afterEach(function () {
        clock.restore();
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign is already shared', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws an AlreadySharedCampaignParticipationError error', async function () {
          const campaign = domainBuilder.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
          const campaignParticipation = new CampaignParticipation({ campaign, status: SHARED });

          const error = await catchErr(campaignParticipation.share, campaignParticipation)();

          expect(error).to.be.an.instanceOf(AlreadySharedCampaignParticipationError);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign has the type PROFILES_COLLECTION', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('share the CampaignParticipation', function () {
          const campaign = domainBuilder.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
          const campaignParticipation = new CampaignParticipation({ campaign });

          campaignParticipation.share();

          expect(campaignParticipation.isShared).to.be.true;
          expect(campaignParticipation.sharedAt).to.deep.equals(now);
          expect(campaignParticipation.status).to.equals(CampaignParticipationStatuses.SHARED);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign as the type ASSESSMENT', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when there is no assessment', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an AssessmentNotCompletedError', async function () {
            const campaign = domainBuilder.buildCampaign({ type: CampaignTypes.ASSESSMENT });
            const campaignParticipation = new CampaignParticipation({ campaign, assessments: [] });

            const error = await catchErr(campaignParticipation.share, campaignParticipation)();

            expect(error).to.be.an.instanceOf(AssessmentNotCompletedError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the last assessment is not completed', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('throws an AssessmentNotCompletedError', async function () {
            const campaign = domainBuilder.buildCampaign({ type: CampaignTypes.ASSESSMENT });
            const assessments = [
              domainBuilder.buildAssessment({ createdAt: new Date('2020-01-01'), state: Assessment.states.COMPLETED }),
              domainBuilder.buildAssessment({ createdAt: new Date('2020-01-02'), state: Assessment.states.STARTED }),
            ];
            const campaignParticipation = new CampaignParticipation({ campaign, assessments });

            const error = await catchErr(campaignParticipation.share, campaignParticipation)();

            expect(error).to.be.an.instanceOf(AssessmentNotCompletedError);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when the last assessment is completed', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('share the CampaignParticipation', function () {
            const campaign = domainBuilder.buildCampaign({ type: CampaignTypes.ASSESSMENT });
            const assessments = [
              domainBuilder.buildAssessment({ createdAt: new Date('2020-03-01'), state: Assessment.states.COMPLETED }),
              domainBuilder.buildAssessment({ createdAt: new Date('2020-01-01'), state: Assessment.states.STARTED }),
            ];
            const campaignParticipation = new CampaignParticipation({ campaign, assessments });

            campaignParticipation.share();

            expect(campaignParticipation.isShared).to.be.true;
            expect(campaignParticipation.sharedAt).to.deep.equals(now);
            expect(campaignParticipation.status).to.equals(CampaignParticipationStatuses.SHARED);
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is archived', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws an ArchivedCampaignError error', async function () {
        const campaign = domainBuilder.buildCampaign({ archivedAt: new Date() });
        const campaignParticipation = new CampaignParticipation({ campaign });

        const error = await catchErr(campaignParticipation.share, campaignParticipation)();

        expect(error).to.be.an.instanceOf(ArchivedCampaignError);
        expect((error as $TSFixMe).message).to.equals('Cannot share results on an archived campaign.');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the participation is deleted', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a CampaignParticipationDeletedError', async function () {
        const campaign = domainBuilder.buildCampaign();
        const campaignParticipation = new CampaignParticipation({ campaign, deletedAt: new Date() });

        const error = await catchErr(campaignParticipation.share, campaignParticipation)();

        expect(error).to.be.an.instanceOf(CampaignParticipationDeletedError);
        expect((error as $TSFixMe).message).to.equals('Cannot share results on a deleted participation.');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#start', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an instance of CampaignParticipation', function () {
      const campaign = domainBuilder.buildCampaignToJoin();
      const campaignParticipation = CampaignParticipation.start({ campaign });

      expect(campaignParticipation instanceof CampaignParticipation).to.be.true;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('organizationLearnerId', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('it should set organizationLearnerId', function () {
        const organizationLearnerId = 1;
        const campaign = domainBuilder.buildCampaignToJoin();
        const campaignParticipation = CampaignParticipation.start({ campaign, organizationLearnerId });

        expect(campaignParticipation.organizationLearnerId).to.be.equal(organizationLearnerId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('it should set organizationLearnerId to null if it is not provided', function () {
        const campaign = domainBuilder.buildCampaignToJoin();
        const campaignParticipation = CampaignParticipation.start({ campaign });

        expect(campaignParticipation.organizationLearnerId).to.be.equal(null);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('status', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign as the type PROFILES_COLLECTION', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('status to TO_SHARE', function () {
          const campaign = domainBuilder.buildCampaignToJoin({ type: CampaignTypes.PROFILES_COLLECTION });
          const campaignParticipation = CampaignParticipation.start({ campaign });

          expect(campaignParticipation.status).to.be.equal(CampaignParticipationStatuses.TO_SHARE);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the campaign as the type ASSESSMENT', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('status to STARTED', function () {
          const campaign = domainBuilder.buildCampaignToJoin({ type: CampaignTypes.ASSESSMENT });
          const campaignParticipation = CampaignParticipation.start({ campaign });

          expect(campaignParticipation.status).to.be.equal(CampaignParticipationStatuses.STARTED);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('delete', function () {
    let clock: $TSFixMe;
    const now = new Date('2021-09-25');

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      clock = sinon.useFakeTimers(now.getTime());
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      clock.restore();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates attributes deletedAt and deletedBy', function () {
      const userId = 4567;
      const campaignParticipation = new CampaignParticipation({ deletedAt: null, deletedBy: null });

      campaignParticipation.delete(userId);

      expect(campaignParticipation.deletedAt).to.deep.equal(now);
      expect(campaignParticipation.deletedBy).to.deep.equal(userId);
    });
  });
});
