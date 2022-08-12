const STATUS = {
  STUDENT: 'ST',
  APPRENTICE: 'AP',
};
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationLearner {
  static STATUS = STATUS;

  MEFCode: $TSFixMe;
  birthCity: $TSFixMe;
  birthCityCode: $TSFixMe;
  birthCountryCode: $TSFixMe;
  birthProvinceCode: $TSFixMe;
  birthdate: $TSFixMe;
  division: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  isDisabled: $TSFixMe;
  lastName: $TSFixMe;
  middleName: $TSFixMe;
  nationalStudentId: $TSFixMe;
  organizationId: $TSFixMe;
  preferredLastName: $TSFixMe;
  sex: $TSFixMe;
  status: $TSFixMe;
  thirdName: $TSFixMe;
  updatedAt: $TSFixMe;
  userId: $TSFixMe;

  constructor({
    id,
    lastName,
    preferredLastName,
    firstName,
    middleName,
    thirdName,
    sex = null,
    birthdate,
    birthCity,
    birthCityCode,
    birthProvinceCode,
    birthCountryCode,
    MEFCode,
    status,
    nationalStudentId,
    division,
    isDisabled,
    updatedAt,
    userId,
    organizationId
  }: $TSFixMe = {}) {
    this.id = id;
    this.lastName = lastName;
    this.preferredLastName = preferredLastName;
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.sex = sex;
    this.birthdate = birthdate;
    this.birthCity = birthCity;
    this.birthCityCode = birthCityCode;
    this.birthProvinceCode = birthProvinceCode;
    this.birthCountryCode = birthCountryCode;
    this.MEFCode = MEFCode;
    this.status = status;
    this.nationalStudentId = nationalStudentId;
    this.division = division;
    this.isDisabled = isDisabled;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.organizationId = organizationId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationLearner;
