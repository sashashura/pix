// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipant = require('../../../../lib/domain/models/CampaignParticipant');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, catchErr } = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
  EntityValidationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
  ForbiddenAccess,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingCampaignParticipationError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignParticipant', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#start', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when this is an assessment campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a campaign campaign participation', function () {
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          type: 'ASSESSMENT',
          multipleSendings: true,
          idPixLabel: null,
        });
        const organizationLearnerId = 12;
        const userIdentity = { id: 13 };
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          organizationLearner: {
            id: organizationLearnerId,
            hasParticipated: false,
          },
        });
        campaignParticipant.start({ participantExternalId: null });

        expect(campaignParticipant.campaignParticipation).to.deep.include({
          campaignId: campaignToStartParticipation.id,
          status: 'STARTED',
          userId: userIdentity.id,
          organizationLearnerId,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create an assessment', function () {
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          type: 'ASSESSMENT',
          multipleSendings: true,
          idPixLabel: null,
        });
        const organizationLearnerId = 12;
        const userIdentity = { id: 13 };
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          organizationLearner: {
            id: organizationLearnerId,
            hasParticipated: false,
          },
        });
        campaignParticipant.start({ participantExternalId: null });

        expect(campaignParticipant.assessment).to.deep.include({
          courseId: '[NOT USED] Campaign Assessment CourseId Not Used',
          isImproving: false,
          method: 'SMART_RANDOM',
          state: 'started',
          type: 'CAMPAIGN',
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when campaign allows multiple participation and has a previous campaign participation', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create an assessment for improving campaign results', function () {
          const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
            type: 'ASSESSMENT',
            multipleSendings: true,
            idPixLabel: null,
            skillCount: 1,
          });
          const userIdentity = { id: 13 };
          const previousCampaignParticipationForUser = { status: 'SHARED', validatedSkillsCount: 0, id: 1 };
          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation,
            previousCampaignParticipationForUser,
            userIdentity,
            organizationLearner: {
              id: null,
              hasParticipated: false,
            },
          });
          campaignParticipant.start({ participantExternalId: null });

          expect(campaignParticipant.assessment).to.deep.include({
            courseId: '[NOT USED] Campaign Assessment CourseId Not Used',
            isImproving: true,
            method: 'SMART_RANDOM',
            state: 'started',
            type: 'CAMPAIGN',
          });
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a AlreadyExistingCampaignParticipationError exception when the participant has validated the maximum number of skills', async function () {
          const userIdentity = { id: 1 };
          const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
            type: 'ASSESSMENT',
            idPixLabel: null,
            skillCount: 2,
          });

          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation,
            userIdentity,
            previousCampaignParticipationForUser: {
              status: 'SHARED',
              validatedSkillsCount: 2,
            },
            organizationLearner: {
              id: null,
              hasParticipated: false,
            },
          });
          const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

          expect(error).to.be.an.instanceof(AlreadyExistingCampaignParticipationError);
          expect((error as $TSFixMe).message).to.equal(`User ${userIdentity.id} has already a campaign participation with campaign ${campaignToStartParticipation.id}`);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('throws a AlreadyExistingCampaignParticipationError exception when the participant has validated more than the maximum number of skills (when a skill has been deprecated)', async function () {
          const userIdentity = { id: 1 };
          const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
            type: 'ASSESSMENT',
            idPixLabel: null,
            skillCount: 2,
          });

          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation,
            userIdentity,
            previousCampaignParticipationForUser: {
              status: 'SHARED',
              validatedSkillsCount: 3,
            },
            organizationLearner: {
              id: null,
              hasParticipated: false,
            },
          });
          const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

          expect(error).to.be.an.instanceof(AlreadyExistingCampaignParticipationError);
          expect((error as $TSFixMe).message).to.equal(`User ${userIdentity.id} has already a campaign participation with campaign ${campaignToStartParticipation.id}`);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when this is a profiles collection campaign', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a campaign campaign participation', function () {
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          type: 'PROFILES_COLLECTION',
          idPixLabel: null,
          skillCount: 0,
        });
        const organizationLearnerId = 12;
        const userIdentity = { id: 13 };
        const participantExternalId = 'some participant external id';
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          organizationLearner: {
            id: organizationLearnerId,
            hasParticipated: false,
          },
        });
        campaignParticipant.start({ participantExternalId });

        expect(campaignParticipant.campaignParticipation).to.deep.include({
          campaignId: campaignToStartParticipation.id,
          status: 'TO_SHARE',
          userId: userIdentity.id,
          organizationLearnerId,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create an assessment', async function () {
        const userIdentity = { id: 13 };
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          type: 'PROFILES_COLLECTION',
          idPixLabel: null,
        });
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });
        campaignParticipant.start({ participantExternalId: null });

        expect(campaignParticipant.assessment).to.be.undefined;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when campaign allows multiple participation and has a previous campaign participation', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not throw an error when there is no validated skill count', async function () {
          const userIdentity = { id: 13 };
          const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
            type: 'PROFILES_COLLECTION',
            multipleSendings: true,
            idPixLabel: null,
          });
          const previousCampaignParticipationForUser = { status: 'SHARED', validatedSkillsCount: null, id: 1 };
          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation,
            previousCampaignParticipationForUser,
            userIdentity,
            organizationLearner: {
              id: null,
              hasParticipated: false,
            },
          });

          expect(() => campaignParticipant.start({ participantExternalId: null })).to.not.throw();
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is restricted', function () {
      let userIdentity: $TSFixMe;
      let restrictedCampaign: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userIdentity = { id: 1 };
        restrictedCampaign = domainBuilder.buildCampaignToStartParticipation({
          idPixLabel: null,
          isRestricted: true,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a ForbiddenAccess exception when the user is not in the organization trainees', async function () {
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation: restrictedCampaign,
          userIdentity,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });
        const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

        expect(error).to.be.an.instanceof(ForbiddenAccess);
        expect((error as $TSFixMe).message).to.equal("Vous n'êtes pas autorisé à rejoindre la campagne");
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('creates a new participation when the user is in the organization trainees', function () {
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation: restrictedCampaign,
          userIdentity,
          organizationLearner: {
            id: 1,
            hasParticipated: false,
          },
        });

        campaignParticipant.start({ participantExternalId: null });

        expect(campaignParticipant.campaignParticipation.campaignId).to.equal(restrictedCampaign.id);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is not restricted', function () {
      let userIdentity: $TSFixMe;
      let campaign: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userIdentity = { id: 1, firstName: 'Helene', lastName: 'Mouton' };
        campaign = domainBuilder.buildCampaignToStartParticipation({
          idPixLabel: null,
          isRestricted: false,
          organizationId: 66,
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user is not associated yet', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('creates a new organizationLearner', function () {
          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation: campaign,
            userIdentity,
            organizationLearner: {
              id: null,
              hasParticipated: false,
            },
          });

          campaignParticipant.start({ participantExternalId: null });

          expect(campaignParticipant.organizationLearner.userId).to.equal(userIdentity.id);
          expect(campaignParticipant.organizationLearner.organizationId).to.equal(campaign.organizationId);
          expect(campaignParticipant.organizationLearner.firstName).to.equal(userIdentity.firstName);
          expect(campaignParticipant.organizationLearner.lastName).to.equal(userIdentity.lastName);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the user is already associated', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('use the existing organizationLearner', function () {
          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation: campaign,
            userIdentity,
            organizationLearner: {
              id: 77,
              hasParticipated: false,
            },
          });

          campaignParticipant.start({ participantExternalId: null });

          expect(campaignParticipant.organizationLearnerId).to.equal(77);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('does not create new organizationLearner', function () {
          const campaignParticipant = new CampaignParticipant({
            campaignToStartParticipation: campaign,
            userIdentity,
            organizationLearner: {
              id: 77,
              hasParticipated: false,
            },
          });

          campaignParticipant.start({ participantExternalId: null });

          expect(campaignParticipant.organizationLearner).to.be.undefined;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign has an idPixLabel', function () {
      let campaignToStartParticipation: $TSFixMe;
      let userIdentity: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        userIdentity = { id: 1 };
        campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({ idPixLabel: 'something' });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error if participantExternalId is missing in parameters', async function () {
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });

        const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

        expect(error).instanceof(EntityValidationError);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should get participant external id from parameters', async function () {
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });

        const expectedParticipantExternalId = 'YvoLol';
        campaignParticipant.start({ participantExternalId: expectedParticipantExternalId });

        expect(campaignParticipant.campaignParticipation.participantExternalId).equal(expectedParticipantExternalId);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should get participant externalid from the previous participation', async function () {
        campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          idPixLabel: 'something',
          multipleSendings: true,
          skillCount: 1,
        });
        const expectedParticipantExternalId = 'YvoLol';
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          previousCampaignParticipationForUser: {
            status: 'SHARED',
            validatedSkillsCount: 0,
            participantExternalId: expectedParticipantExternalId,
          },
          userIdentity,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });

        campaignParticipant.start({ participantExternalId: null });

        expect(campaignParticipant.campaignParticipation.participantExternalId).equal(expectedParticipantExternalId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign allows multiple participation and has a previous campaign participation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should improve the previous campaign participation', function () {
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          multipleSendings: true,
          idPixLabel: null,
        });
        const userIdentity = { id: 13 };
        const previousCampaignParticipationForUser = { status: 'SHARED', id: 1 };
        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          previousCampaignParticipationForUser,
          userIdentity,
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });
        campaignParticipant.start({ participantExternalId: null });

        expect(campaignParticipant.previousCampaignParticipationForUser.isImproved).to.equal(true);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a AlreadyExistingCampaignParticipationError exception when the previous participation is not shared', async function () {
        const userIdentity = { id: 1 };
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          idPixLabel: null,
        });

        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          previousCampaignParticipationForUser: {
            status: 'STARTED',
          },
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });
        const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

        expect(error).to.be.an.instanceof(AlreadyExistingCampaignParticipationError);
        expect((error as $TSFixMe).message).to.equal(`User ${userIdentity.id} has already a campaign participation with campaign ${campaignToStartParticipation.id}`);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a ForbiddenAccess exception when the previous participation is deleted', async function () {
        const userIdentity = { id: 1 };
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          multipleSendings: true,
          idPixLabel: null,
        });

        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          previousCampaignParticipationForUser: {
            status: 'SHARED',
            isDeleted: true,
          },
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });
        const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

        expect(error).to.be.an.instanceof(ForbiddenAccess);
        expect((error as $TSFixMe).message).to.equal('Vous ne pouvez pas repasser la campagne');
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws a ForbiddenAccess exception when the campaign is archived', async function () {
      const userIdentity = { id: 13 };
      const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
        archivedAt: new Date('2022-01-01'),
        idPixLabel: null,
      });

      const campaignParticipant = new CampaignParticipant({
        campaignToStartParticipation,
        userIdentity,
        organizationLearner: {
          id: null,
          hasParticipated: false,
        },
      });
      const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

      expect(error).to.be.an.instanceof(ForbiddenAccess);
      expect((error as $TSFixMe).message).to.equal("Vous n'êtes pas autorisé à rejoindre la campagne");
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when campaign does not allow multiple participation', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('throws a AlreadyExistingCampaignParticipationError exception when there is a previous participation', async function () {
        const userIdentity = { id: 13 };
        const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({
          multipleSendings: false,
          idPixLabel: null,
        });

        const campaignParticipant = new CampaignParticipant({
          campaignToStartParticipation,
          userIdentity,
          previousCampaignParticipationForUser: { id: 1, status: 'SHARED' },
          organizationLearner: {
            id: null,
            hasParticipated: false,
          },
        });
        const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

        expect(error).to.be.an.instanceof(AlreadyExistingCampaignParticipationError);
        expect((error as $TSFixMe).message).to.equal(`User ${userIdentity.id} has already a campaign participation with campaign ${campaignToStartParticipation.id}`);
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when the organization learner has already participated', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error', async function () {
      const campaignToStartParticipation = domainBuilder.buildCampaignToStartParticipation({ idPixLabel: null });
      const organizationLearnerId = 12;
      const userIdentity = { id: 13 };
      const campaignParticipant = new CampaignParticipant({
        campaignToStartParticipation,
        userIdentity,
        organizationLearner: {
          id: organizationLearnerId,
          hasParticipated: true,
        },
      });
      const error = await catchErr(campaignParticipant.start, campaignParticipant)({ participantExternalId: null });

      expect(error).to.be.an.instanceof(AlreadyExistingCampaignParticipationError);
      expect((error as $TSFixMe).message).to.equal('ORGANIZATION_LEARNER_HAS_ALREADY_PARTICIPATED');
    });
  });
});
