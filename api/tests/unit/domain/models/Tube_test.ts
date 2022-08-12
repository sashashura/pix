// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../../../../lib/domain/models/Tube');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Tube', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should accept a list of skills as parameter', function () {
      // given
      const skills = [new Skill({ name: '@web3' }), new Skill({ name: '@web2' })];

      // when
      const tube = new Tube({ skills });

      // then
      expect(tube.skills).to.equal(skills);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a name from skills', function () {
      // given
      const skills = [new Skill({ name: '@web3' }), new Skill({ name: '@web2' })];

      // when
      const tube = new Tube({ skills });

      // then
      expect(tube.name).to.equal('web');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should have a name from constructor', function () {
      // given
      const skills = [new Skill({ name: '@web3' })];

      // when
      const tube = new Tube({ skills, name: 'tubeName' });

      // then
      expect(tube.name).to.equal('tubeName');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not have a name when skills list is empty and name is not provided', function () {
      // when
      const tube = new Tube();

      // then
      expect(tube.name).to.equal('');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create the tube without skills', function () {
      // when
      const tube = new Tube({});

      // then
      expect(tube.name).to.equal('');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getEasierThan()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the skill itself if it is alone within its tube', function () {
      // given
      const skill = new Skill({ name: '@url1' });
      const skills = [skill];
      const tube = new Tube({ skills });

      // when
      const easierSkills = tube.getEasierThan(skill);

      // then
      expect(easierSkills).to.be.deep.equal(skills);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return url1 and url3 when requesting skills easier than url3 within url1-3-5', function () {
      // given
      const url1 = new Skill({ name: '@url1' });
      const url3 = new Skill({ name: '@url3' });
      const url5 = new Skill({ name: '@url5' });
      const skills = [url1, url3, url5];
      const tube = new Tube({ skills });

      // when
      const easierSkills = tube.getEasierThan(url3);

      // then
      expect(easierSkills).to.be.deep.equal([url1, url3]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getHarderThan()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the skill itself if it is alone within its tube', function () {
      // given
      const skill = new Skill({ name: '@url1' });
      const skills = [skill];
      const tube = new Tube({ skills });

      // when
      const easierSkills = tube.getHarderThan(skill);

      // then
      expect(easierSkills).to.be.deep.equal(skills);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return url3 and url5 when requesting skills harder than url3 within url1-3-5', function () {
      // given
      const url1 = new Skill({ name: '@url1' });
      const url3 = new Skill({ name: '@url3' });
      const url5 = new Skill({ name: '@url5' });
      const skills = [url1, url3, url5];
      const tube = new Tube({ skills });

      // when
      const easierSkills = tube.getHarderThan(url3);

      // then
      expect(easierSkills).to.be.deep.equal([url3, url5]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#addSkill()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should add skill to the list of skills', function () {
      // given
      const skillWeb1 = new Skill({ name: '@web1' });
      const skillWeb2 = new Skill({ name: '@web2' });
      const tube = new Tube({ skills: [skillWeb1] });

      // when
      tube.addSkill(skillWeb2);

      // then
      expect(tube.skills).to.be.deep.equal([skillWeb1, skillWeb2]);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not add skill if skill is already present to the list of skills', function () {
      // given
      const skillWeb1 = new Skill({ name: '@web1' });
      const tube = new Tube({ skills: [skillWeb1] });

      // when
      tube.addSkill(skillWeb1);

      // then
      expect(tube.skills).to.be.deep.equal([skillWeb1]);
    });
  });
});
