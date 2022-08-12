// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Target-Profile/TargetedCompetence', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('get#skillCount', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the count of skills across all tubes within competence', function () {
      // given
      const skill1a = domainBuilder.buildTargetedSkill({ id: 'recSkill1a', tubeId: 'recTube1' });
      const skill1b = domainBuilder.buildTargetedSkill({ id: 'recSkill1b', tubeId: 'recTube1' });
      const skill2 = domainBuilder.buildTargetedSkill({ id: 'recSkill2', tubeId: 'recTube2' });
      const tube1 = domainBuilder.buildTargetedTube({
        id: 'recTube1',
        skills: [skill1a, skill1b],
        competenceId: 'recCompetenceId',
      });
      const tube2 = domainBuilder.buildTargetedTube({
        id: 'recTube2',
        skills: [skill2],
        competenceId: 'recCompetenceId',
      });
      const competence = domainBuilder.buildTargetedCompetence({ id: 'recCompetenceId', tubes: [tube1, tube2] });

      // when
      const skillCount = competence.skillCount;

      // then
      expect(skillCount).to.equal(3);
    });
  });
});
