// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, hFake, sinon, generateValidRequestAuthorizationHeader } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
const Course = require('../../../../lib/domain/models/Course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseServ... Remove this comment to see the full error message
const courseService = require('../../../../lib/domain/services/course-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseSeri... Remove this comment to see the full error message
const courseSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/course-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseCont... Remove this comment to see the full error message
const courseController = require('../../../../lib/application/courses/course-controller');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | course-controller', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(courseService, 'getCourse');
    sinon.stub(courseSerializer, 'serialize');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    let course: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      course = new Course({ id: 'course_id' });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fetch and return the given course, serialized as JSONAPI', async function () {
      // given
      const userId = 42;
      courseService.getCourse.resolves(course);
      courseSerializer.serialize.callsFake(() => course);
      const request = {
        params: { id: 'course_id' },
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        pre: { userId },
      };

      // when
      const response = await courseController.get(request, hFake);

      // then
      expect(courseService.getCourse).to.have.been.called;
      expect(courseService.getCourse).to.have.been.calledWithExactly({ courseId: 'course_id', userId });
      expect(courseSerializer.serialize).to.have.been.called;
      expect(courseSerializer.serialize).to.have.been.calledWithExactly(course);
      expect(response).to.deep.equal(course);
    });
  });
});
