// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfile = require('../../../../../lib/domain/models/TargetProfile');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const skillsFilter = require('../../../../../lib/domain/services/algorithm-methods/skills-filter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../../../../lib/domain/models/Tube');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KNOWLEDGE_... Remove this comment to see the full error message
const KNOWLEDGE_ELEMENT_STATUS = {
  VALIDATED: 'validated',
  INVALIDATED: 'invalidated',
};

function setPlayableSkills(skills: $TSFixMe) {
  skills.forEach((skill: $TSFixMe) => {
    skill.isPlayable = true;
  });
}

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | services | smart-random | skillsFilter', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getFilteredSkillsForFirstChallenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a first skill possible', function () {
      // given
      const skill1 = domainBuilder.buildSkill({ name: '@web3' });
      const targetProfile = new TargetProfile({ skills: [skill1] });
      const knowledgeElements: $TSFixMe = [];
      const tubes = [new Tube({ skills: [skill1] })];
      setPlayableSkills(targetProfile.skills);

      // when
      const result = skillsFilter.getFilteredSkillsForFirstChallenge({
        knowledgeElements,
        tubes,
        targetSkills: targetProfile.skills,
      });

      // then
      expect(result).to.deep.equal([skill1]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a skill even if the only tube has a skill with difficulty > 3', function () {
      // given
      const skill1 = domainBuilder.buildSkill({ name: '@web4' });
      const targetProfile = new TargetProfile({ skills: [skill1] });
      const knowledgeElements: $TSFixMe = [];
      const tubes = [new Tube({ skills: [skill1] })];
      setPlayableSkills(targetProfile.skills);

      // when
      const result = skillsFilter.getFilteredSkillsForFirstChallenge({
        knowledgeElements,
        tubes,
        targetSkills: targetProfile.skills,
      });

      // then
      expect(result).to.deep.equal([skill1]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a skill valid from a tubes with max level at 3 (HAPPY PATH)', function () {
      // given
      const skillTube1Level2 = domainBuilder.buildSkill({ id: 'rec1', name: '@web2' });
      const skillTube1Level4 = domainBuilder.buildSkill({ id: 'rec2', name: '@web4' });
      const skillFromEasyTubeLevel2 = domainBuilder.buildSkill({ id: 'rec3', name: '@url2' });
      const skillFromEasyTubeLevel1 = domainBuilder.buildSkill({ id: 'rec4', name: '@url1' });

      const targetProfile = new TargetProfile({
        skills: [skillTube1Level2, skillTube1Level4, skillFromEasyTubeLevel2, skillFromEasyTubeLevel1],
      });
      const knowledgeElements: $TSFixMe = [];
      const tubes = [
        new Tube({ skills: [skillTube1Level4, skillTube1Level2] }),
        new Tube({ skills: [skillFromEasyTubeLevel2, skillFromEasyTubeLevel1] }),
      ];
      setPlayableSkills(targetProfile.skills);

      // when
      const result = skillsFilter.getFilteredSkillsForFirstChallenge({
        knowledgeElements,
        tubes,
        targetSkills: targetProfile.skills,
      });

      // then
      expect(result).to.deep.equal([skillFromEasyTubeLevel2]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return non timed skills', function () {
      // given
      const skillTube1Level2Timed = domainBuilder.buildSkill({ id: 'rec1', name: '@web2' });
      skillTube1Level2Timed.timed = true;
      const skillTube2Level2 = domainBuilder.buildSkill({ id: 'rec2', name: '@url2' });
      const targetProfile = new TargetProfile({ skills: [skillTube1Level2Timed, skillTube2Level2] });
      const knowledgeElements: $TSFixMe = [];
      const tubes = [new Tube({ skills: [skillTube1Level2Timed] }), new Tube({ skills: [skillTube2Level2] })];
      setPlayableSkills(targetProfile.skills);

      // when
      const result = skillsFilter.getFilteredSkillsForFirstChallenge({
        knowledgeElements,
        tubes,
        targetSkills: targetProfile.skills,
      });

      // then
      expect(result).to.deep.equal([skillTube2Level2]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return timed skills if there is only timed skills', function () {
      // given
      const skillTube1Level2Timed = domainBuilder.buildSkill({ id: 'rec1', name: '@web2' });
      skillTube1Level2Timed.timed = true;
      const skillTube2Level2Timed = domainBuilder.buildSkill({ id: 'rec2', name: '@url2' });
      skillTube2Level2Timed.timed = true;
      const targetProfile = new TargetProfile({ skills: [skillTube1Level2Timed, skillTube2Level2Timed] });
      const knowledgeElements: $TSFixMe = [];
      const tubes = [new Tube({ skills: [skillTube1Level2Timed] }), new Tube({ skills: [skillTube2Level2Timed] })];
      setPlayableSkills(targetProfile.skills);

      // when
      const result = skillsFilter.getFilteredSkillsForFirstChallenge({
        knowledgeElements,
        tubes,
        targetSkills: targetProfile.skills,
      });

      // then
      expect(result).to.deep.equal([skillTube1Level2Timed, skillTube2Level2Timed]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only playable skills', function () {
      // given
      const playableSkill = domainBuilder.buildSkill({ name: '@web2' });
      const notPlayableSkill = domainBuilder.buildSkill({ name: '@url2' });
      const targetProfile = new TargetProfile({ skills: [playableSkill, notPlayableSkill] });
      const knowledgeElements: $TSFixMe = [];
      const tubes = [new Tube({ skills: [playableSkill, notPlayableSkill] })];
      playableSkill.isPlayable = true;
      notPlayableSkill.isPlayable = false;

      // when
      const result = skillsFilter.getFilteredSkillsForFirstChallenge({
        knowledgeElements,
        tubes,
        targetSkills: targetProfile.skills,
      });

      // then
      expect(result).to.deep.equal([playableSkill]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getFilteredSkillsForNextChallenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Verify rules : Skills not already tested', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not ask a question that targets a skill already assessed', function () {
        // given
        const [skill1, skill2, skillNotAssessedLevel3] = domainBuilder.buildSkillCollection();

        const targetProfile = new TargetProfile({ skills: [skill1, skill2, skillNotAssessedLevel3] });

        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({
            skillId: skill1.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'direct',
          }),
          domainBuilder.buildKnowledgeElement({
            skillId: skill2.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'direct',
          }),
        ];
        setPlayableSkills(targetProfile.skills);

        // when
        const result = skillsFilter.getFilteredSkillsForNextChallenge({
          knowledgeElements,
          predictedLevel: 3,
          isLastChallengeTimed: false,
          targetSkills: targetProfile.skills,
        });

        // then
        expect(result).to.deep.equal([skillNotAssessedLevel3]);
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Verify rules : Not skill with timed challenge after timed challenge', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a skill without timed challenge if last one was timed', function () {
        // given
        const skill1 = domainBuilder.buildSkill({ id: 'rec1', name: '@test2' });
        const skillWithoutTimedChallenge = domainBuilder.buildSkill({ id: 'rec2', name: '@url2' });
        skillWithoutTimedChallenge.timed = false;
        const skillWithTimedChallenge = domainBuilder.buildSkill({ id: 'rec3', name: '@web2' });
        skillWithTimedChallenge.timed = true;

        const targetProfile = domainBuilder.buildTargetProfile({
          skills: [skillWithoutTimedChallenge, skillWithTimedChallenge],
        });
        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({
            skillId: skill1.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'direct',
          }),
        ];
        const isLastChallengeTimed = true;
        setPlayableSkills(targetProfile.skills);

        // when
        const result = skillsFilter.getFilteredSkillsForNextChallenge({
          isLastChallengeTimed,
          knowledgeElements,
          predictedLevel: 2,
          targetSkills: targetProfile.skills,
        });

        // then
        expect(result).to.deep.equal([skillWithoutTimedChallenge]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a skill with timed challenges if last one was timed but we dont have not timed challenge', function () {
        // given
        const [skill1, skill2, skill3] = domainBuilder.buildSkillCollection();
        skill1.timed = true;
        skill2.timed = true;
        skill3.timed = true;
        const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill1, skill2, skill3] });

        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({
            skillId: skill1.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'direct',
          }),
        ];
        const isLastChallengeTimed = true;
        setPlayableSkills(targetProfile.skills);

        // when
        const result = skillsFilter.getFilteredSkillsForNextChallenge({
          knowledgeElements,
          predictedLevel: 2,
          targetSkills: targetProfile.skills,
          isLastChallengeTimed,
        });

        // then
        expect(result).to.have.members([skill2]);
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Verify rules : Remove skill too difficult', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return skills with level maximum of user level + 2', function () {
        // given
        const [skill1, skill2, skill3, skill4, skill5, skill6] = domainBuilder.buildSkillCollection({
          name: 'web',
          minLevel: 1,
          maxLevel: 6,
        });
        const targetProfile = domainBuilder.buildTargetProfile({
          skills: [skill1, skill2, skill3, skill4, skill5, skill6],
        });
        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({
            skillId: skill1.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'indirect',
          }),
          domainBuilder.buildKnowledgeElement({
            skillId: skill2.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'direct',
          }),
        ];
        const tubes = [new Tube({ skills: [skill1, skill2, skill3, skill4, skill5, skill6] })];
        setPlayableSkills(targetProfile.skills);

        // when
        const result = skillsFilter.getFilteredSkillsForNextChallenge({
          knowledgeElements,
          predictedLevel: 2,
          targetSkills: targetProfile.skills,
          tubes,
          isLastChallengeTimed: false,
        });

        // then
        expect(result).to.deep.equal([skill3, skill4]);
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Verify rules : Focus on easy tubes first', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return skills from tubes of max level 3', function () {
        // given
        const [skill3, skill4, skill5, skill6] = domainBuilder.buildSkillCollection({
          name: 'web',
          minLevel: 3,
          maxLevel: 6,
        });
        const [easyTubeSkill1, easyTubeSkill2, easyTubeSkill3] = domainBuilder.buildSkillCollection({
          name: 'url',
          minLevel: 1,
          maxLevel: 3,
        });
        const targetProfile = domainBuilder.buildTargetProfile({
          skills: [skill3, skill4, skill5, skill6, easyTubeSkill1, easyTubeSkill2, easyTubeSkill3],
        });

        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({
            skillId: easyTubeSkill1.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'direct',
          }),
        ];
        const tubes = [
          new Tube({ skills: [skill3, skill4, skill5, skill6] }),
          new Tube({ skills: [easyTubeSkill1, easyTubeSkill2, easyTubeSkill3] }),
        ];
        setPlayableSkills(targetProfile.skills);

        // when
        const result = skillsFilter.getFilteredSkillsForNextChallenge({
          knowledgeElements,
          predictedLevel: 5,
          targetSkills: targetProfile.skills,
          tubes,
          isLastChallengeTimed: false,
        });

        // then
        expect(result).to.deep.equal([easyTubeSkill2, easyTubeSkill3]);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return skills from all tubes if there is not easy tubes', function () {
        // given
        const [skill3, skill4, skill5, skill6] = domainBuilder.buildSkillCollection({
          name: 'web',
          minLevel: 3,
          maxLevel: 6,
        });
        const targetProfile = domainBuilder.buildTargetProfile({ skills: [skill3, skill4, skill5, skill6] });

        const knowledgeElements = [
          domainBuilder.buildKnowledgeElement({
            skillId: skill3.id,
            status: KNOWLEDGE_ELEMENT_STATUS.VALIDATED,
            source: 'direct',
          }),
        ];
        const tubes = [new Tube({ skills: [skill3, skill4, skill5, skill6] })];
        setPlayableSkills(targetProfile.skills);

        // when
        const result = skillsFilter.getFilteredSkillsForNextChallenge({
          knowledgeElements,
          predictedLevel: 5,
          targetSkills: targetProfile.skills,
          tubes,
          isLastChallengeTimed: false,
        });

        // then
        expect(result).to.deep.equal([skill4, skill5, skill6]);
      });
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('Verify rules: Remove skills not playable', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only playable skills', function () {
        // given
        const [notPlayableSkill, playableSkill] = domainBuilder.buildSkillCollection({
          name: 'web',
          minLevel: 3,
          maxLevel: 6,
        });
        const targetProfile = domainBuilder.buildTargetProfile({ skills: [notPlayableSkill, playableSkill] });

        const knowledgeElements: $TSFixMe = [];
        const tubes = [new Tube({ skills: [notPlayableSkill, playableSkill] })];
        notPlayableSkill.isPlayable = false;
        playableSkill.isPlayable = true;

        // when
        const result = skillsFilter.getFilteredSkillsForNextChallenge({
          knowledgeElements,
          tubes,
          targetSkills: targetProfile.skills,
        });

        // then
        expect(result).to.deep.equal([playableSkill]);
      });
    });
  });
});
