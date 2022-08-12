// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationResult = require('../../../../lib/domain/read-models/CampaignAssessmentParticipationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../lib/domain/models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, TO_SHARE } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignAssessmentParticipationResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should correctly initialize the information about campaign participation', function () {
      const targetProfile = domainBuilder.buildTargetProfileWithLearningContent();
      const campaignAssessmentParticipationResult = new CampaignAssessmentParticipationResult({
        campaignParticipationId: 1,
        campaignId: 2,
        targetedCompetences: [],
        targetProfile,
      });

      expect(campaignAssessmentParticipationResult.campaignParticipationId).equal(1);
      expect(campaignAssessmentParticipationResult.campaignId).equal(2);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaignParticipation is not shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('does not compute CampaignAssessmentParticipationCompetenceResult', function () {
        const targetedCompetence = domainBuilder.buildTargetedCompetence({ id: 'competence1', skills: ['oneSkill'] });
        const targetProfile = domainBuilder.buildTargetProfileWithLearningContent({
          competences: [targetedCompetence],
        });
        const campaignAssessmentParticipationResult = new CampaignAssessmentParticipationResult({
          campaignParticipationId: 1,
          campaignId: 2,
          targetedCompetences: [targetedCompetence],
          status: TO_SHARE,
          targetProfile,
        });

        expect(campaignAssessmentParticipationResult.isShared).equal(false);
        expect(campaignAssessmentParticipationResult.competenceResults).deep.equal([]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaignParticipation is shared', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should compute results with targeted competences', function () {
        const targetedCompetence = domainBuilder.buildTargetedCompetence({
          id: 'competence1',
          skills: ['oneSkill'],
          areaId: 'area1',
        });
        const targetedArea = domainBuilder.buildTargetedArea({ id: 'area1', competences: [targetedCompetence] });
        const targetProfile = domainBuilder.buildTargetProfileWithLearningContent({
          competences: [targetedCompetence],
          areas: [targetedArea],
        });
        const validatedTargetedKnowledgeElementsByCompetenceId = {
          competence1: [domainBuilder.buildKnowledgeElement({ skillId: 'someId', competenceId: 'competence1' })],
        };

        const campaignAssessmentParticipationResult = new CampaignAssessmentParticipationResult({
          campaignParticipationId: 1,
          campaignId: 2,
          targetedCompetences: [targetedCompetence],
          status: SHARED,
          validatedTargetedKnowledgeElementsByCompetenceId,
          targetProfile,
        });

        expect(campaignAssessmentParticipationResult.isShared).equal(true);
        expect(campaignAssessmentParticipationResult.competenceResults.length).equal(1);
        expect(campaignAssessmentParticipationResult.competenceResults[0].id).equal('1-competence1');
      });
    });
  });
});
