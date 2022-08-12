// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeT... Remove this comment to see the full error message
const { ChallengeToBeNeutralizedNotFoundError, ChallengeToBeDeneutralizedNotFoundError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('./AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Neutraliza... Remove this comment to see the full error message
const NeutralizationAttempt = require('./NeutralizationAttempt');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAnswerStatusChangeAttempt = require('./CertificationAnswerStatusChangeAttempt');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'states'.
const states = {
  COMPLETED: 'completed',
  STARTED: 'started',
  ENDED_BY_SUPERVISOR: 'endedBySupervisor',
  ENDED_DUE_TO_FINALIZATION: 'endedDueToFinalization',
};

const certificationAssessmentSchema = Joi.object({
  id: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  certificationCourseId: Joi.number().integer().required(),
  createdAt: Joi.date().required(),
  completedAt: Joi.date().allow(null),
  state: Joi.string()
    .valid(states.COMPLETED, states.STARTED, states.ENDED_BY_SUPERVISOR, states.ENDED_DUE_TO_FINALIZATION)
    .required(),
  isV2Certification: Joi.boolean().required(),
  certificationChallenges: Joi.array().min(1).required(),
  certificationAnswersByDate: Joi.array().min(0).required(),
});

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationAssessment {
  static states = states;

  certificationAnswersByDate: $TSFixMe;
  certificationChallenges: $TSFixMe;
  certificationCourseId: $TSFixMe;
  completedAt: $TSFixMe;
  createdAt: $TSFixMe;
  id: $TSFixMe;
  isV2Certification: $TSFixMe;
  state: $TSFixMe;
  userId: $TSFixMe;

  constructor({
    id,
    userId,
    certificationCourseId,
    createdAt,
    completedAt,
    state,
    isV2Certification,
    certificationChallenges,
    certificationAnswersByDate
  }: $TSFixMe = {}) {
    this.id = id;
    this.userId = userId;
    this.certificationCourseId = certificationCourseId;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.state = state;
    this.isV2Certification = isV2Certification;
    this.certificationChallenges = certificationChallenges;
    this.certificationAnswersByDate = certificationAnswersByDate;

    validateEntity(certificationAssessmentSchema, this);
  }

  getCertificationChallenge(challengeId: $TSFixMe) {
    return _.find(this.certificationChallenges, { challengeId }) || null;
  }

  getAnswerByQuestionNumber(questionNumber: $TSFixMe) {
    return this.certificationAnswersByDate[questionNumber - 1];
  }

  neutralizeChallengeByRecId(recId: $TSFixMe) {
    const challengeToBeNeutralized = _.find(this.certificationChallenges, { challengeId: recId });
    if (challengeToBeNeutralized) {
      challengeToBeNeutralized.neutralize();
    } else {
      throw new ChallengeToBeNeutralizedNotFoundError();
    }
  }

  endDueToFinalization() {
    this.state = states.ENDED_DUE_TO_FINALIZATION;
  }

  neutralizeChallengeByNumberIfKoOrSkippedOrPartially(questionNumber: $TSFixMe) {
    const toBeNeutralizedChallengeAnswer = this.getAnswerByQuestionNumber(questionNumber);
    if (!toBeNeutralizedChallengeAnswer) {
      return NeutralizationAttempt.failure(questionNumber);
    }

    if (_isAnswerKoOrSkippedOrPartially(toBeNeutralizedChallengeAnswer.result.status)) {
      const challengeToBeNeutralized = _.find(this.certificationChallenges, {
        challengeId: toBeNeutralizedChallengeAnswer.challengeId,
      });
      challengeToBeNeutralized.neutralize();
      return NeutralizationAttempt.neutralized(questionNumber);
    }

    return NeutralizationAttempt.skipped(questionNumber);
  }

  deneutralizeChallengeByRecId(recId: $TSFixMe) {
    const challengeToBeDeneutralized = _.find(this.certificationChallenges, { challengeId: recId });
    if (challengeToBeDeneutralized) {
      challengeToBeDeneutralized.deneutralize();
    } else {
      throw new ChallengeToBeDeneutralizedNotFoundError();
    }
  }

  validateAnswerByNumberIfFocusedOut(questionNumber: $TSFixMe) {
    const challengeAnswer = this.getAnswerByQuestionNumber(questionNumber);
    if (!challengeAnswer) {
      return CertificationAnswerStatusChangeAttempt.failed(questionNumber);
    }

    if (challengeAnswer.result.isFOCUSEDOUT()) {
      challengeAnswer.result = AnswerStatus.OK;
      return CertificationAnswerStatusChangeAttempt.changed(questionNumber);
    }

    return CertificationAnswerStatusChangeAttempt.skipped(questionNumber);
  }

  listCertifiableBadgePixPlusKeysTaken() {
    return _(this.certificationChallenges)
      .filter((certificationChallenge: $TSFixMe) => certificationChallenge.isPixPlus())
      .uniqBy('certifiableBadgeKey')
      .map('certifiableBadgeKey')
      .value();
  }

  findAnswersAndChallengesForCertifiableBadgeKey(certifiableBadgeKey: $TSFixMe) {
    const certificationChallengesForBadge = _.filter(this.certificationChallenges, { certifiableBadgeKey });
    const challengeIds = _.map(certificationChallengesForBadge, 'challengeId');
    const answersForBadge = _.filter(this.certificationAnswersByDate, ({
      challengeId
    }: $TSFixMe) =>
      _.includes(challengeIds, challengeId)
    );
    return {
      certificationChallenges: certificationChallengesForBadge,
      certificationAnswers: answersForBadge,
    };
  }

  isCompleted() {
    return this.state === states.COMPLETED;
  }

  getChallengeRecIdByQuestionNumber(questionNumber: $TSFixMe) {
    return this.getAnswerByQuestionNumber(questionNumber)?.challengeId;
  }

  skipUnansweredChallenges() {
    this.certificationChallenges.forEach((certificationChallenge: $TSFixMe) => {
      if (
        !this.certificationAnswersByDate.some(
          (certificationAnswer: $TSFixMe) => certificationChallenge.challengeId === certificationAnswer.challengeId
        )
      ) {
        certificationChallenge.skipAutomatically();
      }
    });
  }

  neutralizeUnansweredChallenges() {
    this.certificationChallenges.map((certificationChallenge: $TSFixMe) => {
      if (
        !this.certificationAnswersByDate.some(
          (certificationAnswer: $TSFixMe) => certificationChallenge.challengeId === certificationAnswer.challengeId
        )
      ) {
        certificationChallenge.neutralize();
      }
    });
  }
}

function _isAnswerKoOrSkippedOrPartially(answerStatus: $TSFixMe) {
  const isKo = AnswerStatus.isKO(answerStatus);
  const isSkipped = AnswerStatus.isSKIPPED(answerStatus);
  const isPartially = AnswerStatus.isPARTIALLY(answerStatus);
  return isKo || isSkipped || isPartially;
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationAssessment;
