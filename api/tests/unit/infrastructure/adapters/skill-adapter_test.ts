// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillAdapt... Remove this comment to see the full error message
const skillAdapter = require('../../../../lib/infrastructure/adapters/skill-adapter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Adapter | skillAdapter', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fromDatasourceObject', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a Skill model', function () {
      // given
      const skillDataObject = domainBuilder.buildSkillLearningContentDataObject();
      const expectedSkill = domainBuilder.buildSkill({
        id: skillDataObject.id,
        name: skillDataObject.name,
        pixValue: skillDataObject.pixValue,
        competenceId: skillDataObject.competenceId,
        tutorialIds: ['recCO0X22abcdefgh'],
        tubeId: skillDataObject.tubeId,
        version: skillDataObject.version,
        level: skillDataObject.level,
      });

      // when
      const skill = skillAdapter.fromDatasourceObject(skillDataObject);

      // then
      expect(skill).to.be.an.instanceOf(Skill);
      expect(skill).to.deep.equal(expectedSkill);
    });
  });
});
