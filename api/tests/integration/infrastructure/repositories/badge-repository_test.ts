// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeRepos... Remove this comment to see the full error message
const badgeRepository = require('../../../../lib/infrastructure/repositories/badge-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../../../lib/domain/models/Badge');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../../lib/domain/models/BadgeCriterion');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../../../lib/domain/models/SkillSet');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Badge', function () {
  let targetProfileWithSkillSets: $TSFixMe;
  let targetProfileWithoutBadge: $TSFixMe;
  let targetProfileWithSeveralBadges: $TSFixMe;

  let badgeWithSkillSets: $TSFixMe;
  let badgeCriterionForBadgeWithSkillSets: $TSFixMe;
  let skillSet_1: $TSFixMe;
  let skillSet_2: $TSFixMe;
  let badgeWithSameTargetProfile_1: $TSFixMe;
  let badgeWithSameTargetProfile_2: $TSFixMe;
  let badgeCriterionForBadgeWithSameTargetProfile_1: $TSFixMe;
  let badgeCriterionForBadgeWithSameTargetProfile_2: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    targetProfileWithoutBadge = databaseBuilder.factory.buildTargetProfile();
    setupTargetProfileWithSkillSets();
    setupTargetProfileWithSeveralBadges();
    await databaseBuilder.commit();
  });

  function setupTargetProfileWithSkillSets() {
    targetProfileWithSkillSets = databaseBuilder.factory.buildTargetProfile();

    badgeWithSkillSets = databaseBuilder.factory.buildBadge({
      altMessage: 'You won the Toto badge!',
      imageUrl: '/img/toto.svg',
      message: 'Congrats, you won the Toto badge!',
      key: 'TOTO',
      targetProfileId: targetProfileWithSkillSets.id,
    });

    skillSet_1 = {
      id: 1,
      badgeId: badgeWithSkillSets.id,
      name: 'Idenfier des éléments',
      skillIds: ['recA1B2', 'recC3D4'],
    };

    skillSet_2 = {
      id: 2,
      badgeId: badgeWithSkillSets.id,
      name: 'Rechercher des éléments',
      skillIds: ['recABC1', 'recDEF2'],
    };

    badgeCriterionForBadgeWithSkillSets = {
      id: 123,
      scope: BadgeCriterion.SCOPES.SKILL_SET,
      threshold: 53,
      skillSetIds: [1, 2],
      badgeId: badgeWithSkillSets.id,
    };

    databaseBuilder.factory.buildBadgeCriterion({
      ...badgeCriterionForBadgeWithSkillSets,
    });
    databaseBuilder.factory.buildSkillSet({
      ...skillSet_1,
      badgeId: badgeWithSkillSets.id,
    });
    databaseBuilder.factory.buildSkillSet({
      ...skillSet_2,
      badgeId: badgeWithSkillSets.id,
    });
  }

  function setupTargetProfileWithSeveralBadges() {
    targetProfileWithSeveralBadges = databaseBuilder.factory.buildTargetProfile();

    badgeWithSameTargetProfile_1 = databaseBuilder.factory.buildBadge({
      altMessage: 'You won the YELLOW badge!',
      imageUrl: '/img/toto.svg',
      message: 'Congrats, you won the yellow badge!',
      key: 'YELLOW',
      targetProfileId: targetProfileWithSeveralBadges.id,
    });
    badgeCriterionForBadgeWithSameTargetProfile_1 = {
      id: 456,
      scope: BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
      threshold: 88,
      skillSetIds: [],
      badgeId: badgeWithSameTargetProfile_1.id,
    };
    databaseBuilder.factory.buildBadgeCriterion({
      ...badgeCriterionForBadgeWithSameTargetProfile_1,
    });

    badgeWithSameTargetProfile_2 = databaseBuilder.factory.buildBadge({
      altMessage: 'You won the GREEN badge!',
      imageUrl: '/img/toto.svg',
      message: 'Congrats, you won the green badge!',
      key: 'GREEN',
      targetProfileId: targetProfileWithSeveralBadges.id,
    });
    badgeCriterionForBadgeWithSameTargetProfile_2 = {
      id: 789,
      scope: BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
      threshold: 35,
      skillSetIds: [],
      badgeId: badgeWithSameTargetProfile_2.id,
    };
    databaseBuilder.factory.buildBadgeCriterion({
      ...badgeCriterionForBadgeWithSameTargetProfile_2,
    });
  }

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('skill-sets').delete();
    await knex('badge-criteria').delete();
    await knex('badge-acquisitions').delete();
    await knex('complementary-certification-course-results').delete();
    await knex('complementary-certification-badges').delete();
    await knex('badges').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByTargetProfileId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return two badges for same target profile', async function () {
      // given
      const targetProfileId = targetProfileWithSeveralBadges.id;

      // when
      const badges = await badgeRepository.findByTargetProfileId(targetProfileId);

      expect(badges.length).to.equal(2);

      const firstBadge = badges.find(({
        id
      }: $TSFixMe) => id === badgeWithSameTargetProfile_1.id);
      expect(omit(firstBadge, 'id')).deep.equal(
        omit(
          {
            ...badgeWithSameTargetProfile_1,
            badgeCriteria: [badgeCriterionForBadgeWithSameTargetProfile_1],
            skillSets: [],
          },
          'id'
        )
      );

      const secondBadge = badges.find(({
        id
      }: $TSFixMe) => id === badgeWithSameTargetProfile_2.id);
      expect(omit(secondBadge, 'id')).deep.equal(
        omit(
          {
            ...badgeWithSameTargetProfile_2,
            badgeCriteria: [badgeCriterionForBadgeWithSameTargetProfile_2],
            skillSets: [],
          },
          'id'
        )
      );
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the badge linked to the given target profile with related badge criteria and badge partner competences', async function () {
      // given
      const targetProfileId = targetProfileWithSkillSets.id;

      // when
      const badges = await badgeRepository.findByTargetProfileId(targetProfileId);

      // then
      expect(badges.length).to.equal(1);
      expect(badges[0]).to.be.an.instanceOf(Badge);
      expect(badges[0].badgeCriteria[0]).to.be.an.instanceOf(BadgeCriterion);
      expect(badges[0].skillSets[0]).to.be.an.instanceOf(SkillSet);
      expect(badges[0]).to.deep.equal({
        ...badgeWithSkillSets,
        badgeCriteria: [badgeCriterionForBadgeWithSkillSets],
        skillSets: [skillSet_1, skillSet_2],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array when the given target profile has no badges', async function () {
      // given
      const targetProfileId = targetProfileWithoutBadge.id;

      // when
      const badges = await badgeRepository.findByTargetProfileId(targetProfileId);

      // then
      expect(badges.length).to.equal(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCampaignId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return two badges for same target profile', async function () {
      // given
      const targetProfileId = targetProfileWithSeveralBadges.id;
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      await databaseBuilder.commit();

      // when
      const badges = await badgeRepository.findByCampaignId(campaignId);

      // then
      expect(badges).to.have.length(2);

      const firstBadge = badges.find(({
        id
      }: $TSFixMe) => id === badgeWithSameTargetProfile_1.id);
      expect(firstBadge).deep.equal({
        ...badgeWithSameTargetProfile_1,
        badgeCriteria: [badgeCriterionForBadgeWithSameTargetProfile_1],
        skillSets: [],
      });

      const secondBadge = badges.find(({
        id
      }: $TSFixMe) => id === badgeWithSameTargetProfile_2.id);
      expect(secondBadge).deep.equal({
        ...badgeWithSameTargetProfile_2,
        badgeCriteria: [badgeCriterionForBadgeWithSameTargetProfile_2],
        skillSets: [],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the badge linked to the given campaign with related badge criteria and badge partner competences', async function () {
      // given
      const targetProfileId = targetProfileWithSkillSets.id;
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      await databaseBuilder.commit();

      // when
      const badges = await badgeRepository.findByCampaignId(campaignId);

      // then
      expect(badges).to.have.lengthOf(1);
      expect(badges[0]).to.be.an.instanceOf(Badge);
      expect(badges[0].badgeCriteria[0]).to.be.an.instanceOf(BadgeCriterion);
      expect(badges[0].skillSets[0]).to.be.an.instanceOf(SkillSet);
      expect(badges[0]).to.deep.equal({
        ...badgeWithSkillSets,
        badgeCriteria: [badgeCriterionForBadgeWithSkillSets],
        skillSets: [skillSet_1, skillSet_2],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array when the given campaign has no badges', async function () {
      // given
      const targetProfileId = targetProfileWithoutBadge.id;
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      await databaseBuilder.commit();

      // when
      const badges = await badgeRepository.findByCampaignId(campaignId);

      // then
      expect(badges).to.have.lengthOf(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not return a badge from another campaign', async function () {
      // given
      const targetProfileId = targetProfileWithSeveralBadges.id;
      databaseBuilder.factory.buildCampaign({ targetProfileId });
      const anotherCampaignId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();

      // when
      const badges = await badgeRepository.findByCampaignId(anotherCampaignId);

      // then
      expect(badges).to.have.lengthOf(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCampaignParticipationId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const targetProfileId = databaseBuilder.factory.buildTargetProfile().id;
      databaseBuilder.factory.buildBadge({ targetProfileId, key: 'mille_feuilles' });
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ campaignId });
      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the badges linked to the target profile of the given campaign participation', async function () {
      // given
      const targetProfileId = targetProfileWithSeveralBadges.id;
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
      await databaseBuilder.commit();

      // when
      const badges = await badgeRepository.findByCampaignParticipationId(campaignParticipationId);

      expect(badges.length).to.equal(2);

      const firstBadge = badges.find(({
        id
      }: $TSFixMe) => id === badgeWithSameTargetProfile_1.id);
      expect(firstBadge).deep.equal({
        ...badgeWithSameTargetProfile_1,
        badgeCriteria: [badgeCriterionForBadgeWithSameTargetProfile_1],
        skillSets: [],
      });

      const secondBadge = badges.find(({
        id
      }: $TSFixMe) => id === badgeWithSameTargetProfile_2.id);
      expect(secondBadge).deep.equal({
        ...badgeWithSameTargetProfile_2,
        badgeCriteria: [badgeCriterionForBadgeWithSameTargetProfile_2],
        skillSets: [],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the badge linked to the target profile of the given campaign participation with related badge criteria and badge partner competences', async function () {
      // given
      const targetProfileId = targetProfileWithSkillSets.id;
      const campaignId = databaseBuilder.factory.buildCampaign({ targetProfileId }).id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId }).id;
      await databaseBuilder.commit();

      // when
      const badges = await badgeRepository.findByCampaignParticipationId(campaignParticipationId);

      // then
      expect(badges.length).to.equal(1);
      expect(badges[0]).to.be.an.instanceOf(Badge);
      expect(badges[0].badgeCriteria[0]).to.be.an.instanceOf(BadgeCriterion);
      expect(badges[0].skillSets[0]).to.be.an.instanceOf(SkillSet);
      expect(badges[0]).to.deep.equal({
        ...badgeWithSkillSets,
        badgeCriteria: [badgeCriterionForBadgeWithSkillSets],
        skillSets: [skillSet_1, skillSet_2],
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an empty array when the given target profile has no badges', async function () {
      // given
      const targetProfileId = targetProfileWithoutBadge.id;

      // when
      const badges = await badgeRepository.findByTargetProfileId(targetProfileId);

      // then
      expect(badges.length).to.equal(0);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let badge: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      badge = databaseBuilder.factory.buildBadge({
        id: 1,
        altMessage: 'You won the Toto badge!',
        imageUrl: 'data:,',
        message: 'Congrats, you won the Toto badge!',
        key: 'TOTO2',
      });
      databaseBuilder.factory.buildBadgeCriterion({ badgeId: badge.id });
      databaseBuilder.factory.buildSkillSet({ badgeId: badge.id });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a badge', async function () {
      const myBadge = await badgeRepository.get(badge.id);

      expect(myBadge.id).to.equal(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a badge with badgeCriteria and skillSets', async function () {
      const myBadge = await badgeRepository.get(badge.id);

      expect(myBadge.badgeCriteria.length).to.equal(1);
      expect(myBadge.skillSets.length).to.equal(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when badge does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        const notExistingBadgeId = 123;

        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(badgeRepository.get)(notExistingBadgeId);

        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByKey', function () {
    let badge: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      badge = databaseBuilder.factory.buildBadge({
        id: 1,
        altMessage: 'You won the Toto badge!',
        imageUrl: 'data:,',
        message: 'Congrats, you won the Toto badge!',
        key: 'TOTO2',
      });
      databaseBuilder.factory.buildBadgeCriterion({ badgeId: badge.id });
      databaseBuilder.factory.buildSkillSet({ badgeId: badge.id });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a badge', async function () {
      const myBadge = await badgeRepository.getByKey(badge.key);

      expect(myBadge.id).to.equal(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a badge with badgeCriteria and skillSets', async function () {
      const myBadge = await badgeRepository.getByKey(badge.key);

      expect(myBadge.badgeCriteria.length).to.equal(1);
      expect(myBadge.skillSets.length).to.equal(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should persist badge in database', async function () {
      // given
      const badge = {
        altMessage: 'You won the Toto badge!',
        imageUrl: 'data:,',
        message: 'Congrats, you won the Toto badge!',
        key: 'TOTO230',
        badgeCriteria: [],
        skillSets: [],
        targetProfileId: null,
        isCertifiable: false,
        isAlwaysVisible: false,
        title: 'title',
      };

      // when
      const result = await badgeRepository.save(badge);

      // then
      expect(result).to.be.instanceOf(Badge);
      expect(omit(result, 'id')).to.deep.equal(omit(badge, 'id'));
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge key already exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an AlreadyExistingEntityError', async function () {
        // given
        const alreadyExistingBadge = {
          altMessage: 'You won the Toto badge!',
          imageUrl: 'data:,',
          message: 'Congrats, you won the Toto badge!',
          key: 'TOTO28',
          badgeCriteria: [],
          skillSets: [],
          targetProfileId: null,
          isCertifiable: false,
          isAlwaysVisible: true,
          title: 'title',
        };
        databaseBuilder.factory.buildBadge(alreadyExistingBadge);
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(badgeRepository.save)(alreadyExistingBadge);

        // then
        expect(error).to.be.instanceOf(AlreadyExistingEntityError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#update', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the badge', async function () {
      // given
      const targetProfileId = targetProfileWithSeveralBadges.id;
      const badge = databaseBuilder.factory.buildBadge({
        id: 1,
        altMessage: 'You won the Toto badge!',
        imageUrl: 'data:,',
        message: 'Congrats, you won the Toto badge!',
        key: 'TOTO2',
        targetProfileId,
        isAlwaysVisible: true,
        isCertifiable: false,
      });
      databaseBuilder.factory.buildBadgeCriterion({ badgeId: badge.id });
      await databaseBuilder.commit();

      const updatedData = {
        id: 1,
        altMessage: 'You won the Updated badge!',
        imageUrl: 'Updated URL',
        message: 'Congrats, you won the Updated badge!',
        key: 'TOTO_UPDATED',
        isAlwaysVisible: false,
        isCertifiable: true,
      };

      const expectedBadge = {
        id: 1,
        altMessage: 'You won the Updated badge!',
        imageUrl: 'Updated URL',
        message: 'Congrats, you won the Updated badge!',
        title: 'title',
        key: 'TOTO_UPDATED',
        isCertifiable: true,
        badgeCriteria: [],
        skillSets: [],
        targetProfileId,
        isAlwaysVisible: false,
      };

      // when
      const updatedBadge = await badgeRepository.update(updatedData);

      // then
      expect(updatedBadge).to.deep.equal(expectedBadge);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isKeyAvailable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true', async function () {
      // given
      const key = 'NOT_EXISTING_KEY';

      // when
      const result = await badgeRepository.isKeyAvailable(key);

      // then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when key is already exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return AlreadyExistEntityError', async function () {
        // given
        const key = 'AN_EXISTING_KEY';
        databaseBuilder.factory.buildBadge({ key });
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(badgeRepository.isKeyAvailable)(key);

        // then
        expect(error).to.instanceOf(AlreadyExistingEntityError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isAssociated', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge is not associated to a badge acquisition', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', async function () {
        // given
        const badge = databaseBuilder.factory.buildBadge({
          id: 1,
          altMessage: 'You won the Toto badge!',
          imageUrl: 'data:,',
          message: 'Congrats, you won the Toto badge!',
          key: 'TOTO2',
        });
        await databaseBuilder.commit();
        const badgeId = badge.id;

        // when
        const isNotAssociated = await badgeRepository.isAssociated(badgeId);

        // then
        expect(isNotAssociated).to.be.false;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge is associated to a badge acquisition', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const badgeId = databaseBuilder.factory.buildBadge().id;
        databaseBuilder.factory.buildBadgeAcquisition({ badgeId, userId });
        await databaseBuilder.commit();

        // when
        const isNotAssociated = await badgeRepository.isAssociated(badgeId);

        // then
        expect(isNotAssociated).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasBeenAcquiredDuringCertification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge is not acquired', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', async function () {
        // given
        const badgeId = databaseBuilder.factory.buildBadge({ id: 1 }).id;
        await databaseBuilder.commit();

        // when
        const hasBeenAcquired = await badgeRepository.isRelatedToCertification(badgeId);

        // then
        expect(hasBeenAcquired).to.be.false;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge is present in ComplementaryCertificationCourseResults', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        const badge = databaseBuilder.factory.buildBadge();
        databaseBuilder.factory.buildComplementaryCertificationCourseResult({ partnerKey: badge.key });
        await databaseBuilder.commit();

        // when
        const isNotAssociated = await badgeRepository.isRelatedToCertification(badge.id);

        // then
        expect(isNotAssociated).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge is present in complementary-certification-badges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        const badge = databaseBuilder.factory.buildBadge();
        databaseBuilder.factory.buildComplementaryCertificationCourseResult({ partnerKey: badge.key });
        databaseBuilder.factory.buildComplementaryCertificationBadge({
          complementaryCertificationId: null,
          badgeId: badge.id,
        });
        await databaseBuilder.commit();

        // when
        const isNotAssociated = await badgeRepository.isRelatedToCertification(badge.id);

        // then
        expect(isNotAssociated).to.be.true;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge is present in both complementary-certification-badges and complementary-certification-course-results', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', async function () {
        // given
        const badgeId = databaseBuilder.factory.buildBadge().id;
        databaseBuilder.factory.buildComplementaryCertificationBadge({ complementaryCertificationId: null, badgeId });
        await databaseBuilder.commit();

        // when
        const isNotAssociated = await badgeRepository.isRelatedToCertification(badgeId);

        // then
        expect(isNotAssociated).to.be.true;
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the record to delete is in the table', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true when deletion goes well', async function () {
        // given
        const badgeId = databaseBuilder.factory.buildBadge().id;
        databaseBuilder.factory.buildSkillSet({ badgeId });
        await databaseBuilder.commit();

        // when
        const isDeleted = await badgeRepository.delete(badgeId);

        // then
        expect(isDeleted).to.be.true;
        const skillSetRowsCountAfterDeletion = await knex('skill-sets').where({ badgeId }).count();
        expect(skillSetRowsCountAfterDeletion[0].count).to.equal(0);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should delete a single row in the table', async function () {
        const badgeId = badgeWithSameTargetProfile_1.id;
        const badgeRowsCountBeforeDeletion = await knex('badges').where({ id: badgeId }).count();
        // when
        await badgeRepository.delete(badgeId);
        const badgeRowsCountAfterDeletion = await knex('badges').where({ id: badgeId }).count();

        // then
        expect(badgeRowsCountAfterDeletion[0].count).to.equal(badgeRowsCountBeforeDeletion[0].count - 1);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when the badge has complementary criteria', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should delete both badge and criteria', async function () {
        // given
        const badgeId = badgeWithSameTargetProfile_1.id;

        // when
        const isDeleted = await badgeRepository.delete(badgeId);

        // then
        const badge = await knex.select().from('badges').where({ id: badgeId }).first();
        const badgeCriterion = await knex.select().from('badge-criteria').where({ badgeId }).first();
        expect(badge).to.be.undefined;
        expect(badgeCriterion).to.be.undefined;
        expect(isDeleted).to.be.true;
      });
    });
  });
});
