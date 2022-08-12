// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function uncancelCertificationCourse({
  certificationCourseId,
  certificationCourseRepository
}: $TSFixMe) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  certificationCourse.uncancel();
  await certificationCourseRepository.update(certificationCourse);
};
