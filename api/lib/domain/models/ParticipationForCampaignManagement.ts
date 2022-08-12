// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
class ParticipationForCampaignManagement {
  createdAt: $TSFixMe;
  deletedAt: $TSFixMe;
  deletedBy: $TSFixMe;
  deletedByFullName: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  participantExternalId: $TSFixMe;
  sharedAt: $TSFixMe;
  status: $TSFixMe;
  userFullName: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    id,
    lastName,
    firstName,
    userId,
    userFirstName,
    userLastName,
    participantExternalId,
    status,
    createdAt,
    sharedAt,
    deletedAt,
    deletedBy,
    deletedByFirstName,
    deletedByLastName
  }: $TSFixMe = {}) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.userId = userId;
    this.userFullName = userFirstName + ' ' + userLastName;
    this.participantExternalId = participantExternalId;
    this.status = status;
    this.createdAt = createdAt;
    this.sharedAt = sharedAt;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    if (this.deletedAt) {
      this.deletedByFullName = deletedByFirstName + ' ' + deletedByLastName;
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ParticipationForCampaignManagement;
