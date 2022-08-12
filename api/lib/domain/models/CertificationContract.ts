// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationContract {
  /* PUBLIC INTERFACE */
  static assertThatWeHaveEnoughAnswers(listAnswers: $TSFixMe, listChallenges: $TSFixMe) {
    const someUnansweredChallenges = _.some(listChallenges, (challenge: $TSFixMe) => {
      return !challenge.hasBeenSkippedAutomatically &&
      !challenge.isNeutralized &&
      !listAnswers.find((answer: $TSFixMe) => answer.challengeId === challenge.challengeId);
    });

    if (someUnansweredChallenges) {
      throw new CertificationComputeError(
        "L’utilisateur n’a pas répondu à toutes les questions, alors qu'aucune raison d'abandon n'a été fournie."
      );
    }
  }

  static assertThatCompetenceHasAtLeastOneChallenge(challengesForCompetence: $TSFixMe, competenceIndex: $TSFixMe) {
    if (challengesForCompetence.length === 0) {
      throw new CertificationComputeError('Pas assez de challenges posés pour la compétence ' + competenceIndex);
    }
  }

  static assertThatScoreIsCoherentWithReproducibilityRate(scoreAfterRating: $TSFixMe, reproducibilityRate: $TSFixMe) {
    if (scoreAfterRating < 1 && reproducibilityRate > 50) {
      throw new CertificationComputeError('Rejeté avec un taux de reproductibilité supérieur à 50');
    }
  }

  static assertThatEveryAnswerHasMatchingChallenge(answersForCompetence: $TSFixMe, challengesForCompetence: $TSFixMe) {
    answersForCompetence.forEach((answer: $TSFixMe) => {
      const challenge = _.find(challengesForCompetence, { challengeId: answer.challengeId });
      if (!challenge) {
        throw new CertificationComputeError('Problème de chargement du challenge ' + answer.challengeId);
      }
    });
  }

  static assertThatNoChallengeHasMoreThanOneAnswer(answersForCompetence: $TSFixMe) {
    const someChallengesHaveMoreThanOneAnswer = _(answersForCompetence)
      .groupBy((answer: $TSFixMe) => answer.challengeId)
      .some((answerGroup: $TSFixMe) => answerGroup.length > 1);

    if (someChallengesHaveMoreThanOneAnswer) {
      throw new CertificationComputeError('Plusieurs réponses pour une même épreuve');
    }
  }

  static hasEnoughNonNeutralizedChallengesToBeTrusted(numberOfChallenges: $TSFixMe, numberOfNonNeutralizedChallenges: $TSFixMe) {
    const minimalNumberOfNonNeutralizedChallengesToBeTrusted = Math.ceil(numberOfChallenges * 0.66);
    return numberOfNonNeutralizedChallenges >= minimalNumberOfNonNeutralizedChallengesToBeTrusted;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationContract;
