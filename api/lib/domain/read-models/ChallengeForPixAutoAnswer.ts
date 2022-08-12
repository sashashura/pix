// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeT... Remove this comment to see the full error message
const ChallengeType = Object.freeze({
  QCU: 'QCU',
  QCM: 'QCM',
  QROC: 'QROC',
  QROCM_IND: 'QROCM-ind',
  QROCM_DEP: 'QROCM-dep',
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeF... Remove this comment to see the full error message
class ChallengeForPixAutoAnswer {
  static Type = ChallengeType;

  autoReply: $TSFixMe;
  id: $TSFixMe;
  solution: $TSFixMe;
  type: $TSFixMe;

  /**
   * Constructeur d'épreuve pour le bouton magique (pix-auto-answer)
   *
   * @param id
   * @param solution
   * @param type
   * @param autoReply
   */
  constructor({
    id,
    solution,
    type,
    autoReply
  }: $TSFixMe = {}) {
    this.id = id;
    this.solution = solution;
    this.type = type;
    this.autoReply = autoReply;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ChallengeForPixAutoAnswer;
