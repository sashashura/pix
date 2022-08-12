// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'map'.
const map = require('lodash/map');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isEmpty'.
const isEmpty = require('lodash/isEmpty');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
const Scorecard = require('../models/Scorecard');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SharedProf... Remove this comment to see the full error message
class SharedProfileForCampaign {
  canRetry: $TSFixMe;
  id: $TSFixMe;
  pixScore: $TSFixMe;
  scorecards: $TSFixMe;
  sharedAt: $TSFixMe;
  constructor({
    campaignParticipation,
    campaignAllowsRetry,
    isOrganizationLearnerActive,
    competencesWithArea,
    knowledgeElementsGroupedByCompetenceId,
    userId
  }: $TSFixMe) {
    this.id = campaignParticipation?.id;
    this.sharedAt = campaignParticipation?.sharedAt;
    this.pixScore = campaignParticipation?.pixScore || 0;
    this.scorecards = this._buildScorecards(userId, competencesWithArea, knowledgeElementsGroupedByCompetenceId);
    this.canRetry = this._computeCanRetry(
      campaignAllowsRetry,
      this.sharedAt,
      isOrganizationLearnerActive,
      campaignParticipation?.deletedAt
    );
  }

  _buildScorecards(userId: $TSFixMe, competencesWithArea: $TSFixMe, knowledgeElementsGroupedByCompetenceId: $TSFixMe) {
    if (isEmpty(knowledgeElementsGroupedByCompetenceId)) return [];
    return map(competencesWithArea, (competence: $TSFixMe) => {
      const competenceId = competence.id;
      const knowledgeElements = knowledgeElementsGroupedByCompetenceId[competenceId];

      return Scorecard.buildFrom({
        userId,
        knowledgeElements,
        competence,
      });
    });
  }

  _computeCanRetry(campaignAllowsRetry: $TSFixMe, sharedAt: $TSFixMe, isOrganizationLearnerActive: $TSFixMe, deletedAt: $TSFixMe) {
    return campaignAllowsRetry && Boolean(sharedAt) && isOrganizationLearnerActive && !deletedAt;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SharedProfileForCampaign;
