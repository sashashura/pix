// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createServ... Remove this comment to see the full error message
const createServer = require('../../../../server');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'generateVa... Remove this comment to see the full error message
  generateValidRequestAuthorizationHeader,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Acceptance | API | Campaign Participations | Analyses', function () {
  let server: $TSFixMe, options, userId: $TSFixMe, organization, targetProfile, campaign: $TSFixMe, campaignParticipation: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    server = await createServer();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('GET /api/campaign-participations/{id}/analyses', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      userId = databaseBuilder.factory.buildUser({ firstName: 'Jean', lastName: 'Bono' }).id;
      organization = databaseBuilder.factory.buildOrganization();

      databaseBuilder.factory.buildMembership({
        userId,
        organizationId: organization.id,
        organizationRole: Membership.roles.MEMBER,
      });

      targetProfile = databaseBuilder.factory.buildTargetProfile({
        organizationId: organization.id,
        name: 'Profile 3',
      });
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: 'recSkillId1' });
      databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId: targetProfile.id, skillId: 'recSkillId2' });
      campaign = databaseBuilder.factory.buildCampaign({
        name: 'Campagne de Test N°3',
        organizationId: organization.id,
        targetProfileId: targetProfile.id,
      });
      campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign.id,
      });

      await databaseBuilder.commit();

      const learningContent = [
        {
          id: 'recArea1',
          color: 'specialColor',
          competences: [
            {
              id: 'recCompetence1',
              name: 'Fabriquer un meuble',
              tubes: [
                {
                  id: 'recTube1',
                  practicalTitleFr: 'Monter une étagère',
                  practicalDescriptionFr: 'Comment monter une étagère',
                  skills: [
                    {
                      id: 'recSkillId1',
                      nom: '@skill1',
                      challenges: [],
                      tutorials: [
                        {
                          id: 'recTutorial1',
                          title: 'Apprendre à vivre confiné',
                          format: '2 mois',
                          source: 'covid-19',
                          link: 'www.liberez-moi.fr',
                          locale: 'fr-fr',
                          duration: '00:03:31',
                        },
                      ],
                    },
                    {
                      id: 'recSkillId2',
                      nom: '@skill2',
                      challenges: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the campaign participation analyses', async function () {
      // given
      options = {
        method: 'GET',
        url: `/api/campaign-participations/${campaignParticipation.id}/analyses`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
      const expectedCampaignParticipationAnalysis = {
        data: {
          type: 'campaign-analyses',
          id: campaign.id.toString(),
          attributes: {},
          relationships: {
            'campaign-tube-recommendations': {
              data: [
                {
                  id: `${campaign.id}_recTube1`,
                  type: 'campaignTubeRecommendations',
                },
              ],
            },
          },
        },
        included: [
          {
            id: 'recTutorial1',
            type: 'tutorials',
            attributes: {
              duration: '00:03:31',
              format: '2 mois',
              id: 'recTutorial1',
              link: 'www.liberez-moi.fr',
              source: 'covid-19',
              title: 'Apprendre à vivre confiné',
            },
          },
          {
            id: `${campaign.id}_recTube1`,
            type: 'campaignTubeRecommendations',
            attributes: {
              'area-color': 'specialColor',
              'tube-id': 'recTube1',
              'competence-id': 'recCompetence1',
              'competence-name': 'Fabriquer un meuble',
              'tube-practical-title': 'Monter une étagère',
              'tube-description': 'Comment monter une étagère',
              'average-score': 30,
            },
            relationships: {
              tutorials: {
                data: [
                  {
                    id: 'recTutorial1',
                    type: 'tutorials',
                  },
                ],
              },
            },
          },
        ],
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal(expectedCampaignParticipationAnalysis);
    });
  });
});
