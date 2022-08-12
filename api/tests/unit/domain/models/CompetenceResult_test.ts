// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceResult = require('../../../../lib/domain/models/CompetenceResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CompetenceResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#masteryPercentage', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the correct masteryPercentage when totalSkillsCount is different than 0', function () {
      // given
      const expectedMasteryPercentage = 50;

      // when
      const competenceResult = new CompetenceResult({
        totalSkillsCount: 10,
        testedSkillsCount: 6,
        validatedSkillsCount: 5,
      });

      // then
      expect(competenceResult.masteryPercentage).to.be.equal(expectedMasteryPercentage);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return 0 when totalSkillsCount is equal to 0', function () {
      // given
      const expectedMasteryPercentage = 0;

      // when
      const competenceResult = new CompetenceResult({
        totalSkillsCount: 0,
        testedSkillsCount: 6,
        validatedSkillsCount: 5,
      });

      // then
      expect(competenceResult.masteryPercentage).to.be.equal(expectedMasteryPercentage);
    });
  });
});
