// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationForUserManagement {
  campaignCode: $TSFixMe;
  campaignId: $TSFixMe;
  createdAt: $TSFixMe;
  deletedAt: $TSFixMe;
  deletedBy: $TSFixMe;
  deletedByFullName: $TSFixMe;
  id: $TSFixMe;
  organizationLearnerFullName: $TSFixMe;
  participantExternalId: $TSFixMe;
  sharedAt: $TSFixMe;
  status: $TSFixMe;
  constructor({
    id,
    participantExternalId,
    status,
    campaignId,
    campaignCode,
    createdAt,
    sharedAt,
    deletedAt,
    deletedBy,
    deletedByFirstName,
    deletedByLastName,
    organizationLearnerFirstName,
    organizationLearnerLastName
  }: $TSFixMe = {}) {
    this.id = id;
    this.participantExternalId = participantExternalId;
    this.status = status;
    this.campaignId = campaignId;
    this.campaignCode = campaignCode;
    this.createdAt = createdAt;
    this.sharedAt = sharedAt;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    if (this.deletedAt) {
      this.deletedByFullName = deletedByFirstName + ' ' + deletedByLastName;
    }
    this.organizationLearnerFullName = organizationLearnerFirstName + ' ' + organizationLearnerLastName;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationForUserManagement;
