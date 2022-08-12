// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  STARTED: 'started',
  RESET: 'reset',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceEvaluation {
  static statuses = statuses;

  assessment: $TSFixMe;
  assessmentId: $TSFixMe;
  competenceId: $TSFixMe;
  createdAt: $TSFixMe;
  id: $TSFixMe;
  scorecard: $TSFixMe;
  status: $TSFixMe;
  updatedAt: $TSFixMe;
  userId: $TSFixMe;

  constructor({
    id,
    createdAt,
    updatedAt,
    status,
    assessment,
    scorecard,
    assessmentId,
    competenceId,
    userId
  }: $TSFixMe = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
    //includes
    this.assessment = assessment;
    this.scorecard = scorecard;
    this.assessmentId = assessmentId;
    this.competenceId = competenceId;
    this.userId = userId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceEvaluation;
