const _ = require('lodash');
const { NotFoundError, AssessmentNotCompletedError, AlreadySharedCampaignParticipationError } = require('../errors');
const Assessment = require('./Assessment');

class CampaignParticipation {

  constructor({
    id,
    // attributes
    createdAt,
    isShared,
    participantExternalId,
    sharedAt,
    // includes
    assessments,
    campaign,
    user,
    // references
    assessmentId,
    campaignId,
    userId,
  } = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.isShared = isShared;
    this.participantExternalId = participantExternalId;
    this.sharedAt = sharedAt;
    this.campaign = campaign;
    this.user = user;
    this.assessments = assessments;
    this.assessmentId = assessmentId;
    this.campaignId = campaignId;
    this.userId = userId;
  }

  getTargetProfileId() {
    return _.get(this, 'campaign.targetProfileId', null);
  }

  get lastAssessment() {
    return _.maxBy(this.assessments, 'createdAt');
  }

  createImprovementAssessment() {

    if (this.assessments.length === 0) {
      throw new NotFoundError('Le participant n\'a pas été évalué sur cette campagne');
    }

    if (this.lastAssessment.state === Assessment.states.STARTED) {
      throw new AssessmentNotCompletedError('Le participant a une évaluation en cours pour cette campagne');
    }

    if (this.isShared) {
      throw new AlreadySharedCampaignParticipationError('Le participant a déjà partagé ses résultats');
    }

    return new Assessment({
      userId: this.userId,
      campaignParticipationId: this.id,
      state: Assessment.states.STARTED,
      type: Assessment.types.CAMPAIGN,
      courseId: Assessment.courseIdMessage.CAMPAIGN,
      isImproving: true,
    });
  }

}

module.exports = CampaignParticipation;
