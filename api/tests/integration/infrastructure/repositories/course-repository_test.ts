// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, catchErr, mockLearningContent } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
const Course = require('../../../../lib/domain/models/Course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseRepo... Remove this comment to see the full error message
const courseRepository = require('../../../../lib/infrastructure/repositories/course-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | course-repository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when course exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the course', async function () {
        // given
        const expectedCourse = domainBuilder.buildCourse();
        mockLearningContent({ courses: [{ ...expectedCourse }] });

        // when
        const actualCourse = await courseRepository.get(expectedCourse.id);

        // then
        expect(actualCourse).to.be.instanceOf(Course);
        expect(actualCourse).to.deep.equal(expectedCourse);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCourseName', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when course does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all areas without fetching competences', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(courseRepository.getCourseName)('illusion');

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when course exists', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the course name', async function () {
        // given
        const expectedCourse = domainBuilder.buildCourse();
        mockLearningContent({ courses: [{ ...expectedCourse }] });

        // when
        const actualCourseName = await courseRepository.getCourseName(expectedCourse.id);

        // then
        expect(actualCourseName).to.equal(expectedCourse.name);
      });
    });
  });
});
