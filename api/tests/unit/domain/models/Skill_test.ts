// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Skill', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#Difficulty', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the difficulty of the skill', function () {
      // given
      const url1 = new Skill({ name: '@url1' });

      // then
      expect(url1.difficulty).to.be.equal(1);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#tubeNameWithoutPrefix', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the name of the tube', function () {
      // given
      const url1 = new Skill({ name: '@url1' });

      // then
      expect(url1.tubeNameWithoutPrefix).to.be.equal('url');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#tubeName', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a property fromListOfSkill', function () {
      // when
      const skill = new Skill({ name: '@web3' });

      // then
      expect(skill.tubeName).to.equal('@web');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#areEqual()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when two skills are not the same', function () {
      // given
      const [skill1, skill2] = domainBuilder.buildSkillCollection();
      // when
      const result = Skill.areEqual(skill1, skill2);
      // then
      expect(result).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if two skills have the same name', function () {
      // given
      const skill = domainBuilder.buildSkill({ name: '@skill1' });
      const otherSkill = domainBuilder.buildSkill({ name: '@skill1' });
      // when
      const result = Skill.areEqual(skill, otherSkill);
      // then
      expect(result).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if either argument is undefined', function () {
      // given
      const skill = domainBuilder.buildSkill({ name: '@skill1' });
      const otherSkill = undefined;
      // when
      const result1 = Skill.areEqual(skill, otherSkill);
      const result2 = Skill.areEqual(otherSkill, skill);
      // then
      expect(result1).to.be.false;
      expect(result2).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#areEqualById()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when two skills are not the same', function () {
      // given
      const [skill1, skill2] = domainBuilder.buildSkillCollection();
      // when
      const result = Skill.areEqualById(skill1, skill2);
      // then
      expect(result).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if two skills have the same name but different ids', function () {
      // given
      const skill = domainBuilder.buildSkill({ id: 'recID1', name: '@skill1' });
      const otherSkill = domainBuilder.buildSkill({ id: 'recID2', name: '@skill1' });
      // when
      const result = Skill.areEqualById(skill, otherSkill);
      // then
      expect(result).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false if either argument is undefined', function () {
      // given
      const skill = domainBuilder.buildSkill({ name: '@skill1' });
      const otherSkill = undefined;
      // when
      const result1 = Skill.areEqualById(skill, otherSkill);
      const result2 = Skill.areEqualById(otherSkill, skill);
      // then
      expect(result1).to.be.false;
      expect(result2).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true if if two skills have the same ids', function () {
      // given
      const skill = domainBuilder.buildSkill({ id: 'rec1234567890' });
      const otherSkill = domainBuilder.buildSkill({ id: 'rec1234567890' });
      // when
      const result = Skill.areEqualById(skill, otherSkill);
      // then
      expect(result).to.be.true;
    });
  });
});
