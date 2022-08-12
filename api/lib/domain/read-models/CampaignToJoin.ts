// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../models/CampaignTypes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
class CampaignToJoin {
  alternativeTextToExternalIdHelpImage: $TSFixMe;
  archivedAt: $TSFixMe;
  assessmentMethod: $TSFixMe;
  code: $TSFixMe;
  customLandingPageText: $TSFixMe;
  customResultPageButtonText: $TSFixMe;
  customResultPageButtonUrl: $TSFixMe;
  customResultPageText: $TSFixMe;
  externalIdHelpImageUrl: $TSFixMe;
  id: $TSFixMe;
  idPixLabel: $TSFixMe;
  identityProvider: $TSFixMe;
  isForAbsoluteNovice: $TSFixMe;
  isRestricted: $TSFixMe;
  isSimplifiedAccess: $TSFixMe;
  multipleSendings: $TSFixMe;
  organizationFormNPSUrl: $TSFixMe;
  organizationId: $TSFixMe;
  organizationLogoUrl: $TSFixMe;
  organizationName: $TSFixMe;
  organizationShowNPS: $TSFixMe;
  organizationType: $TSFixMe;
  targetProfileImageUrl: $TSFixMe;
  targetProfileName: $TSFixMe;
  title: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    code,
    title,
    idPixLabel,
    customLandingPageText,
    externalIdHelpImageUrl,
    alternativeTextToExternalIdHelpImage,
    archivedAt,
    type,
    isForAbsoluteNovice,
    organizationId,
    organizationName,
    organizationType,
    organizationLogoUrl,
    organizationIsManagingStudents,
    identityProvider,
    organizationShowNPS,
    organizationFormNPSUrl,
    targetProfileName,
    targetProfileImageUrl,
    targetProfileIsSimplifiedAccess,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    multipleSendings,
    assessmentMethod
  }: $TSFixMe = {}) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.customLandingPageText = customLandingPageText;
    this.externalIdHelpImageUrl = externalIdHelpImageUrl;
    this.alternativeTextToExternalIdHelpImage = alternativeTextToExternalIdHelpImage;
    this.archivedAt = archivedAt;
    this.isRestricted = organizationIsManagingStudents;
    this.isSimplifiedAccess = targetProfileIsSimplifiedAccess;
    this.isForAbsoluteNovice = isForAbsoluteNovice;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.organizationType = organizationType;
    this.organizationLogoUrl = organizationLogoUrl;
    this.identityProvider = identityProvider;
    this.organizationShowNPS = organizationShowNPS;
    this.organizationFormNPSUrl = organizationFormNPSUrl;
    this.targetProfileName = targetProfileName;
    this.targetProfileImageUrl = targetProfileImageUrl;
    this.customResultPageText = customResultPageText;
    this.customResultPageButtonText = customResultPageButtonText;
    this.customResultPageButtonUrl = customResultPageButtonUrl;
    this.multipleSendings = multipleSendings;
    this.assessmentMethod = assessmentMethod;
  }

  get isAssessment() {
    return this.type === CampaignTypes.ASSESSMENT;
  }

  get isProfilesCollection() {
    return this.type === CampaignTypes.PROFILES_COLLECTION;
  }

  get isArchived() {
    return Boolean(this.archivedAt);
  }

  get isFlash() {
    return this.assessmentMethod === Assessment.methods.FLASH;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignToJoin;
