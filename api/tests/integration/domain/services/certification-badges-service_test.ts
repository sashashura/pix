// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, mockLearningContent, learningContentBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationBadgesService = require('../../../../lib/domain/services/certification-badges-service');

const listSkill = ['web1', 'web2', 'web3', 'web4'];
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
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

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Service | Certification-Badges Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findStillValidBadgeAcquisitions', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return one badgeAcquisition', async function () {
      // given
      const { id: userId } = databaseBuilder.factory.buildUser();

      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;

      listSkill.forEach((skillId) => databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId }));

      const badge = databaseBuilder.factory.buildBadge.certifiable({ targetProfileId: targetProfileId });

      databaseBuilder.factory.buildBadgeAcquisition({ userId, badgeId: badge.id });
      const { id: complementaryCertificationId } = databaseBuilder.factory.buildComplementaryCertification();
      databaseBuilder.factory.buildComplementaryCertificationBadge({
        userId,
        badgeId: badge.id,
        complementaryCertificationId,
        level: 2,
      });
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web1', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web2', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web3', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId, skillId: 'web4', status: 'invalidated' });

      const skillSet = databaseBuilder.factory.buildSkillSet({
        badgeId: badge.id,
        skillIds: ['web1', 'web2', 'web3', 'web4'],
      });

      const badgeCriterion = databaseBuilder.factory.buildBadgeCriterion({
        scope: 'CampaignParticipation',
        badgeId: badge.id,
        threshold: 40,
        skillSetIds: [skillSet.id],
      });

      await databaseBuilder.commit();

      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);

      // when
      const badgeAcquisitions = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => {
        return certificationBadgesService.findStillValidBadgeAcquisitions({ userId, domainTransaction });
      });

      // then
      const expectedBadgeCriteria = [
        {
          id: badgeCriterion.id,
          scope: badgeCriterion.scope,
          threshold: badgeCriterion.threshold,
          skillSetIds: badgeCriterion.skillSetIds,
          badgeId: badge.id,
        },
      ];

      const expectedSkillSets = [
        {
          id: skillSet.id,
          badgeId: badge.id,
          name: skillSet.name,
          skillIds: skillSet.skillIds,
        },
      ];

      expect(badgeAcquisitions.length).to.equal(1);
      expect(badgeAcquisitions[0].badge.badgeCriteria).to.deep.equal(expectedBadgeCriteria);
      expect(badgeAcquisitions[0].badge.skillSets).to.deep.equal(expectedSkillSets);
    });
  });
});
