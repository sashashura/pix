// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, mockLearningContent, learningContentBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const handleBadgeAcquisitionEvent = require('../../../../lib/domain/events/handle-badge-acquisition');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaService = require('../../../../lib/domain/services/badge-criteria-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../../../lib/infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeRepos... Remove this comment to see the full error message
const badgeRepository = require('../../../../lib/infrastructure/repositories/badge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../../../lib/infrastructure/repositories/target-profile-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AsessmentC... Remove this comment to see the full error message
const AsessmentCompletedEvent = require('../../../../lib/domain/events/AssessmentCompleted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Event | Handle Badge Acquisition Service', function () {
  let userId: $TSFixMe, event: $TSFixMe, badgeCompleted: $TSFixMe;

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#handleBadgeAcquisition', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      const listSkill = ['web1', 'web2', 'web3', 'web4'];

      const learningContent = [
        {
          id: 'recArea1',
          titleFrFr: 'area1_Title',
          color: 'someColor',
          competences: [
            {
              id: 'competenceId',
              nameFrFr: 'Mener une recherche et une veille d’information',
              index: '1.1',
              tubes: [
                {
                  id: 'recTube0_0',
                  skills: [
                    {
                      id: listSkill[0],
                      nom: '@web1',
                      status: 'actif',
                      challenges: [],
                    },
                    {
                      id: listSkill[1],
                      nom: '@web2',
                      status: 'actif',
                      challenges: [],
                    },
                    {
                      id: listSkill[2],
                      nom: 'web3',
                      status: 'actif',
                      challenges: [],
                    },
                    {
                      id: listSkill[3],
                      nom: 'web4',
                      status: 'actif',
                      challenges: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      userId = databaseBuilder.factory.buildUser().id;
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      listSkill.forEach((skillId) => databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId }));
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web1', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web2', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web3', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web4', status: 'invalidated' });

      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId }).id;

      badgeCompleted = databaseBuilder.factory.buildBadge({
        targetProfileId,
        key: 'Badge1',
      });
      databaseBuilder.factory.buildBadgeCriterion({
        scope: 'CampaignParticipation',
        badgeId: badgeCompleted.id,
        threshold: 40,
      });

      const badgeNotCompletedId = databaseBuilder.factory.buildBadge({
        targetProfileId,
        key: 'Badge2',
      }).id;
      databaseBuilder.factory.buildBadgeCriterion({
        scope: 'CampaignParticipation',
        badgeId: badgeNotCompletedId,
        threshold: 90,
      });

      databaseBuilder.factory.buildBadge({
        targetProfileId,
        badgeCriteria: [],
        key: 'Badge3',
      });

      event = new AsessmentCompletedEvent();
      event.userId = userId;
      event.campaignParticipationId = campaignParticipationId;

      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('badge-acquisitions').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save only the validated badges', async function () {
      // when
      await handleBadgeAcquisitionEvent({
        event,
        badgeCriteriaService,
        badgeAcquisitionRepository,
        badgeRepository,
        knowledgeElementRepository,
        targetProfileRepository,
      });

      // then
      const badgeAcquisitions = await knex('badge-acquisitions').where({ userId: userId });
      expect(badgeAcquisitions.length).to.equal(1);
      expect(badgeAcquisitions[0].userId).to.equal(userId);
      expect(badgeAcquisitions[0].badgeId).to.equal(badgeCompleted.id);
    });
  });
});
