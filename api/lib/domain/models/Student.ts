// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Student'.
class Student {
  account: $TSFixMe;
  nationalStudentId: $TSFixMe;
  constructor({
    nationalStudentId,
    account
  }: $TSFixMe = {}) {
    this.nationalStudentId = nationalStudentId;
    this.account = account;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Student;
