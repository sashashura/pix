// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('./Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceEvaluation = require('./CompetenceEvaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('./KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'scoringSer... Remove this comment to see the full error message
const scoringService = require('../services/scoring/scoring-service');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Scorecard'... Remove this comment to see the full error message
class Scorecard {
  static statuses = statuses;

  area: $TSFixMe;
  competenceId: $TSFixMe;
  description: $TSFixMe;
  earnedPix: $TSFixMe;
  exactlyEarnedPix: $TSFixMe;
  id: $TSFixMe;
  index: $TSFixMe;
  level: $TSFixMe;
  name: $TSFixMe;
  pixScoreAheadOfNextLevel: $TSFixMe;
  remainingDaysBeforeImproving: $TSFixMe;
  remainingDaysBeforeReset: $TSFixMe;
  status: $TSFixMe;
  tutorials: $TSFixMe;

  constructor({
    id,
    name,
    description,
    competenceId,
    index,
    level,
    area,
    pixScoreAheadOfNextLevel,
    earnedPix,
    exactlyEarnedPix,
    status,
    remainingDaysBeforeReset,
    remainingDaysBeforeImproving,
    tutorials
  }: $TSFixMe = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.competenceId = competenceId;
    this.index = index;
    this.area = area;
    this.earnedPix = earnedPix;
    this.exactlyEarnedPix = exactlyEarnedPix;
    this.level = level;
    this.pixScoreAheadOfNextLevel = pixScoreAheadOfNextLevel;
    this.status = status;
    this.remainingDaysBeforeReset = remainingDaysBeforeReset;
    this.remainingDaysBeforeImproving = remainingDaysBeforeImproving;
    this.tutorials = tutorials;
  }

  static parseId(scorecardId: $TSFixMe) {
    const [userId, competenceId] = scorecardId.split('_');
    return { userId: _.parseInt(userId), competenceId };
  }

  static buildFrom({
    userId,
    knowledgeElements,
    competence,
    competenceEvaluation,
    allowExcessPix = false,
    allowExcessLevel = false
  }: $TSFixMe) {
    const { realTotalPixScoreForCompetence, pixScoreForCompetence, currentLevel, pixAheadForNextLevel } =
      scoringService.calculateScoringInformationForCompetence({ knowledgeElements, allowExcessPix, allowExcessLevel });
    const remainingDaysBeforeReset = _.isEmpty(knowledgeElements)
      ? null
      : Scorecard.computeRemainingDaysBeforeReset(knowledgeElements);
    const remainingDaysBeforeImproving = _.isEmpty(knowledgeElements)
      ? null
      : Scorecard.computeRemainingDaysBeforeImproving(knowledgeElements);

    return new Scorecard({
      id: `${userId}_${competence.id}`,
      name: competence.name,
      description: competence.description,
      competenceId: competence.id,
      index: competence.index,
      area: competence.area,
      earnedPix: pixScoreForCompetence,
      exactlyEarnedPix: realTotalPixScoreForCompetence,
      level: currentLevel,
      pixScoreAheadOfNextLevel: pixAheadForNextLevel,
      status: _getScorecardStatus(competenceEvaluation, knowledgeElements),
      remainingDaysBeforeReset,
      remainingDaysBeforeImproving,
    });
  }

  static computeRemainingDaysBeforeReset(knowledgeElements: $TSFixMe) {
    const daysSinceLastKnowledgeElement = KnowledgeElement.computeDaysSinceLastKnowledgeElement(knowledgeElements);
    const remainingDaysToWait = Math.ceil(constants.MINIMUM_DELAY_IN_DAYS_FOR_RESET - daysSinceLastKnowledgeElement);

    return remainingDaysToWait > 0 ? remainingDaysToWait : 0;
  }

  static computeRemainingDaysBeforeImproving(knowledgeElements: $TSFixMe) {
    const daysSinceLastKnowledgeElement = KnowledgeElement.computeDaysSinceLastKnowledgeElement(knowledgeElements);
    const remainingDaysToWait = Math.ceil(
      constants.MINIMUM_DELAY_IN_DAYS_BEFORE_IMPROVING - daysSinceLastKnowledgeElement
    );

    return remainingDaysToWait > 0 ? remainingDaysToWait : 0;
  }
}

function _getScorecardStatus(competenceEvaluation: $TSFixMe, knowledgeElements: $TSFixMe) {
  if (!competenceEvaluation || competenceEvaluation.status === CompetenceEvaluation.statuses.RESET) {
    return _.isEmpty(knowledgeElements) ? (statuses as $TSFixMe).NOT_STARTED : (statuses as $TSFixMe).STARTED;
  }
  const stateOfAssessment = _.get(competenceEvaluation, 'assessment.state');
  if (stateOfAssessment === Assessment.states.COMPLETED) {
    return (statuses as $TSFixMe).COMPLETED;
  }
  return (statuses as $TSFixMe).STARTED;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Scorecard;
