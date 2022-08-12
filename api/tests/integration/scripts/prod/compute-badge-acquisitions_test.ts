const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
  expect,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
  databaseBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
  sinon,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'learningCo... Remove this comment to see the full error message
  learningContentBuilder,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mockLearni... Remove this comment to see the full error message
  mockLearningContent,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
  knex,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'normalizeR... Remove this comment to see the full error message
  normalizeRange,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computeAll... Remove this comment to see the full error message
  computeAllBadgeAcquisitions,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computeBad... Remove this comment to see the full error message
  computeBadgeAcquisition,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
  getCampaignParticipationsBetweenIds,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../scripts/prod/compute-badge-acquisitions');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaService = require('../../../../lib/domain/services/badge-criteria-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeAcqui... Remove this comment to see the full error message
const badgeAcquisitionRepository = require('../../../../lib/infrastructure/repositories/badge-acquisition-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeRepos... Remove this comment to see the full error message
const badgeRepository = require('../../../../lib/infrastructure/repositories/badge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('../../../../lib/infrastructure/repositories/knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileRepository = require('../../../../lib/infrastructure/repositories/target-profile-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Script | Prod | Compute Badge Acquisitions', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validateRange', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should truncate idMax when is superior to MAX_RANGE_SIZE', function () {
      // given
      sinon.stub(logger, 'info').returns();
      const range = {
        idMin: 0,
        idMax: 1_000_000,
      };

      // when
      const normalizedRange = normalizeRange(range);

      // then
      expect(normalizedRange).to.deep.equal({ idMin: 0, idMax: 100_000 });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not truncate range when it is below MAX_RANGE_SIZE', function () {
      // given
      const range = {
        idMin: 0,
        idMax: 9000,
      };

      // when
      const normalizedRange = normalizeRange(range);

      // then
      expect(normalizedRange).to.deep.equal(range);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCampaignParticipationsBetweenIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return campaign participation between idMin and idMax', async function () {
      // given
      databaseBuilder.factory.buildCampaignParticipation();
      const id2 = databaseBuilder.factory.buildCampaignParticipation().id;
      const id3 = databaseBuilder.factory.buildCampaignParticipation().id;
      const id4 = databaseBuilder.factory.buildCampaignParticipation().id;
      await databaseBuilder.commit();

      // when
      const campaignParticipations = await getCampaignParticipationsBetweenIds({ idMin: id2, idMax: id4 });

      // then
      expect(campaignParticipations.length).to.equal(3);
      expect(campaignParticipations.map(({
        id
      }: $TSFixMe) => id)).to.deep.equal([id2, id3, id4]);
      expect(campaignParticipations[0]).to.be.instanceOf(CampaignParticipation);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Integration | #computeAllBadgeAcquisitions', function () {
    let userId1, userId2;
    let badgeCompleted;
    let campaignParticipation1: $TSFixMe, campaignParticipation2: $TSFixMe;

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

      userId1 = databaseBuilder.factory.buildUser().id;
      userId2 = databaseBuilder.factory.buildUser().id;
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      listSkill.forEach((skillId) => databaseBuilder.factory.buildTargetProfileSkill({ targetProfileId, skillId }));
      databaseBuilder.factory.buildKnowledgeElement({ userId: userId1, skillId: 'web1', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId: userId1, skillId: 'web2', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId: userId1, skillId: 'web3', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId: userId1, skillId: 'web4', status: 'invalidated' });

      databaseBuilder.factory.buildKnowledgeElement({ userId: userId2, skillId: 'web1', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId: userId2, skillId: 'web2', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId: userId2, skillId: 'web3', status: 'validated' });
      databaseBuilder.factory.buildKnowledgeElement({ userId: userId2, skillId: 'web4', status: 'invalidated' });

      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId: userId1 });
      campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId: userId2 });

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

      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('badge-acquisitions').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should compute badge acquisition for all campaign participations', async function () {
      // when
      const numberOfCreatedBadges = await computeAllBadgeAcquisitions({
        idMin: campaignParticipation1.id,
        idMax: campaignParticipation2.id,
      });

      // then
      const badgeAcquisitions = await knex('badge-acquisitions');
      expect(badgeAcquisitions.length).to.equal(2);
      expect(numberOfCreatedBadges).to.equal(2);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when dry run option is provided', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create badge', async function () {
        // given
        const dryRun = true;

        // when
        const numberOfSupposedlyCreatedBadges = await computeAllBadgeAcquisitions({
          idMin: campaignParticipation1.id,
          idMax: campaignParticipation2.id,
          dryRun,
        });

        // then
        const badgeAcquisitions = await knex('badge-acquisitions');
        expect(badgeAcquisitions.length).to.equal(0);
        expect(numberOfSupposedlyCreatedBadges).to.equal(2);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Unit | #computeBadgeAcquisition', function () {
    let badgeRepository: $TSFixMe, targetProfileRepository: $TSFixMe, knowledgeElementRepository: $TSFixMe, badgeAcquisitionRepository: $TSFixMe;
    let badgeCriteriaService: $TSFixMe;
    let dependencies: $TSFixMe;
    let campaignParticipation: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      campaignParticipation = {
        id: 1,
        userId: 123,
      };

      badgeRepository = {
        findByCampaignParticipationId: _.noop,
      };
      targetProfileRepository = {
        getByCampaignParticipationId: _.noop,
      };
      knowledgeElementRepository = {
        findUniqByUserId: _.noop,
      };
      badgeAcquisitionRepository = {
        createOrUpdate: _.noop,
        getAcquiredBadgeIds: _.noop,
      };
      badgeCriteriaService = {
        areBadgeCriteriaFulfilled: _.noop,
      };

      dependencies = {
        badgeAcquisitionRepository,
        badgeCriteriaService,
        badgeRepository,
        knowledgeElementRepository,
        targetProfileRepository,
      };
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is associated to one badge', function () {
      let badge: $TSFixMe;
      let targetProfile: $TSFixMe;
      let knowledgeElements: $TSFixMe;
      let badgeId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        badgeId = Symbol('badgeId');
        targetProfile = Symbol('targetProfile');
        knowledgeElements = Symbol('knowledgeElements');

        sinon.stub(badgeRepository, 'findByCampaignParticipationId');
        badge = {
          id: badgeId,
          badgeCriteria: Symbol('badgeCriteria'),
        };
        badgeRepository.findByCampaignParticipationId.withArgs(campaignParticipation.id).resolves([badge]);

        sinon.stub(targetProfileRepository, 'getByCampaignParticipationId');
        targetProfileRepository.getByCampaignParticipationId.withArgs(campaignParticipation.id).resolves(targetProfile);

        sinon.stub(knowledgeElementRepository, 'findUniqByUserId');
        knowledgeElementRepository.findUniqByUserId
          .withArgs({ userId: campaignParticipation.userId })
          .resolves(knowledgeElements);
        sinon.stub(badgeCriteriaService, 'areBadgeCriteriaFulfilled');
        sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');
        sinon.stub(badgeAcquisitionRepository, 'getAcquiredBadgeIds');
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a badge when badge requirements are fulfilled and return number of badge created', async function () {
        // given
        badgeCriteriaService.areBadgeCriteriaFulfilled
          .withArgs({ targetProfile, knowledgeElements, badge })
          .returns(true);
        badgeAcquisitionRepository.getAcquiredBadgeIds.resolves([]);

        // when
        const numberOfCreatedBadges = await computeBadgeAcquisition({ campaignParticipation, ...dependencies });

        // then
        expect(badgeAcquisitionRepository.createOrUpdate).to.have.been.calledWithExactly([
          {
            badgeId,
            userId: campaignParticipation.userId,
            campaignParticipationId: campaignParticipation.id,
          },
        ]);
        expect(numberOfCreatedBadges).to.equal(1);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create a badge when badge requirements are not fulfilled', async function () {
        // given
        badgeCriteriaService.areBadgeCriteriaFulfilled
          .withArgs({ targetProfile, knowledgeElements, badge })
          .returns(false);

        // when
        const numberOfCreatedBadges = await computeBadgeAcquisition({ campaignParticipation, ...dependencies });

        // then
        expect(badgeAcquisitionRepository.createOrUpdate).to.not.have.been.called;
        expect(numberOfCreatedBadges).to.equal(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is associated to two badges', function () {
      let badge1: $TSFixMe, badge2: $TSFixMe;
      let badgeId_1, badgeId_2;
      let targetProfile: $TSFixMe;
      let knowledgeElements: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        badgeId_1 = Symbol('badgeId_1');
        badgeId_2 = Symbol('badgeId_2');
        targetProfile = Symbol('targetProfile');
        knowledgeElements = Symbol('knowledgeElements');

        sinon.stub(badgeRepository, 'findByCampaignParticipationId');
        badge1 = {
          id: badgeId_1,
          badgeCriteria: Symbol('badgeCriteria'),
        };
        badge2 = {
          id: badgeId_2,
          badgeCriteria: Symbol('badgeCriteria'),
        };
        badgeRepository.findByCampaignParticipationId.withArgs(campaignParticipation.id).resolves([badge1, badge2]);

        sinon.stub(targetProfileRepository, 'getByCampaignParticipationId');
        targetProfileRepository.getByCampaignParticipationId.withArgs(campaignParticipation.id).resolves(targetProfile);

        sinon.stub(knowledgeElementRepository, 'findUniqByUserId');
        knowledgeElementRepository.findUniqByUserId
          .withArgs({ userId: campaignParticipation.userId })
          .resolves(knowledgeElements);

        sinon.stub(badgeCriteriaService, 'areBadgeCriteriaFulfilled');
        sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');
        sinon.stub(badgeAcquisitionRepository, 'getAcquiredBadgeIds');
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when only one badge requirements are fulfilled', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should create one badge', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge: badge1 })
            .returns(true);
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge: badge2 })
            .returns(false);
          badgeAcquisitionRepository.getAcquiredBadgeIds
            .withArgs({
              badgeIds: [badge1.id],
              userId: campaignParticipation.userId,
            })
            .resolves([]);

          // when
          const numberOfCreatedBadges = await computeBadgeAcquisition({ campaignParticipation, ...dependencies });

          // then
          expect(badgeAcquisitionRepository.createOrUpdate).to.have.been.calledWithExactly([
            {
              badgeId: badge1.id,
              userId: campaignParticipation.userId,
              campaignParticipationId: campaignParticipation.id,
            },
          ]);
          expect(numberOfCreatedBadges).to.equal(1);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when both badges requirements are fulfilled', function () {
        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when user does not have these badges yet', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should create two badges', async function () {
            // given
            badgeCriteriaService.areBadgeCriteriaFulfilled
              .withArgs({ targetProfile, knowledgeElements, badge: badge1 })
              .returns(true);
            badgeCriteriaService.areBadgeCriteriaFulfilled
              .withArgs({ targetProfile, knowledgeElements, badge: badge2 })
              .returns(true);
            badgeAcquisitionRepository.getAcquiredBadgeIds
              .withArgs({
                badgeIds: [badge1.id, badge2.id],
                userId: campaignParticipation.userId,
              })
              .resolves([]);

            // when
            const numberOfCreatedBadges = await computeBadgeAcquisition({ campaignParticipation, ...dependencies });

            // then
            expect(badgeAcquisitionRepository.createOrUpdate).to.have.been.calledWithExactly([
              {
                badgeId: badge1.id,
                userId: campaignParticipation.userId,
                campaignParticipationId: campaignParticipation.id,
              },
              {
                badgeId: badge2.id,
                userId: campaignParticipation.userId,
                campaignParticipationId: campaignParticipation.id,
              },
            ]);
            expect(numberOfCreatedBadges).to.equal(2);
          });
        });

        // @ts-expect-error TS(2304): Cannot find name 'context'.
        context('when user already have one badge', function () {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it('should create the other one', async function () {
            // given
            badgeCriteriaService.areBadgeCriteriaFulfilled
              .withArgs({ targetProfile, knowledgeElements, badge: badge1 })
              .returns(true);
            badgeCriteriaService.areBadgeCriteriaFulfilled
              .withArgs({ targetProfile, knowledgeElements, badge: badge2 })
              .returns(true);
            badgeAcquisitionRepository.getAcquiredBadgeIds
              .withArgs({
                badgeIds: [badge1.id, badge2.id],
                userId: campaignParticipation.userId,
              })
              .resolves([badge1.id]);

            // when
            const numberOfCreatedBadges = await computeBadgeAcquisition({ campaignParticipation, ...dependencies });

            // then
            expect(badgeAcquisitionRepository.createOrUpdate).to.have.been.calledWithExactly([
              {
                badgeId: badge2.id,
                userId: campaignParticipation.userId,
                campaignParticipationId: campaignParticipation.id,
              },
            ]);
            expect(numberOfCreatedBadges).to.equal(1);
          });
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the campaign is not associated to a badge', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not create a badge', async function () {
        // given
        sinon.stub(badgeRepository, 'findByCampaignParticipationId');
        badgeRepository.findByCampaignParticipationId.withArgs(campaignParticipation.id).resolves([]);

        sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');

        // when
        const numberOfCreatedBadges = await computeBadgeAcquisition({ campaignParticipation, ...dependencies });

        // then
        expect(badgeAcquisitionRepository.createOrUpdate).to.not.have.been.called;
        expect(numberOfCreatedBadges).to.equal(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when dry-run option is provided', function () {
      let badge: $TSFixMe;
      let targetProfile: $TSFixMe;
      let knowledgeElements: $TSFixMe;
      let badgeId;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        badgeId = Symbol('badgeId');
        targetProfile = Symbol('targetProfile');
        knowledgeElements = Symbol('knowledgeElements');

        sinon.stub(badgeRepository, 'findByCampaignParticipationId');
        badge = {
          id: badgeId,
          badgeCriteria: Symbol('badgeCriteria'),
        };
        badgeRepository.findByCampaignParticipationId.withArgs(campaignParticipation.id).resolves([badge]);

        sinon.stub(targetProfileRepository, 'getByCampaignParticipationId');
        targetProfileRepository.getByCampaignParticipationId.withArgs(campaignParticipation.id).resolves(targetProfile);

        sinon.stub(knowledgeElementRepository, 'findUniqByUserId');
        knowledgeElementRepository.findUniqByUserId
          .withArgs({ userId: campaignParticipation.userId })
          .resolves(knowledgeElements);
        sinon.stub(badgeCriteriaService, 'areBadgeCriteriaFulfilled');
        sinon.stub(badgeAcquisitionRepository, 'createOrUpdate');
        sinon.stub(badgeAcquisitionRepository, 'getAcquiredBadgeIds');
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when badge requirements are fulfilled and return number of badge created', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not create a badge but should return number of supposedly created badges', async function () {
          // given
          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ targetProfile, knowledgeElements, badge })
            .returns(true);
          badgeAcquisitionRepository.getAcquiredBadgeIds.resolves([]);

          // when
          const numberOfSupposedlyCreatedBadges = await computeBadgeAcquisition({
            campaignParticipation,
            dryRun: true,
            ...dependencies,
          });

          // then
          expect(badgeAcquisitionRepository.createOrUpdate).to.have.not.been.called;
          expect(numberOfSupposedlyCreatedBadges).to.equal(1);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Integration | #computeBadgeAcquisition', function () {
    let userId: $TSFixMe;
    let badgeCompleted: $TSFixMe;
    let badgeCompletedAndAcquired;
    let campaignParticipation: $TSFixMe;

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
      campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId });

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

      badgeCompletedAndAcquired = databaseBuilder.factory.buildBadge({
        targetProfileId,
        key: 'Badge3',
      });
      databaseBuilder.factory.buildBadgeCriterion({
        scope: 'CampaignParticipation',
        badgeId: badgeCompletedAndAcquired.id,
        threshold: 40,
      });
      databaseBuilder.factory.buildBadgeAcquisition({
        badgeId: badgeCompletedAndAcquired.id,
        userId,
      });

      const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
      mockLearningContent(learningContentObjects);

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('badge-acquisitions').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save only the validated badges not yet acquired', async function () {
      // when
      const numberOfCreatedBadges = await computeBadgeAcquisition({
        campaignParticipation,
        badgeCriteriaService,
        badgeAcquisitionRepository,
        badgeRepository,
        knowledgeElementRepository,
        targetProfileRepository,
      });

      // then
      const badgeAcquisitions = await knex('badge-acquisitions').where({ userId: userId, badgeId: badgeCompleted.id });
      expect(badgeAcquisitions.length).to.equal(1);
      expect(badgeAcquisitions[0].userId).to.equal(userId);
      expect(badgeAcquisitions[0].badgeId).to.equal(badgeCompleted.id);
      expect(numberOfCreatedBadges).to.equal(1);
    });
  });
});
