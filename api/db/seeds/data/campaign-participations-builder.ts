// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../../lib/domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_SUPER_... Remove this comment to see the full error message
const { PIX_SUPER_ADMIN_ID } = require('./users-builder');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED, STARTED } = CampaignParticipationStatuses;

function _mapAssessmentStateFromParticipationStatus(status: $TSFixMe) {
  if (status === STARTED) {
    return Assessment.states.STARTED;
  }
  return Assessment.states.COMPLETED;
}

function _buildAssessmentAndAnswer({
  databaseBuilder,
  userId,
  campaignParticipationId,
  status,
  hasSomeFailures
}: $TSFixMe) {
  const { id: assessmentId } = databaseBuilder.factory.buildAssessment({
    userId,
    type: Assessment.types.CAMPAIGN,
    state: _mapAssessmentStateFromParticipationStatus(status),
    campaignParticipationId,
  });

  const { id: answerId } = databaseBuilder.factory.buildAnswer({
    result: 'ok',
    assessmentId,
    challengeId: 'recqxUPlzYVbbTtFP',
  });

  databaseBuilder.factory.buildKnowledgeElement({
    skillId: 'recGd7oJ2wVEyKmPS', //connexionSmart3
    assessmentId,
    userId,
    competenceId: 'recIhdrmCuEmCDAzj',
    answerId,
  });
  databaseBuilder.factory.buildKnowledgeElement({
    skillId: 'recVv1eoSLW7yFgXv', //connexionSmart1
    assessmentId,
    userId,
    competenceId: 'recIhdrmCuEmCDAzj',
    answerId,
    source: KnowledgeElement.SourceType.INFERRED,
  });
  databaseBuilder.factory.buildKnowledgeElement({
    skillId: 'recVywppdS4hGEekR', //connexionSmart2
    assessmentId,
    userId,
    competenceId: 'recIhdrmCuEmCDAzj',
    answerId,
    source: KnowledgeElement.SourceType.INFERRED,
  });

  const { id: otherAnswerId } = databaseBuilder.factory.buildAnswer({
    result: hasSomeFailures ? 'ko' : 'ok',
    assessmentId,
    challengeId: 'recawBkXqLRXK4zzT',
  });

  databaseBuilder.factory.buildKnowledgeElement({
    skillId: 'recmB2623CruGvA1b', //problemeImprimante4
    assessmentId,
    userId,
    competenceId: 'recIhdrmCuEmCDAzj',
    answerId: otherAnswerId,
    status: hasSomeFailures ? KnowledgeElement.StatusType.INVALIDATED : KnowledgeElement.StatusType.VALIDATED,
    earnedPix: hasSomeFailures ? 0 : 2,
  });

  databaseBuilder.factory.buildKnowledgeElement({
    skillId: 'recOyQOjUhDKTO7UN', //problemeImprimante3
    assessmentId,
    userId,
    competenceId: 'recIhdrmCuEmCDAzj',
    answerId: otherAnswerId,
    status: hasSomeFailures ? KnowledgeElement.StatusType.INVALIDATED : KnowledgeElement.StatusType.VALIDATED,
    earnedPix: hasSomeFailures ? 0 : 2,
  });

  databaseBuilder.factory.buildKnowledgeElement({
    skillId: 'recKFUQ2CzcYHrxPR', //problemeImprimante2
    assessmentId,
    userId,
    competenceId: 'recIhdrmCuEmCDAzj',
    answerId: otherAnswerId,
    status: hasSomeFailures ? KnowledgeElement.StatusType.INVALIDATED : KnowledgeElement.StatusType.VALIDATED,
    earnedPix: hasSomeFailures ? 0 : 2,
    source: KnowledgeElement.SourceType.INFERRED,
  });
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'participat... Remove this comment to see the full error message
function participateToAssessmentCampaign({
  databaseBuilder,
  campaignId,
  user,
  organizationLearnerId,
  status,
  isImprovingOldParticipation = false,
  deleted = false
}: $TSFixMe) {
  const today = new Date();
  const sharedAt = status === SHARED ? today : null;
  const deletedAt = deleted ? today : null;
  const deletedBy = deleted ? PIX_SUPER_ADMIN_ID : null;

  const { id: userId } = user;
  const { id: campaignParticipationId } = databaseBuilder.factory.buildCampaignParticipation({
    campaignId,
    userId,
    organizationLearnerId,
    participantExternalId: userId,
    createdAt: user.createdAt,
    status,
    sharedAt,
    deletedAt,
    deletedBy,
  });

  _buildAssessmentAndAnswer({ databaseBuilder, userId, campaignParticipationId, status, hasSomeFailures: _.sample([true, false]) });

  if (isImprovingOldParticipation) {
    const { id: oldCampaignParticipationId } = databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      userId,
      organizationLearnerId,
      participantExternalId: userId,
      status: SHARED,
      createdAt: user.createdAt,
      sharedAt: user.createdAt,
      isImproved: true,
    });
    _buildAssessmentAndAnswer({ databaseBuilder, userId, campaignParticipationId: oldCampaignParticipationId, status: SHARED, hasSomeFailures: true });
  }
  return campaignParticipationId;
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'participat... Remove this comment to see the full error message
function participateToProfilesCollectionCampaign({
  databaseBuilder,
  campaignId,
  user,
  organizationLearnerId,
  status,
  isImprovingOldParticipation = false,
  deleted = false
}: $TSFixMe) {
  const today = new Date();
  const sharedAt = status === SHARED ? today : null;
  const deletedAt = deleted ? today : null;
  const deletedBy = deleted ? PIX_SUPER_ADMIN_ID : null;

  const { id: userId } = user;
  databaseBuilder.factory.buildCampaignParticipation({
    campaignId,
    userId,
    organizationLearnerId,
    participantExternalId: userId,
    status,
    createdAt: user.createdAt,
    sharedAt,
    deletedAt,
    deletedBy,
  });

  if (isImprovingOldParticipation) {
    databaseBuilder.factory.buildCampaignParticipation({
      campaignId,
      userId,
      organizationLearnerId,
      participantExternalId: userId,
      status: SHARED,
      createdAt: user.createdAt,
      sharedAt: user.createdAt,
      isImproved: true,
    });
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  participateToAssessmentCampaign,
  participateToProfilesCollectionCampaign,
};
