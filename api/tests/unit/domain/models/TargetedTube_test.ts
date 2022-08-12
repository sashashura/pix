// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Target-Profile/TargetedTube', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('hasSkill', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the skill is in tube', function () {
      // given
      const skill = domainBuilder.buildTargetedSkill({ id: 'skillId', tubeId: 'tubeId' });
      const tube = domainBuilder.buildTargetedTube({ id: 'tubeId', skills: [skill] });

      // when
      const isIncluded = tube.hasSkill(skill.id);

      // then
      expect(isIncluded).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the skill is not in tube', function () {
      // given
      const tube = domainBuilder.buildTargetedTube({ id: 'tubeId', skills: [] });

      // when
      const isIncluded = tube.hasSkill('someSkillId');

      // then
      expect(isIncluded).to.be.false;
    });
  });
});
