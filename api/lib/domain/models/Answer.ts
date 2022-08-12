// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('./AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Answer'.
class Answer {
  static FAKE_VALUE_FOR_SKIPPED_QUESTIONS = '#ABAND#';

  assessmentId: $TSFixMe;
  challenge: $TSFixMe;
  challengeId: $TSFixMe;
  id: $TSFixMe;
  isFocusedOut: $TSFixMe;
  levelup: $TSFixMe;
  result: $TSFixMe;
  resultDetails: $TSFixMe;
  timeSpent: $TSFixMe;
  timeout: $TSFixMe;
  value: $TSFixMe;

  constructor({
    id,
    result,
    resultDetails,
    timeout,
    isFocusedOut,
    value,
    levelup,
    assessmentId,
    challengeId,
    timeSpent
  }: $TSFixMe = {}) {
    this.id = id;
    // XXX result property should not be auto-created from result to an AnswerStatus Object
    this.result = AnswerStatus.from(result);
    this.resultDetails = resultDetails;
    this.timeout = timeout;
    this.isFocusedOut = isFocusedOut || this.result.isFOCUSEDOUT();
    this.value = value;
    this.levelup = levelup;
    this.assessmentId = assessmentId;
    this.challengeId = challengeId;
    this.timeSpent = timeSpent;
  }

  isOk() {
    return this.result.isOK();
  }

  isPartially() {
    return this.result.isPARTIALLY();
  }

  get binaryOutcome() {
    return AnswerStatus.isOK(this.result) ? 1 : 0;
  }

  /**
   * @deprecated Method that does not belong here. Answer has no knowledge of challenge
   * Should maybe belong to challenge ?
   * (Demeter law broken this.challenge.skills.(first-object).difficulty
   */
  maxDifficulty(baseDifficulty = 2) {
    if (this.challenge) {
      const difficulties = this.challenge.skills.map((skill: $TSFixMe) => skill.difficulty);
      if (difficulties.length > 0) {
        return Math.max(...difficulties);
      }
    }
    // XXX : to avoid problem when challenge has no skill/ when we cannot get challenge
    return baseDifficulty;
  }

  get hasTimedOut() {
    return _.isInteger(this.timeout) && this.timeout < 0;
  }

  setTimeSpentFrom({
    now,
    lastQuestionDate
  }: $TSFixMe) {
    this.timeSpent = Math.ceil((now.getTime() - lastQuestionDate.getTime()) / 1000);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Answer;
