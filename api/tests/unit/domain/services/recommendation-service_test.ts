// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'recommenda... Remove this comment to see the full error message
const recommendationService = require('./../../../../lib/domain/services/recommendation-service');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Campaign Recommendation Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('computeRecommendationScore', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no skill have been validated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the maximum number of points for difficulty when there is a skill with the maximum difficulty of the target profile', function () {
        // given
        const maxSkillLevelInTargetProfile = 6;
        const skills = [
          { id: 1, difficulty: 1 },
          { id: 2, difficulty: 2 },
          { id: 3, difficulty: 3 },
          { id: 4, difficulty: 6 },
        ];

        // when
        const score = recommendationService.computeRecommendationScore(skills, maxSkillLevelInTargetProfile, []);

        // then
        expect(score).to.equal(30);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return less than maximum number of points for difficulty when there is no skill with the maximum difficulty of the target profile', function () {
        // given
        const maxSkillLevelInTargetProfile = 6;
        const skills = [
          { id: 1, difficulty: 1 },
          { id: 2, difficulty: 4 },
        ];

        // when
        const score = recommendationService.computeRecommendationScore(skills, maxSkillLevelInTargetProfile, []);

        // then
        expect(score).to.equal(20);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when all skills have been validated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return maximum number points', function () {
        // given
        const maxSkillLevelInTargetProfile = 3;
        const skills = [
          { id: 1, difficulty: 1 },
          { id: 2, difficulty: 2 },
          { id: 3, difficulty: 3 },
        ];

        const knowledgeElements = [{ skillId: 1 }, { skillId: 2 }, { skillId: 3 }];
        // when
        const score = recommendationService.computeRecommendationScore(
          skills,
          maxSkillLevelInTargetProfile,
          knowledgeElements
        );

        // then
        expect(score).to.equal(100);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when only some skills have been validated', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should add more points when the next step is closer to the reached level', function () {
        // given
        const maxSkillLevelInTargetProfile = 5;
        const skills = [
          { id: 1, difficulty: 1 },
          { id: 2, difficulty: 2 },
          { id: 3, difficulty: 3 },
          { id: 4, difficulty: 5 },
        ];

        const knowledgeElements = [{ skillId: 1 }, { skillId: 2 }, { skillId: 3 }];
        // when
        const score = recommendationService.computeRecommendationScore(
          skills,
          maxSkillLevelInTargetProfile,
          knowledgeElements
        );

        // then
        expect(score).to.equal(75);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should add less points when the next step is closer to the reached level', function () {
        // given
        const maxSkillLevelInTargetProfile = 6;
        const skills = [
          { id: 1, difficulty: 1 },
          { id: 2, difficulty: 2 },
          { id: 3, difficulty: 3 },
          { id: 4, difficulty: 6 },
        ];

        const knowledgeElements = [{ skillId: 1 }];
        // when
        const score = recommendationService.computeRecommendationScore(
          skills,
          maxSkillLevelInTargetProfile,
          knowledgeElements
        );

        // then

        expect(score).to.be.closeTo(46.6, 0.1);
      });
    });
  });
});
