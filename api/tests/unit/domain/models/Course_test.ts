// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
const Course = require('../../../../lib/domain/models/Course');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | Course', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#nbChallenges', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the number of challenges', function () {
      // given
      const challenges = ['firstChallenge', 'secondChallenge'];
      const course = new Course({ challenges });

      // when
      const result = course.nbChallenges;

      // then
      expect(result).to.equal(2);
    });
  });
});
