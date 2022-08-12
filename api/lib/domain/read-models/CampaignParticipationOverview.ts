// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationOverview {
  campaignCode: $TSFixMe;
  campaignTitle: $TSFixMe;
  createdAt: $TSFixMe;
  disabledAt: $TSFixMe;
  id: $TSFixMe;
  isShared: $TSFixMe;
  masteryRate: $TSFixMe;
  organizationName: $TSFixMe;
  sharedAt: $TSFixMe;
  status: $TSFixMe;
  targetProfile: $TSFixMe;
  targetProfileId: $TSFixMe;
  constructor({
    id,
    createdAt,
    sharedAt,
    organizationName,
    status,
    campaignCode,
    campaignTitle,
    campaignArchivedAt,
    deletedAt,
    targetProfile,
    masteryRate
  }: $TSFixMe = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.isShared = status === SHARED;
    this.sharedAt = sharedAt;
    this.targetProfileId = targetProfile?.id;
    this.organizationName = organizationName;
    this.status = status;
    this.campaignCode = campaignCode;
    this.campaignTitle = campaignTitle;
    this.targetProfile = targetProfile;
    this.masteryRate = !_.isNil(masteryRate) ? Number(masteryRate) : null;

    const dates = [deletedAt, campaignArchivedAt].filter((a) => a != null);

    this.disabledAt = _.min(dates) || null;
  }

  get validatedStagesCount() {
    if (_.isEmpty(this.targetProfile?.stages) || !this.isShared) return null;

    const validatedStages = this._getReachableStages().filter((stage: $TSFixMe) => stage.threshold <= this.masteryRate * 100);
    return validatedStages.length;
  }

  get totalStagesCount() {
    return this._getReachableStages()?.length ?? 0;
  }

  _getReachableStages() {
    return this.targetProfile?.stages.filter((stage: $TSFixMe) => stage.threshold > 0);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationOverview;
