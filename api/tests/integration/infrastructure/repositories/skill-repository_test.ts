// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, mockLearningContent, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../../../lib/domain/models/Skill');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'skillRepos... Remove this comment to see the full error message
const skillRepository = require('../../../../lib/infrastructure/repositories/skill-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | skill-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#list', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve all skills', async function () {
      // given
      const competenceId = 'recCompetenceId';
      const activeSkill = domainBuilder.buildSkill({ competenceId });
      const archivedSkill = domainBuilder.buildSkill({ competenceId });
      const activeSkill_otherCompetence = domainBuilder.buildSkill({ competenceId: 'recAnotherCompetence' });
      const learningContent = {
        skills: [
          { ...activeSkill, status: 'actif' },
          { ...archivedSkill, status: 'archivé' },
          { ...activeSkill_otherCompetence, status: 'actif' },
        ],
      };
      mockLearningContent(learningContent);
      // when
      const skills = await skillRepository.list();

      // then
      expect(skills).to.deep.equal([activeSkill, archivedSkill, activeSkill_otherCompetence]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findActiveByCompetenceId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return all skills in the given competence', async function () {
      // given
      const competenceId = 'recCompetenceId';
      const activeSkill = domainBuilder.buildSkill({ competenceId });
      const nonActiveSkill = domainBuilder.buildSkill({ competenceId });
      const activeSkill_otherCompetence = domainBuilder.buildSkill({ competenceId: 'recAnotherCompetence' });
      const learningContent = {
        skills: [
          { ...activeSkill, status: 'actif' },
          { ...nonActiveSkill, status: 'archivé' },
          { ...activeSkill_otherCompetence, status: 'actif' },
        ],
      };
      mockLearningContent(learningContent);
      // when
      const skills = await skillRepository.findActiveByCompetenceId(competenceId);

      // then
      expect(skills).to.have.lengthOf(1);
      expect(skills[0]).to.be.instanceof(Skill);
      expect(skills[0]).to.be.deep.equal(activeSkill);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperativeByCompetenceId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve all skills for one competence', async function () {
      // given
      const competenceId = 'recCompetenceId';
      const activeSkill = domainBuilder.buildSkill({ competenceId });
      const archivedSkill = domainBuilder.buildSkill({ competenceId });
      const nonOperativeSkill = domainBuilder.buildSkill({ competenceId });
      const activeSkill_otherCompetence = domainBuilder.buildSkill({ competenceId: 'recAnotherCompetence' });
      const learningContent = {
        skills: [
          { ...activeSkill, status: 'actif' },
          { ...archivedSkill, status: 'archivé' },
          { ...nonOperativeSkill, status: 'BLABLA' },
          { ...activeSkill_otherCompetence, status: 'actif' },
        ],
      };
      mockLearningContent(learningContent);

      // when
      const skills = await skillRepository.findOperativeByCompetenceId(competenceId);

      // then
      expect(skills).to.have.lengthOf(2);
      expect(skills[0]).to.be.instanceof(Skill);
      expect(skills).to.deep.include.members([activeSkill, archivedSkill]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findOperativeByIds', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve all skills passed by ids', async function () {
      // given
      const competenceId = 'recCompetenceId';
      const activeSkill = domainBuilder.buildSkill({ competenceId });
      const archivedSkill = domainBuilder.buildSkill({ competenceId });
      const nonOperativeSkill = domainBuilder.buildSkill({ competenceId });
      const learningContent = {
        skills: [
          { ...activeSkill, status: 'actif' },
          { ...archivedSkill, status: 'archivé' },
          { ...nonOperativeSkill, status: 'BLABLA' },
        ],
      };
      mockLearningContent(learningContent);
      // when
      const skills = await skillRepository.findOperativeByIds([activeSkill.id, archivedSkill.id, nonOperativeSkill.id]);

      // then
      expect(skills).to.have.lengthOf(2);
      expect(skills[0]).to.be.instanceof(Skill);
      expect(skills).to.deep.include.members([activeSkill, archivedSkill]);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let skill: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      skill = domainBuilder.buildSkill();
      const learningContent = {
        skills: [skill],
      };
      mockLearningContent(learningContent);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a skill by id', async function () {
      // when
      const actualSkill = await skillRepository.get(skill.id);

      // then
      expect(actualSkill).to.deep.equal(skill);
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when skillId is not found', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a Domain error', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(skillRepository.get)('skillIdNotFound');

        // then
        expect(error).to.be.instanceOf(NotFoundError).and.have.property('message', 'Erreur, compétence introuvable');
      });
    });
  });
});
