// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
const Course = require('../models/Course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseRepo... Remove this comment to see the full error message
const courseRepository = require('../../infrastructure/repositories/course-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCourse({
    courseId
  }: $TSFixMe) {
    // TODO: delete when campaign assessment does not have courses anymore
    if (_.startsWith(courseId, '[NOT USED] Campaign')) {
      return Promise.resolve(new Course({ id: courseId }));
    }

    // TODO This repo switch should not be here because we make a technical discrimination on the course id
    if (_.startsWith(courseId, 'rec')) {
      return courseRepository.get(courseId);
    }

    // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
    throw new NotFoundError();
  },
};
