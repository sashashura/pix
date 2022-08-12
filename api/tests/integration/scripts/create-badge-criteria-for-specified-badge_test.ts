// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, catchErr, databaseBuilder, knex } = require('../../test-helper');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkBadge... Remove this comment to see the full error message
  checkBadgeExistence,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkCrite... Remove this comment to see the full error message
  checkCriteriaFormat,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkSkill... Remove this comment to see the full error message
  checkSkillSetIds,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'copySkillS... Remove this comment to see the full error message
  copySkillSets,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../scripts/create-badge-criteria-for-specified-badge.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../lib/domain/models/BadgeCriterion');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Scripts | create-badge-criteria-for-specified-badge', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkBadgeExistence', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the badge does not exist', async function () {
      // given
      const badgeId = 123;

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(checkBadgeExistence)(badgeId);

      // then
      expect(error).to.be.an.instanceof(Error);
      expect((error as $TSFixMe).message).to.equal(`Badge ${badgeId} not found`);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not throw an error if the badge exists', async function () {
      // given
      const badge = databaseBuilder.factory.buildBadge();
      await databaseBuilder.commit();

      // when
      expect(await checkBadgeExistence(badge.id)).not.to.throw;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkCriteriaFormat', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when badge criteria is valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw an error if the scope is SkillSet', function () {
        // given
        const badgeCriteria = [
          {
            threshold: 0,
            scope: BadgeCriterion.SCOPES.SKILL_SET,
            skillSetIds: [1, 2, 3],
          },
        ];

        // when & then
        expect(checkCriteriaFormat(badgeCriteria)).not.to.throw;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw an error when the scope is CampaignParticipation and skillSetIds field is null', function () {
        // given
        const badgeCriteria = [
          {
            threshold: 0,
            scope: BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
            skillSetIds: null,
          },
        ];

        // when & then
        expect(checkCriteriaFormat(badgeCriteria)).not.to.throw;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when one badge criterion is not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        // given
        const badgeCriteria = [
          {
            threshold: -1,
            scope: BadgeCriterion.SCOPES.SKILL_SET,
            skillSetIds: [1, 2, 3],
          },
        ];

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkCriteriaFormat)(badgeCriteria);

        // then
        expect(error).to.be.an.instanceof(Error);
        expect((error as $TSFixMe).message).to.equal('"threshold" must be greater than or equal to 0');
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when scope is CampaignParticipation and skillSetIds are provided', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const badgeCriteria = [
            {
              threshold: 1,
              scope: BadgeCriterion.SCOPES.CAMPAIGN_PARTICIPATION,
              skillSetIds: [1, 2, 3],
            },
          ];

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(checkCriteriaFormat)(badgeCriteria);

          // then
          expect(error).to.be.an.instanceof(Error);
          expect((error as $TSFixMe).message).to.equal('Badge criterion is invalid : SkillSetIds provided for CampaignParticipation scope');
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when scope is SkillSet and skillSetIds are not provided', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error', async function () {
          // given
          const badgeCriteria = [
            {
              threshold: 1,
              scope: BadgeCriterion.SCOPES.SKILL_SET,
              skillSetIds: null,
            },
          ];

          // when
          // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
          const error = await catchErr(checkCriteriaFormat)(badgeCriteria);

          // then
          expect(error).to.be.an.instanceof(Error);
          expect((error as $TSFixMe).message).to.equal('Badge criterion is invalid : SkillSetIds should be provided for SkillSet scope');
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#checkSkillSetIds', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all skillSetIds exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw an error', async function () {
        // given
        const skillSetIds = [
          databaseBuilder.factory.buildSkillSet().id,
          databaseBuilder.factory.buildSkillSet().id,
          databaseBuilder.factory.buildSkillSet().id,
        ];
        await databaseBuilder.commit();

        // when & then
        expect(await checkSkillSetIds(skillSetIds)).not.to.throw;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is at least one skillSetId that does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an error', async function () {
        // given
        const skillSetIds = [
          databaseBuilder.factory.buildSkillSet().id,
          databaseBuilder.factory.buildSkillSet().id,
          '1233',
        ];
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(checkSkillSetIds)(skillSetIds);

        expect(error).to.be.instanceof(Error);
        expect((error as $TSFixMe).message).to.be.equal('At least one skillSetId does not exist');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#copySkillSets', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a copy of the existing skillSets with the new badgeId', async function () {
      // given
      const oldBadgeId = databaseBuilder.factory.buildBadge({ key: 'OLD' }).id;
      const newBadgeId = databaseBuilder.factory.buildBadge({ key: 'NEW' }).id;
      const skillSet1 = databaseBuilder.factory.buildSkillSet({
        id: 123,
        badgeId: oldBadgeId,
        skillIds: ['skillABC123', 'skillDEF456'],
      });
      const skillSet2 = databaseBuilder.factory.buildSkillSet({
        id: 456,
        badgeId: oldBadgeId,
        skillIds: ['skillHIJ789', 'skillKLM123'],
      });
      const skillSetIds = [123, 456];
      await databaseBuilder.commit();

      // when
      const newSkillSetIds = await copySkillSets({ skillSetIds, newBadgeId });

      // then
      expect(newSkillSetIds).to.have.lengthOf(2);

      const [newSkillSet1, newSkillSet2] = await knex('skill-sets').whereIn('id', newSkillSetIds).orderBy('id');
      expect(newSkillSet1.skillIds).to.deep.equal(skillSet1.skillIds);
      expect(newSkillSet1.badgeId).to.equal(newBadgeId);
      expect(newSkillSet2.skillIds).to.deep.equal(skillSet2.skillIds);
      expect(newSkillSet2.badgeId).to.equal(newBadgeId);
    });
  });
});
