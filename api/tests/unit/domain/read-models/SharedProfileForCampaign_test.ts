// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SharedProf... Remove this comment to see the full error message
const SharedProfileForCampaign = require('../../../../lib/domain/read-models/SharedProfileForCampaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../../../../lib/domain/models/Scorecard');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | SharedProfileForCampaign', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#scorecards', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participant has knowledge elements', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return scorecards', function () {
        const userId = 1;
        const competence = { id: 1, name: 'Useful competence' };
        const knowledgeElements = [domainBuilder.buildKnowledgeElement({ competenceId: competence.id })];
        const expectedScorecard = Scorecard.buildFrom({ userId, competence, knowledgeElements });

        const sharedProfileForCampaign = new SharedProfileForCampaign({
          userId,
          campaignParticipation: {
            sharedAt: new Date('2020-01-01'),
          },
          competencesWithArea: [competence],
          knowledgeElementsGroupedByCompetenceId: {
            [competence.id]: knowledgeElements,
          },
        });

        expect(sharedProfileForCampaign.scorecards[0]).to.deep.include({
          id: expectedScorecard.id,
          name: expectedScorecard.name,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participant does not have knowledge elements', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return empty array', function () {
        const userId = 1;
        const competence = { id: 1, name: 'Useful competence' };

        const sharedProfileForCampaign = new SharedProfileForCampaign({
          userId,
          campaignParticipation: {
            sharedAt: new Date('2020-01-01'),
          },
          competencesWithArea: [competence],
        });

        expect(sharedProfileForCampaign.scorecards).to.deep.equal([]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#canRetry', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participant is disabled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('cannot retry', function () {
        const sharedProfileForCampaign = new SharedProfileForCampaign({
          campaignParticipation: {
            sharedAt: new Date('2020-01-01'),
          },
          campaignAllowsRetry: true,
          isOrganizationLearnerActive: false,
        });

        expect(sharedProfileForCampaign.canRetry).to.equal(false);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign does not allow retry', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('return false', function () {
        const sharedProfileForCampaign = new SharedProfileForCampaign({
          campaignParticipation: {
            sharedAt: new Date('2020-01-01'),
          },
          campaignAllowsRetry: false,
          isOrganizationLearnerActive: true,
        });

        expect(sharedProfileForCampaign.canRetry).to.equal(false);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false if campaign participation is deleted', function () {
        const sharedProfileForCampaign = new SharedProfileForCampaign({
          campaignParticipation: {
            sharedAt: new Date('2020-01-01'),
            deletedAt: new Date('2020-01-01'),
          },
          campaignAllowsRetry: true,
          isOrganizationLearnerActive: true,
        });

        expect(sharedProfileForCampaign.canRetry).to.equal(false);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when participant is  active', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when participation is not shared', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('return false', function () {
          const sharedProfileForCampaign = new SharedProfileForCampaign({
            campaignParticipation: {
              sharedAt: null,
            },
            campaignAllowsRetry: true,
            isOrganizationLearnerActive: true,
          });

          expect(sharedProfileForCampaign.canRetry).to.equal(false);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the profile has been shared', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('return true', function () {
          const sharedProfileForCampaign = new SharedProfileForCampaign({
            campaignParticipation: {
              sharedAt: new Date('2020-01-01'),
            },
            campaignAllowsRetry: true,
            isOrganizationLearnerActive: true,
          });

          expect(sharedProfileForCampaign.canRetry).to.equal(true);
        });
      });
    });
  });
});
