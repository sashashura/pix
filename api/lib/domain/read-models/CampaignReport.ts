// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('../models/CampaignTypes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignRe... Remove this comment to see the full error message
class CampaignReport {
  archivedAt: $TSFixMe;
  averageResult: $TSFixMe;
  badges: $TSFixMe;
  code: $TSFixMe;
  createdAt: $TSFixMe;
  customLandingPageText: $TSFixMe;
  id: $TSFixMe;
  idPixLabel: $TSFixMe;
  multipleSendings: $TSFixMe;
  name: $TSFixMe;
  ownerFirstName: $TSFixMe;
  ownerId: $TSFixMe;
  ownerLastName: $TSFixMe;
  participationsCount: $TSFixMe;
  sharedParticipationsCount: $TSFixMe;
  stages: $TSFixMe;
  targetProfileDescription: $TSFixMe;
  targetProfileHasStage: $TSFixMe;
  targetProfileId: $TSFixMe;
  targetProfileName: $TSFixMe;
  targetProfileThematicResultCount: $TSFixMe;
  targetProfileTubesCount: $TSFixMe;
  title: $TSFixMe;
  type: $TSFixMe;
  constructor({
    id,
    name,
    code,
    title,
    idPixLabel,
    createdAt,
    customLandingPageText,
    archivedAt,
    type,
    ownerId,
    ownerLastName,
    ownerFirstName,
    targetProfileForSpecifier = {},
    participationsCount,
    sharedParticipationsCount,
    averageResult,
    badges = [],
    stages = [],
    multipleSendings
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.title = title;
    this.type = type;
    this.idPixLabel = idPixLabel;
    this.customLandingPageText = customLandingPageText;
    this.createdAt = createdAt;
    this.archivedAt = archivedAt;
    this.ownerId = ownerId;
    this.ownerLastName = ownerLastName;
    this.ownerFirstName = ownerFirstName;
    this.participationsCount = participationsCount;
    this.sharedParticipationsCount = sharedParticipationsCount;
    this.averageResult = averageResult;
    this.badges = badges;
    this.stages = stages;
    this.multipleSendings = multipleSendings;

    this.targetProfileId = targetProfileForSpecifier.id;
    this.targetProfileDescription = targetProfileForSpecifier.description;
    this.targetProfileName = targetProfileForSpecifier.name;
    this.targetProfileTubesCount = targetProfileForSpecifier.tubeCount;
    this.targetProfileThematicResultCount = targetProfileForSpecifier.thematicResultCount;
    this.targetProfileHasStage = targetProfileForSpecifier.hasStage;
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

  computeAverageResult(masteryRates: $TSFixMe) {
    const totalMasteryRates = masteryRates.length;
    if (totalMasteryRates > 0) {
      this.averageResult = _.sum(masteryRates) / totalMasteryRates;
    } else this.averageResult = null;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignReport;
