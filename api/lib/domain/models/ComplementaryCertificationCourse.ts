// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertificationCourse {
  certificationCourseId: $TSFixMe;
  complementaryCertificationId: $TSFixMe;
  id: $TSFixMe;
  constructor({
    id,
    complementaryCertificationId,
    certificationCourseId
  }: $TSFixMe) {
    this.id = id;
    this.complementaryCertificationId = complementaryCertificationId;
    this.certificationCourseId = certificationCourseId;
  }

  static fromComplementaryCertificationId(id: $TSFixMe) {
    return new ComplementaryCertificationCourse({
      complementaryCertificationId: id,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertificationCourse;
