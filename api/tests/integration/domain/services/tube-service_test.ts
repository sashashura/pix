// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../../../lib/domain/models/Tube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'computeTub... Remove this comment to see the full error message
const { computeTubesFromSkills } = require('../../../../lib/domain/services/tube-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Domain | Services | TubeService', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#computeTubesFromSkills', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an array of tubes when all challenges require only one skill', function () {
      // given
      const web4 = new Skill({ name: '@web4' });
      const web5 = new Skill({ name: '@web5' });
      const url1 = new Skill({ name: '@url1' });
      const listSkills = [web4, web5, url1];
      const tubeWeb = new Tube({ skills: [web4, web5] });
      const tubeUrl = new Tube({ skills: [url1] });
      const expectedTubes = [tubeWeb, tubeUrl];

      // when
      const actualTubes = computeTubesFromSkills(listSkills);

      // then
      expect(actualTubes).to.deep.equal(expectedTubes);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not add the same skill twice in a tube', function () {
      // given
      const web4 = new Skill({ name: '@web4' });
      const web5 = new Skill({ name: '@web5' });
      const url1 = new Skill({ name: '@url1' });
      const listSkills = [web5, web4, url1, url1];
      const tubeWeb = new Tube({ skills: [web4, web5] });
      const tubeUrl = new Tube({ skills: [url1] });
      const expectedTubes = [tubeWeb, tubeUrl];

      // when
      const actualTubes = computeTubesFromSkills(listSkills);

      // then
      expect(actualTubes).to.deep.equal(expectedTubes);
    });
  });
});
