// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'StudentFor... Remove this comment to see the full error message
class StudentForEnrollment {
  birthdate: $TSFixMe;
  division: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  isEnrolled: $TSFixMe;
  lastName: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    division,
    isEnrolled
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.division = division;
    this.isEnrolled = isEnrolled;
  }

  static fromStudentsAndCertificationCandidates({
    student,
    certificationCandidates
  }: $TSFixMe) {
    const isEnrolled = certificationCandidates.some((candidate: $TSFixMe) => candidate.organizationLearnerId === student.id);

    return new StudentForEnrollment({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      birthdate: student.birthdate,
      division: student.division,
      isEnrolled,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = StudentForEnrollment;
