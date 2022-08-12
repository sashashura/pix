// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SupOrganiz... Remove this comment to see the full error message
class SupOrganizationParticipant {
  birthdate: $TSFixMe;
  campaignName: $TSFixMe;
  campaignType: $TSFixMe;
  firstName: $TSFixMe;
  group: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  lastParticipationDate: $TSFixMe;
  participationCount: $TSFixMe;
  participationStatus: $TSFixMe;
  studentNumber: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    studentNumber,
    group,
    participationCount,
    lastParticipationDate,
    campaignName,
    campaignType,
    participationStatus
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.studentNumber = studentNumber;
    this.group = group;
    this.participationCount = participationCount;
    this.lastParticipationDate = lastParticipationDate;
    this.campaignName = campaignName;
    this.campaignType = campaignType;
    this.participationStatus = participationStatus;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SupOrganizationParticipant;
