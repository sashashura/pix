// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationParticipant {
  campaignName: $TSFixMe;
  campaignType: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  lastParticipationDate: $TSFixMe;
  participationCount: $TSFixMe;
  participationStatus: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    participationCount,
    lastParticipationDate,
    campaignName,
    campaignType,
    participationStatus
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participationCount = participationCount;
    this.lastParticipationDate = lastParticipationDate;
    this.campaignName = campaignName;
    this.campaignType = campaignType;
    this.participationStatus = participationStatus;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationParticipant;
