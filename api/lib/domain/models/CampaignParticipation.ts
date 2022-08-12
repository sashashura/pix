// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ArchivedCa... Remove this comment to see the full error message
  ArchivedCampaignError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
  AssessmentNotCompletedError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadySha... Remove this comment to see the full error message
  AlreadySharedCampaignParticipationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CantImprov... Remove this comment to see the full error message
  CantImproveCampaignParticipationError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
  CampaignParticipationDeletedError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('./CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipation {
  assessments: $TSFixMe;
  campaign: $TSFixMe;
  createdAt: $TSFixMe;
  deletedAt: $TSFixMe;
  deletedBy: $TSFixMe;
  id: $TSFixMe;
  organizationLearnerId: $TSFixMe;
  participantExternalId: $TSFixMe;
  pixScore: $TSFixMe;
  sharedAt: $TSFixMe;
  status: $TSFixMe;
  userId: $TSFixMe;
  validatedSkillsCount: $TSFixMe;
  constructor({
    id,
    createdAt,
    participantExternalId,
    status,
    sharedAt,
    deletedAt,
    deletedBy,
    assessments,
    campaign,
    userId,
    validatedSkillsCount,
    pixScore,
    organizationLearnerId
  }: $TSFixMe = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.status = status;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
    this.campaign = campaign;
    this.assessments = assessments;
    this.userId = userId;
    this.status = status;
    this.validatedSkillsCount = validatedSkillsCount;
    this.pixScore = pixScore;
    this.organizationLearnerId = organizationLearnerId;
  }

  static start(campaignParticipation: $TSFixMe) {
    const { organizationLearnerId = null } = campaignParticipation;
    const { isAssessment } = campaignParticipation.campaign;
    const { STARTED, TO_SHARE } = CampaignParticipationStatuses;

    const status = isAssessment ? STARTED : TO_SHARE;

    return new CampaignParticipation({
      ...campaignParticipation,
      status,
      organizationLearnerId,
    });
  }

  get isShared() {
    return this.status === CampaignParticipationStatuses.SHARED;
  }

  get isDeleted() {
    return Boolean(this.deletedAt);
  }

  get lastAssessment() {
    return _.maxBy(this.assessments, 'createdAt');
  }

  getTargetProfileId() {
    return _.get(this, 'campaign.targetProfileId', null);
  }

  get campaignId() {
    return _.get(this, 'campaign.id', null);
  }

  share() {
    this._canBeShared();
    this.sharedAt = new Date();
    this.status = CampaignParticipationStatuses.SHARED;
  }

  improve() {
    this._canBeImproved();
    this.status = CampaignParticipationStatuses.STARTED;
  }

  delete(userId: $TSFixMe) {
    this.deletedAt = new Date();
    this.deletedBy = userId;
  }

  _canBeImproved() {
    if (this.campaign.isProfilesCollection()) {
      throw new CantImproveCampaignParticipationError();
    }
  }

  _canBeShared() {
    if (this.isShared) {
      throw new AlreadySharedCampaignParticipationError();
    }
    if (this.campaign.isArchived()) {
      throw new ArchivedCampaignError('Cannot share results on an archived campaign.');
    }
    if (this.isDeleted) {
      throw new CampaignParticipationDeletedError('Cannot share results on a deleted participation.');
    }
    if (this.campaign.isAssessment() && lastAssessmentNotCompleted(this)) {
      throw new AssessmentNotCompletedError();
    }
  }
}

function lastAssessmentNotCompleted(campaignParticipation: $TSFixMe) {
  return !campaignParticipation.lastAssessment || !campaignParticipation.lastAssessment.isCompleted();
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipation;
