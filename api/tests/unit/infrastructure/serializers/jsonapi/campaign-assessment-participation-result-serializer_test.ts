// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationResult = require('../../../../../lib/domain/read-models/CampaignAssessmentParticipationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-assessment-participation-result-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-assessment-participation-result-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    let modelCampaignAssessmentParticipationResult: $TSFixMe;
    let expectedJsonApi: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
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
      expectedJsonApi = {
        data: {
          type: 'campaign-assessment-participation-results',
          id: '1',
          attributes: {
            'campaign-id': 2,
          },
          relationships: {
            'competence-results': {
              data: [
                {
                  id: `1-${targetedCompetence.id}`,
                  type: 'campaign-assessment-participation-competence-results',
                },
              ],
            },
          },
        },
        included: [
          {
            type: 'campaign-assessment-participation-competence-results',
            id: `1-${targetedCompetence.id}`,
            attributes: {
              name: targetedCompetence.name,
              index: targetedCompetence.index,
              'competence-mastery-rate': 1,
              'area-color': targetedArea.color,
            },
          },
        ],
      };

      modelCampaignAssessmentParticipationResult = new CampaignAssessmentParticipationResult({
        targetedCompetences: [targetedCompetence],
        campaignParticipationId: 1,
        campaignId: 2,
        targetProfile,
        validatedTargetedKnowledgeElementsCountByCompetenceId: { [targetedCompetence.id]: 1 },
        status: SHARED,
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a CampaignAssessmentParticipationResult model object into JSON API data', function () {
      // when
      const json = serializer.serialize(modelCampaignAssessmentParticipationResult);

      // then
      expect(json).to.deep.equal(expectedJsonApi);
    });
  });
});
