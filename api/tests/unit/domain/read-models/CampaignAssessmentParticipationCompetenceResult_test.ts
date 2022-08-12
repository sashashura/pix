// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationCompetenceResult = require('../../../../lib/domain/read-models/CampaignAssessmentParticipationCompetenceResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CampaignAssessmentParticipationCompetenceResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should correctly initialize the competence data', function () {
      const targetedCompetence = domainBuilder.buildTargetedCompetence({
        id: 'rec123',
        name: 'competence1',
        index: '1.1',
        areaId: 'area1',
      });
      const targetedArea = domainBuilder.buildTargetedArea({ id: 'area1' });

      const campaignAssessmentParticipationCompetenceResult = new CampaignAssessmentParticipationCompetenceResult({
        campaignParticipationId: '1',
        targetedArea,
        targetedCompetence,
      });

      expect(campaignAssessmentParticipationCompetenceResult.id).equal('1-rec123');
      expect(campaignAssessmentParticipationCompetenceResult.name).equal('competence1');
      expect(campaignAssessmentParticipationCompetenceResult.index).equal('1.1');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the area color', function () {
      const targetedCompetence = domainBuilder.buildTargetedCompetence({
        id: 'rec123',
        areaId: 'area1',
      });
      const targetedArea = domainBuilder.buildTargetedArea({ id: 'area1', color: 'red' });

      const campaignAssessmentParticipationCompetenceResult = new CampaignAssessmentParticipationCompetenceResult({
        targetedArea,
        targetedCompetence,
      });

      expect(campaignAssessmentParticipationCompetenceResult.areaColor).equal('red');
    });
  });
});
