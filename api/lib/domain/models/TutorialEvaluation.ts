// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  LIKED: 'LIKED',
  NEUTRAL: 'NEUTRAL',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
class TutorialEvaluation {
  static statuses = statuses;

  id: $TSFixMe;
  status: $TSFixMe;
  tutorialId: $TSFixMe;
  updatedAt: $TSFixMe;
  userId: $TSFixMe;

  constructor({
    id,
    userId,
    tutorialId,
    status,
    updatedAt
  }: $TSFixMe = {}) {
    this.id = id;
    this.userId = userId;
    this.tutorialId = tutorialId;
    this.status = status;
    this.updatedAt = updatedAt;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TutorialEvaluation;
