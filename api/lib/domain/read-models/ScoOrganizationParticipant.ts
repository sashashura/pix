// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ScoOrganiz... Remove this comment to see the full error message
class ScoOrganizationParticipant {
  birthdate: $TSFixMe;
  campaignName: $TSFixMe;
  campaignType: $TSFixMe;
  division: $TSFixMe;
  email: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  isAuthenticatedFromGAR: $TSFixMe;
  lastName: $TSFixMe;
  lastParticipationDate: $TSFixMe;
  participationCount: $TSFixMe;
  participationStatus: $TSFixMe;
  userId: $TSFixMe;
  username: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    userId,
    username,
    email,
    isAuthenticatedFromGAR,
    division,
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
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.isAuthenticatedFromGAR = isAuthenticatedFromGAR;
    this.division = division;
    this.participationCount = participationCount;
    this.lastParticipationDate = lastParticipationDate;
    this.campaignName = campaignName;
    this.campaignType = campaignType;
    this.participationStatus = participationStatus;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ScoOrganizationParticipant;
