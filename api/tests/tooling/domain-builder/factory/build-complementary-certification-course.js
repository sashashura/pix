const ComplementaryCertificationCourse = require('../../../../lib/domain/models/ComplementaryCertificationCourse');

module.exports = function buildComplementaryCertificationCourse({
  id = 1234,
  complementaryCertificationId = 234,
  certificationCourseId = 456,
} = {}) {
  return new ComplementaryCertificationCourse({
    id,
    complementaryCertificationId,
    certificationCourseId,
  });
};
