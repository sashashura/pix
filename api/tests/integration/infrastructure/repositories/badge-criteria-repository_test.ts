// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'badgeCrite... Remove this comment to see the full error message
const badgeCriteriaRepository = require('../../../../lib/infrastructure/repositories/badge-criteria-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'BadgeCrite... Remove this comment to see the full error message
const BadgeCriterion = require('../../../../lib/domain/models/BadgeCriterion');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Badge Criteria Repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('badge-criteria').delete();
    await knex('badges').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save CampaignParticipation badge-criterion', async function () {
      // given
      const { id: badgeId } = databaseBuilder.factory.buildBadge();
      await databaseBuilder.commit();
      const badgeCriterion = {
        threshold: 90,
        scope: 'CampaignParticipation',
        badgeId,
      };

      const expectedBadgeCriterion = {
        threshold: 90,
        scope: 'CampaignParticipation',
        badgeId,
        skillSetIds: null,
      };

      // when
      const result = await badgeCriteriaRepository.save({ badgeCriterion });

      // then
      expect(result).to.be.instanceOf(BadgeCriterion);
      expect(omit(result, 'id')).to.deep.equal(expectedBadgeCriterion);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save SkillSet badge-criterion', async function () {
      // given
      const { id: badgeId } = databaseBuilder.factory.buildBadge();
      const { id: skillSetId } = databaseBuilder.factory.buildSkillSet();
      await databaseBuilder.commit();
      const badgeCriterion = {
        threshold: 80,
        scope: 'SkillSet',
        badgeId,
        skillSetIds: [skillSetId],
      };

      const expectedBadgeCriterion = {
        threshold: 80,
        scope: 'SkillSet',
        badgeId,
        skillSetIds: [skillSetId],
      };

      // when
      const result = await badgeCriteriaRepository.save({ badgeCriterion });

      // then
      expect(result).to.be.instanceOf(BadgeCriterion);
      expect(omit(result, 'id')).to.deep.equal(expectedBadgeCriterion);
    });
  });
});
