// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Course'.
const Course = require('../../../../lib/domain/models/Course');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildCourse({
  id = 'recCOUR123',
  description = 'description',
  imageUrl = 'imageURL',
  name = 'name',
  assessment,
  challenges = [],
  competences = [],
  competenceSkills = [],
  tubes = []
}: $TSFixMe = {}) {
  return new Course({
    id,
    // attributes
    description,
    imageUrl,
    name,
    // relations
    assessment,
    challenges,
    competences,
    competenceSkills,
    tubes,
  });
};
