// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
const TargetProfileForSpecifier = require('../../../../../lib/domain/read-models/campaign/TargetProfileForSpecifier');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('TargetProfileForSpecifier', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#tubeCount', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the number of tubes', function () {
      const skills = [
        domainBuilder.buildSkill({ tubeId: 'tube1' }),
        domainBuilder.buildSkill({ tubeId: 'tube1' }),
        domainBuilder.buildSkill({ tubeId: 'tube2' }),
      ];

      const targetProfile = new TargetProfileForSpecifier({
        id: 1,
        name: 'name',
        skills: skills,
        thematicResults: [],
        hasStage: true,
        description: null,
      });

      expect(targetProfile.tubeCount).to.equal(2);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#thematicResultCount', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the number of thematic result', function () {
      const thematicResults = [domainBuilder.buildBadge(), domainBuilder.buildBadge()];
      const targetProfile = new TargetProfileForSpecifier({
        id: 1,
        name: 'name',
        skills: [],
        thematicResults,
        hasStage: true,
        description: null,
      });

      expect(targetProfile.thematicResultCount).to.equal(2);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasStage', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when hasStage is true', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns true', function () {
        const targetProfile = new TargetProfileForSpecifier({
          id: 1,
          name: 'name',
          skills: [],
          thematicResults: [],
          hasStage: true,
          description: null,
        });

        expect(targetProfile.hasStage).to.equal(true);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when hasStage is false', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('returns false', function () {
        const targetProfile = new TargetProfileForSpecifier({
          id: 1,
          name: 'name',
          skills: [],
          thematicResults: [],
          hasStage: false,
          description: null,
        });

        expect(targetProfile.hasStage).to.equal(false);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#name', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the name', function () {
      const targetProfile = new TargetProfileForSpecifier({
        id: 1,
        name: 'name',
        skills: [],
        thematicResults: [],
        hasStage: false,
        description: 'description',
      });

      expect(targetProfile.name).to.equal('name');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#description', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the description', function () {
      const targetProfile = new TargetProfileForSpecifier({
        id: 1,
        name: 'name',
        skills: [],
        thematicResults: [],
        hasStage: false,
        description: 'description',
      });

      expect(targetProfile.description).to.equal('description');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#category', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns the category', function () {
      const targetProfile = new TargetProfileForSpecifier({
        id: 1,
        name: 'name',
        skills: [],
        thematicResults: [],
        hasStage: false,
        description: 'description',
        category: 'SUBJECT',
      });

      expect(targetProfile.category).to.equal('SUBJECT');
    });
  });
});
