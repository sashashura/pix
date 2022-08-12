// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCourseRepository = require('../../infrastructure/repositories/certification-course-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async execute({
    userId,
    certificationCourseId
  }: $TSFixMe) {
    const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
    return certificationCourse.doesBelongTo(userId);
  },
};
