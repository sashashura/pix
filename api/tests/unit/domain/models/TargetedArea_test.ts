// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Target-Profile/TargetedArea', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('hasCompetence', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return true when the competence is in area', function () {
      // given
      const competence = domainBuilder.buildTargetedCompetence({ id: 'competenceId', areaId: 'areaId' });
      const area = domainBuilder.buildTargetedArea({ id: 'areaId', competences: [competence] });

      // when
      const isIncluded = area.hasCompetence(competence.id);

      // then
      expect(isIncluded).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return false when the skill is not in tube', function () {
      // given
      const area = domainBuilder.buildTargetedArea({ id: 'areaId', competences: [] });

      // when
      const isIncluded = area.hasCompetence('someCompetenceId');

      // then
      expect(isIncluded).to.be.false;
    });
  });
});
