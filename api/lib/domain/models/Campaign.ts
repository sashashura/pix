// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('./CampaignTypes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Campaign'.
class Campaign {
  alternativeTextToExternalIdHelpImage: $TSFixMe;
  archivedAt: $TSFixMe;
  assessmentMethod: $TSFixMe;
  code: $TSFixMe;
  createdAt: $TSFixMe;
  creator: $TSFixMe;
  customLandingPageText: $TSFixMe;
  customResultPageButtonText: $TSFixMe;
  customResultPageButtonUrl: $TSFixMe;
  customResultPageText: $TSFixMe;
  externalIdHelpImageUrl: $TSFixMe;
  id: $TSFixMe;
  idPixLabel: $TSFixMe;
  isForAbsoluteNovice: $TSFixMe;
  multipleSendings: $TSFixMe;
  name: $TSFixMe;
  organization: $TSFixMe;
  ownerId: $TSFixMe;
  targetProfile: $TSFixMe;
  title: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    name,
    code,
    title,
    idPixLabel,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    createdAt,
    customLandingPageText,
    archivedAt,
    type,
    isForAbsoluteNovice,
    targetProfile,
    creator,
    ownerId,
    organization,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    multipleSendings,
    assessmentMethod
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.title = title;
    this.idPixLabel = idPixLabel;
    this.externalIdHelpImageUrl = externalIdHelpImageUrl;
    this.alternativeTextToExternalIdHelpImage = alternativeTextToExternalIdHelpImage;
    this.createdAt = createdAt;
    this.customLandingPageText = customLandingPageText;
    this.archivedAt = archivedAt;
    this.type = type;
    this.isForAbsoluteNovice = isForAbsoluteNovice;
    this.targetProfile = targetProfile;
    this.creator = creator;
    this.ownerId = ownerId;
    this.organization = organization;
    this.customResultPageText = customResultPageText;
    this.customResultPageButtonText = customResultPageButtonText;
    this.customResultPageButtonUrl = customResultPageButtonUrl;
    this.multipleSendings = multipleSendings;
    this.assessmentMethod = assessmentMethod;
  }

  get organizationId() {
    return _.get(this, 'organization.id', null);
  }

  get targetProfileId() {
    return _.get(this, 'targetProfile.id', null);
  }

  isAssessment() {
    return this.type === CampaignTypes.ASSESSMENT;
  }

  isProfilesCollection() {
    return this.type === CampaignTypes.PROFILES_COLLECTION;
  }

  isArchived() {
    return Boolean(this.archivedAt);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Campaign;
