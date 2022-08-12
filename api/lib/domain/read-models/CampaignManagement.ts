// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignMa... Remove this comment to see the full error message
class CampaignManagement {
  archivedAt: $TSFixMe;
  code: $TSFixMe;
  createdAt: $TSFixMe;
  creatorFirstName: $TSFixMe;
  creatorId: $TSFixMe;
  creatorLastName: $TSFixMe;
  customLandingPageText: $TSFixMe;
  customResultPageButtonText: $TSFixMe;
  customResultPageButtonUrl: $TSFixMe;
  customResultPageText: $TSFixMe;
  id: $TSFixMe;
  idPixLabel: $TSFixMe;
  multipleSendings: $TSFixMe;
  name: $TSFixMe;
  organizationId: $TSFixMe;
  organizationName: $TSFixMe;
  ownerFirstName: $TSFixMe;
  ownerId: $TSFixMe;
  ownerLastName: $TSFixMe;
  sharedParticipationsCount: $TSFixMe;
  targetProfileId: $TSFixMe;
  targetProfileName: $TSFixMe;
  title: $TSFixMe;
  totalParticipationsCount: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    code,
    name,
    idPixLabel,
    createdAt,
    archivedAt,
    type,
    creatorLastName,
    creatorFirstName,
    creatorId,
    organizationId,
    organizationName,
    targetProfileId,
    targetProfileName,
    title,
    customLandingPageText,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    ownerLastName,
    ownerFirstName,
    ownerId,
    shared,
    started,
    completed,
    multipleSendings
  }: $TSFixMe = {}) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.createdAt = createdAt;
    this.archivedAt = archivedAt;
    this.creatorLastName = creatorLastName;
    this.creatorFirstName = creatorFirstName;
    this.creatorId = creatorId;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.targetProfileId = targetProfileId;
    this.targetProfileName = targetProfileName;
    this.title = title;
    this.customLandingPageText = customLandingPageText;
    this.customResultPageText = customResultPageText;
    this.customResultPageButtonText = customResultPageButtonText;
    this.customResultPageButtonUrl = customResultPageButtonUrl;
    this.ownerLastName = ownerLastName;
    this.ownerFirstName = ownerFirstName;
    this.ownerId = ownerId;
    this.sharedParticipationsCount = shared;
    this.totalParticipationsCount = this.sharedParticipationsCount + (started || 0) + completed;
    this.multipleSendings = multipleSendings;
  }

  get isTypeProfilesCollection() {
    return this.type === 'PROFILES_COLLECTION';
  }

  get isTypeAssessment() {
    return this.type === 'ASSESSMENT';
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignManagement;
