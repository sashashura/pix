// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Progressio... Remove this comment to see the full error message
const Progression = require('../../../../lib/domain/models/Progression');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Progression', function () {
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const [skillLevel1, skillLevel2, skillLevel3] = domainBuilder.buildSkillCollection();

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#completionRate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the profile is not fully evaluated', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and there is no knowledge elements', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a completionRate of 0', function () {
          // Given
          const targetedSkills = [skillLevel1, skillLevel2, skillLevel3];
          const knowledgeElements: $TSFixMe = [];

          // When
          const progression = new Progression({ targetedSkills, knowledgeElements, isProfileCompleted: false });

          // Then
          expect(progression.completionRate).to.eq(0);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and knowledge elements are present', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return 1 when all targeted skills are evaluated', function () {
          // Given
          const targetedSkills = [skillLevel1, skillLevel2];
          const knowledgeElements = [
            domainBuilder.buildKnowledgeElement({ skillId: skillLevel1.id }),
            domainBuilder.buildKnowledgeElement({ skillId: skillLevel2.id }),
          ];

          // When
          const progression = new Progression({ targetedSkills, knowledgeElements, isProfileCompleted: false });

          // Then
          expect(progression.completionRate).to.eq(1);
        });

        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a ratio different than 1 when some targeted skills are not evaluated', function () {
          // Given
          const targetedSkills = [skillLevel1, skillLevel2, skillLevel3];
          const knowledgeElements = [
            domainBuilder.buildKnowledgeElement({ skillId: skillLevel1.id }),
            domainBuilder.buildKnowledgeElement({ skillId: skillLevel2.id }),
          ];

          // When
          const progression = new Progression({ targetedSkills, knowledgeElements, isProfileCompleted: false });

          // Then
          expect(progression.completionRate).to.eq(0.6666666666666666);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('and the profile contains knowledge elements on skills not in the targeted skills ', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not take them into account and mark the completion at 1 (equal 100%)', function () {
          // Given
          const targetedSkills = [skillLevel1];
          const knowledgeElements = [
            domainBuilder.buildKnowledgeElement({ skillId: skillLevel1.id, status: 'invalidated' }),
            domainBuilder.buildKnowledgeElement({ skillId: skillLevel2.id, status: 'invalidated' }),
          ];

          // When
          const progression = new Progression({ targetedSkills, knowledgeElements, isProfileCompleted: false });

          // Then
          expect(progression.completionRate).to.eq(1);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the profile is fully evaluated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the completionRate of 1', function () {
        // Given
        const targetedSkills = [skillLevel1, skillLevel2, skillLevel3];
        const knowledgeElements: $TSFixMe = [];

        // When
        const progression = new Progression({ targetedSkills, knowledgeElements, isProfileCompleted: true });

        // Then
        expect(progression.completionRate).to.eq(1);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#generateIdFromAssessmentId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the id prepended with "progression-"', function () {
      // Given
      const assessmentId = 12345;
      const expectedProgressionId = `progression-${assessmentId}`;

      // When
      const progressionId = Progression.generateIdFromAssessmentId(assessmentId);

      // Then
      expect(progressionId).to.equal(expectedProgressionId);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getAssessmentIdFromId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the id without the "progression-"', function () {
      // Given
      const expectedAssessmentId = 12345;
      const progressionId = `progression-${expectedAssessmentId}`;

      // When
      const assessmentId = Progression.getAssessmentIdFromId(progressionId);

      // Then
      expect(assessmentId).to.equal(expectedAssessmentId);
    });
  });
});
