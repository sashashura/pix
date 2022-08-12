// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
const Course = require('../../domain/models/Course');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'courseData... Remove this comment to see the full error message
const courseDatasource = require('../datasources/learning-content/course-datasource');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('../datasources/learning-content/LearningContentResourceNotFound');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(courseDataObject: $TSFixMe) {
  return new Course({
    id: courseDataObject.id,
    name: courseDataObject.name,
    description: courseDataObject.description,
    imageUrl: courseDataObject.imageUrl,
    challenges: courseDataObject.challenges,
    competences: courseDataObject.competences,
  });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
async function _get(id: $TSFixMe) {
  try {
    const courseDataObject = await courseDatasource.get(id);
    return _toDomain(courseDataObject);
  } catch (error) {
    if (error instanceof LearningContentResourceNotFound) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
      throw new NotFoundError();
    }
    throw error;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: $TSFixMe) {
    return _get(id);
  },

  async getCourseName(id: $TSFixMe) {
    try {
      const course = await _get(id);
      return (course as $TSFixMe).name;
    } catch (err) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError("Le test demandé n'existe pas");
    }
  },
};
