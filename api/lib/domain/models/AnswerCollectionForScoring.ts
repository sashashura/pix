// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
const qrocmDepChallenge = 'QROCM-dep';

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class AnswerCollectionForScoring {
  challengesWithAnswers: $TSFixMe;
  constructor(challengesWithAnswers: $TSFixMe) {
    this.challengesWithAnswers = challengesWithAnswers;
  }

  static from({
    answers,
    challenges
  }: $TSFixMe) {
    const challengesWithAnswers = challenges.map((challenge: $TSFixMe) => {
      const answer = answers.find((answer: $TSFixMe) => answer.challengeId === challenge.challengeId);

      return new ChallengeWithAnswer(answer, challenge);
    });

    return new AnswerCollectionForScoring(challengesWithAnswers);
  }

  numberOfChallenges() {
    return this.challengesWithAnswers.length;
  }

  numberOfCorrectAnswers() {
    let nbOfCorrectAnswers = 0;
    this.challengesWithAnswers.forEach((challengeWithAnswer: $TSFixMe) => {
      if (!challengeWithAnswer.isNeutralized() && challengeWithAnswer.isCorrect()) {
        nbOfCorrectAnswers++;
      }
    });

    return nbOfCorrectAnswers;
  }

  numberOfNonNeutralizedChallenges() {
    let numberOfNonNeutralizedChallenges = 0;
    this.challengesWithAnswers.forEach((challengeWithAnswer: $TSFixMe) => {
      if (!challengeWithAnswer.isNeutralized() && challengeWithAnswer.isAnswered()) {
        numberOfNonNeutralizedChallenges++;
      }
    });

    return numberOfNonNeutralizedChallenges;
  }

  numberOfChallengesForCompetence(competenceId: $TSFixMe) {
    const challengesForCompetence = this.challengesWithAnswers.filter(
      (challengeWithAnswer: $TSFixMe) => challengeWithAnswer.competenceId() === competenceId
    );
    const numberOfChallenges = _(challengesForCompetence)
      .map((challenge: $TSFixMe) => {
        if (challengesForCompetence.length < 3 && challenge.isQROCMdep()) {
          return 2;
        } else {
          return 1;
        }
      })
      .sum();
    return numberOfChallenges;
  }

  numberOfCorrectAnswersForCompetence(competenceId: $TSFixMe) {
    const challengesWithAnswersForCompetence = this.challengesWithAnswers.filter(
      (challengeWithAnswer: $TSFixMe) => challengeWithAnswer.competenceId() === competenceId
    );
    let nbOfCorrectAnswers = 0;
    challengesWithAnswersForCompetence.forEach((challengeWithAnswer: $TSFixMe) => {
      if (!challengeWithAnswer.isNeutralized()) {
        if (challengesWithAnswersForCompetence.length < 3 && challengeWithAnswer.isAFullyCorrectQROCMdep()) {
          nbOfCorrectAnswers += 2;
        } else if (challengesWithAnswersForCompetence.length < 3 && challengeWithAnswer.isAPartiallyCorrectQROCMdep()) {
          nbOfCorrectAnswers += 1;
        } else if (challengeWithAnswer.isCorrect()) {
          nbOfCorrectAnswers += 1;
        }
      }
    });

    return _.min([nbOfCorrectAnswers, 3]);
  }

  numberOfNeutralizedChallengesForCompetence(competenceId: $TSFixMe) {
    const answersForCompetence = this.challengesWithAnswers.filter(
      (challengeWithAnswer: $TSFixMe) => challengeWithAnswer.competenceId() === competenceId
    );
    return _(answersForCompetence)
      .map((answer: $TSFixMe) => {
        if (answer.isNeutralized()) {
          if (answersForCompetence.length < 3 && answer.isQROCMdep()) {
            return 2;
          } else {
            return 1;
          }
        } else {
          return 0;
        }
      })
      .sum();
  }
};

class ChallengeWithAnswer {
  _answer: $TSFixMe;
  _challenge: $TSFixMe;
  constructor(answer: $TSFixMe, challenge: $TSFixMe) {
    this._answer = answer;
    this._challenge = challenge;
  }

  isAnswered() {
    return this._answer || this._challenge.hasBeenSkippedAutomatically;
  }

  isQROCMdep() {
    const challengeType = this._challenge ? this._challenge.type : '';
    return challengeType === qrocmDepChallenge;
  }

  isCorrect() {
    return Boolean(this._answer?.isOk());
  }

  isAFullyCorrectQROCMdep() {
    return this.isQROCMdep() && this.isCorrect();
  }

  isAPartiallyCorrectQROCMdep() {
    return this.isQROCMdep() && Boolean(this._answer) && this._answer.isPartially();
  }

  isNeutralized() {
    return this._challenge.isNeutralized;
  }

  competenceId() {
    return this._challenge.competenceId;
  }
}
