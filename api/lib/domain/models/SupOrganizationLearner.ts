// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'checkValid... Remove this comment to see the full error message
const { checkValidation } = require('../validators/sup-organization-learner-validator');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
class SupOrganizationLearner {
  birthdate: $TSFixMe;
  department: $TSFixMe;
  diploma: $TSFixMe;
  educationalTeam: $TSFixMe;
  email: $TSFixMe;
  firstName: $TSFixMe;
  group: $TSFixMe;
  lastName: $TSFixMe;
  middleName: $TSFixMe;
  organizationId: $TSFixMe;
  preferredLastName: $TSFixMe;
  studentNumber: $TSFixMe;
  studyScheme: $TSFixMe;
  thirdName: $TSFixMe;
  constructor({
    firstName,
    middleName,
    thirdName,
    lastName,
    preferredLastName,
    studentNumber,
    email,
    birthdate,
    diploma,
    department,
    educationalTeam,
    group,
    studyScheme,
    organizationId
  }: $TSFixMe = {}) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.lastName = lastName;
    this.preferredLastName = preferredLastName;
    this.studentNumber = studentNumber;
    this.email = email;
    this.birthdate = birthdate;
    this.diploma = diploma;
    this.department = department;
    this.educationalTeam = educationalTeam;
    this.group = group;
    this.studyScheme = studyScheme;
    this.organizationId = organizationId;
    checkValidation(this);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SupOrganizationLearner;
