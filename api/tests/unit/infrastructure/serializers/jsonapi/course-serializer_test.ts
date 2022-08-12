// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/course-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
const Course = require('../../../../../lib/domain/models/Course');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | course-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Course model object into JSON API data', function () {
      const course = new Course({
        id: 'course_id',
        name: 'Name of the course',
        description: 'Description of the course',
        imageUrl: 'http://image.url',
        challenges: ['rec_challenge_1', 'rec_challenge_2', 'rec_challenge_3', 'rec_challenge_4', 'rec_challenge_5'],
      });

      // when
      const json = serializer.serialize(course);

      // then
      expect(json).to.deep.equal({
        data: {
          type: 'courses',
          id: course.id,
          attributes: {
            name: course.name,
            description: course.description,
            'image-url': 'http://image.url',
            'nb-challenges': 5,
          },
        },
      });
    });
  });
});
