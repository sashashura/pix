// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function abortCertificationCourse({
  certificationCourseRepository,
  certificationCourseId,
  abortReason
}: $TSFixMe) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  certificationCourse.abort(abortReason);
  await certificationCourseRepository.update(certificationCourse);
};
