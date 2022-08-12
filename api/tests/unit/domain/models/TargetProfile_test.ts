// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | TargetProfile', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasBadges', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when target profile has badges', function () {
      // given
      const badge = domainBuilder.buildBadge();
      const targetProfile = domainBuilder.buildTargetProfile({ badges: [badge] });

      // then
      expect(targetProfile.hasBadges).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when target profile doesn‘t have badges', function () {
      // given
      const targetProfile = domainBuilder.buildTargetProfile();

      // then
      expect(targetProfile.hasBadges).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasSkill', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the skill is in target profile', function () {
      // given
      const skill = domainBuilder.buildSkill();
      const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill] });

      // when
      const isIncluded = targetProfile.hasSkill(skill.id);

      // then
      expect(isIncluded).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the skill is not in target profile', function () {
      // given
      const skill = domainBuilder.buildSkill({ id: 'someId' });
      const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill] });

      // when
      const isIncluded = targetProfile.hasSkill('someOtherId');

      // then
      expect(isIncluded).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCompetenceIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array with unique competence ids of skills in target profile', function () {
      // given
      const skill1 = domainBuilder.buildSkill({ competenceId: 'competence1' });
      const skill2 = domainBuilder.buildSkill({ competenceId: 'competence2' });
      const skill3 = domainBuilder.buildSkill({ competenceId: 'competence1' });
      const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill1, skill2, skill3] });

      // when
      const competenceIds = targetProfile.getCompetenceIds();

      // then
      expect(competenceIds).to.exactlyContain(['competence1', 'competence2']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getTargetedCompetences', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should filter the targeted competences from competences passed as argument', function () {
      // given
      const competence1 = domainBuilder.buildCompetence({ id: 'competence1' });
      const competence2 = domainBuilder.buildCompetence({ id: 'competence2' });
      const nonTargetedCompetence = domainBuilder.buildCompetence();
      const skill1 = domainBuilder.buildSkill({ competenceId: competence1.id });
      const skill2 = domainBuilder.buildSkill({ competenceId: competence1.id });
      const skill3 = domainBuilder.buildSkill({ competenceId: competence2.id });
      const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill1, skill2, skill3] });

      // when
      const targetedCompetences = targetProfile.getTargetedCompetences([
        competence1,
        competence2,
        nonTargetedCompetence,
      ]);

      // then
      expect(targetedCompetences).to.exactlyContain([competence1, competence2]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getSkillIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array with targeted skill ids', function () {
      // given
      const skill1 = domainBuilder.buildSkill({ id: 'acquis1' });
      const skill2 = domainBuilder.buildSkill({ id: 'acquis2' });
      const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill1, skill2] });

      // when
      const targetedSkillIds = targetProfile.getSkillIds();

      // then
      expect(targetedSkillIds).to.exactlyContain(['acquis1', 'acquis2']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getSkillCountForCompetence', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return count of skills within competence in target profile', function () {
      // given
      const competence1 = domainBuilder.buildCompetence({ id: 'competence1' });
      const competence2 = domainBuilder.buildCompetence({ id: 'competence2' });
      const skill1 = domainBuilder.buildSkill({ competenceId: competence1.id });
      const skill2 = domainBuilder.buildSkill({ competenceId: competence1.id });
      const skill3 = domainBuilder.buildSkill({ competenceId: competence2.id });
      const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill1, skill2, skill3] });

      // when
      const skillCountForCompetence = targetProfile.getSkillCountForCompetence(competence1.id);

      // then
      expect(skillCountForCompetence).to.equal(2);
    });
  });
});
