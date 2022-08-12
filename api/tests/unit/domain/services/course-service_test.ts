// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseServ... Remove this comment to see the full error message
const courseService = require('../../../../lib/domain/services/course-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseRepo... Remove this comment to see the full error message
const courseRepository = require('../../../../lib/infrastructure/repositories/course-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../../../lib/infrastructure/logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Service | Course Service', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCourse', function () {
    const userId = 1;
    const learningContentCourse = { id: 'recLearningContentId' };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(courseRepository, 'get');
      sinon.stub(logger, 'error');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the course repository', function () {
      // given
      const givenCourseId = 'recLearningContentId';
      courseRepository.get.resolves(learningContentCourse);

      // when
      const promise = courseService.getCourse({ courseId: givenCourseId, userId });

      // then
      return promise.then(() => {
        expect(courseRepository.get).to.have.been.called;
        expect(courseRepository.get).to.have.been.calledWith(givenCourseId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the course exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a Course from the repository', async function () {
        // given
        const courseId = 'recLearningContentId';
        const aCourse = Symbol('A course');
        courseRepository.get.withArgs(courseId).resolves(aCourse);

        // when
        const result = await courseService.getCourse({ courseId });

        // then
        expect(result).to.equal(aCourse);
      });
    });
  });
});
