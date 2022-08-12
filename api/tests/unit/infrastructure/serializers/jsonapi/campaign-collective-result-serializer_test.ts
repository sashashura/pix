// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/campaign-collective-result-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | campaign-collective-results-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a serialized JSON data object', function () {
      // given
      const campaignId = 123;

      const skillsCompetence1 = _.times(3, domainBuilder.buildTargetedSkill());
      const targetedTube1 = domainBuilder.buildTargetedTube({ skills: skillsCompetence1 });
      const targetedCompetence1 = domainBuilder.buildTargetedCompetence({
        id: 'rec1',
        index: '1.2',
        name: 'Cuisson des legumes d’automne',
        areaId: 'area1',
        tubes: [targetedTube1],
      });
      const targetedArea1 = domainBuilder.buildTargetedArea({
        id: 'area1',
        color: 'jaffa',
        competences: [targetedCompetence1],
      });

      const skillsCompetence2 = _.times(4, domainBuilder.buildTargetedSkill());
      const targetedTube2 = domainBuilder.buildTargetedTube({ skills: skillsCompetence2 });
      const targetedCompetence2 = domainBuilder.buildTargetedCompetence({
        id: 'rec2',
        index: '3.4',
        name: 'Tourner un champignon',
        areaId: 'area2',
        tubes: [targetedTube2],
      });
      const targetedArea2 = domainBuilder.buildTargetedArea({
        id: 'area2',
        color: 'cerulean',
        competences: [targetedCompetence2],
      });

      const targetProfile = domainBuilder.buildTargetProfileWithLearningContent({
        competences: [targetedCompetence1, targetedCompetence2],
        areas: [targetedArea1, targetedArea2],
      });

      const campaignCollectiveResult = domainBuilder.buildCampaignCollectiveResult({
        id: campaignId,
        targetProfile,
        participantCount: 1,
        participantsValidatedKECountByCompetenceId: [
          {
            rec1: 2,
            rec2: 1,
          },
        ],
      });

      const expectedSerializedResult = {
        data: {
          id: campaignId.toString(),
          type: 'campaign-collective-results',
          attributes: {},
          relationships: {
            'campaign-competence-collective-results': {
              data: [
                {
                  id: `${campaignId.toString()}_rec1`,
                  type: 'campaignCompetenceCollectiveResults',
                },
                {
                  id: `${campaignId.toString()}_rec2`,
                  type: 'campaignCompetenceCollectiveResults',
                },
              ],
            },
          },
        },
        included: [
          {
            id: '123_rec1',
            type: 'campaignCompetenceCollectiveResults',
            attributes: {
              'average-validated-skills': 2,
              'competence-id': 'rec1',
              'competence-name': 'Cuisson des legumes d’automne',
              'area-code': '1',
              'area-color': 'jaffa',
              'targeted-skills-count': 3,
            },
          },
          {
            id: '123_rec2',
            type: 'campaignCompetenceCollectiveResults',
            attributes: {
              'average-validated-skills': 1,
              'competence-id': 'rec2',
              'competence-name': 'Tourner un champignon',
              'area-code': '3',
              'area-color': 'cerulean',
              'targeted-skills-count': 4,
            },
          },
        ],
      };

      // when
      const result = serializer.serialize(campaignCollectiveResult);

      // then
      expect(result).to.deep.equal(expectedSerializedResult);
    });
  });
});
