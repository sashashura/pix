// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserWithOr... Remove this comment to see the full error message
class UserWithOrganizationLearner {
  birthdate: $TSFixMe;
  campaignName: $TSFixMe;
  campaignType: $TSFixMe;
  division: $TSFixMe;
  email: $TSFixMe;
  firstName: $TSFixMe;
  group: $TSFixMe;
  id: $TSFixMe;
  isAuthenticatedFromGAR: $TSFixMe;
  lastName: $TSFixMe;
  lastParticipationDate: $TSFixMe;
  organizationId: $TSFixMe;
  participationCount: $TSFixMe;
  participationStatus: $TSFixMe;
  studentNumber: $TSFixMe;
  userId: $TSFixMe;
  username: $TSFixMe;
  constructor({
    id,
    lastName,
    firstName,
    birthdate,
    userId,
    organizationId,
    username,
    email,
    isAuthenticatedFromGAR,
    studentNumber,
    division,
    group,
    participationCount,
    lastParticipationDate,
    campaignName,
    campaignType,
    participationStatus
  }: $TSFixMe = {}) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthdate = birthdate;
    this.userId = userId;
    this.organizationId = organizationId;
    this.username = username;
    this.email = email;
    this.isAuthenticatedFromGAR = isAuthenticatedFromGAR;
    this.studentNumber = studentNumber;
    this.division = division;
    this.group = group;
    this.participationCount = participationCount;
    this.lastParticipationDate = lastParticipationDate;
    this.campaignName = campaignName;
    this.campaignType = campaignType;
    this.participationStatus = participationStatus;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserWithOrganizationLearner;
