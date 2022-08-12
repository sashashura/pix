// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex, expect, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillSetRe... Remove this comment to see the full error message
const skillSetRepository = require('../../../../lib/infrastructure/repositories/skill-set-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SkillSet'.
const SkillSet = require('../../../../lib/domain/models/SkillSet');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Skill Set Repository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('skill-sets').delete();
    await knex('badges').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save SkillSet', async function () {
      // given
      const { id: badgeId } = databaseBuilder.factory.buildBadge();
      await databaseBuilder.commit();
      const skillSet = {
        name: 'Mon SkillSet',
        skillIds: ['recSkill1', 'recSkill2'],
        badgeId,
      };

      const expectedSkillSet = {
        name: 'Mon SkillSet',
        skillIds: ['recSkill1', 'recSkill2'],
        badgeId,
      };

      // when
      const result = await skillSetRepository.save({ skillSet });

      // then
      expect(result).to.be.instanceOf(SkillSet);
      expect(omit(result, 'id')).to.deep.equal(expectedSkillSet);
    });
  });
});
