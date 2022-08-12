// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationComputeError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationContract = require('../../../../lib/domain/models/CertificationContract');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationContract', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#assertThatWeHaveEnoughAnswers', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are unanswered challenges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const answers = _.map(
          [
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
          ],
          domainBuilder.buildAnswer
        );

        const challenges = _.map(
          [
            {
              challengeId: 'challenge_A_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeA_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_C_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeC_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_B_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeB_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_D_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeD_2',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_E_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeE_2',
              type: 'QCM',
            },
          ],
          domainBuilder.buildCertificationChallengeWithType
        );

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CertificationContract.assertThatWeHaveEnoughAnswers)(answers, challenges);

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal("L’utilisateur n’a pas répondu à toutes les questions, alors qu'aucune raison d'abandon n'a été fournie.");
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not throw', async function () {
        // given
        const answers = _.map(
          [
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
          ],
          domainBuilder.buildAnswer
        );

        const challenges = _.map(
          [
            {
              challengeId: 'challenge_A_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeA_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_B_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeB_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_C_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeC_1',
              type: 'QCM',
              hasBeenSkippedAutomatically: true,
            },
            {
              challengeId: 'challenge_D_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeD_2',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_E_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeE_2',
              type: 'QCM',
            },
          ],
          domainBuilder.buildCertificationChallengeWithType
        );

        // when
        // then
        expect(() => CertificationContract.assertThatWeHaveEnoughAnswers(answers, challenges)).not.to.throw();
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#assertThatCompetenceHasAtLeastOneChallenge', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there not enough challenges for one competence', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const competenceIndex = '1.1';

        const competenceChallenges: $TSFixMe = [];

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CertificationContract.assertThatCompetenceHasAtLeastOneChallenge)(
          competenceChallenges,
          competenceIndex
        );

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal('Pas assez de challenges posés pour la compétence 1.1');
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#assertThatScoreIsCoherentWithReproducibilityRate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when score is < 1 and reproductibility rate is > 50%', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const score = 0;

        const reproducibilityRate = 60;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CertificationContract.assertThatScoreIsCoherentWithReproducibilityRate)(
          score,
          reproducibilityRate
        );

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal('Rejeté avec un taux de reproductibilité supérieur à 50');
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#assertThatEveryAnswerHasMatchingChallenge', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when an answer does not match a challenge', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const answers = _.map(
          [
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
          ],
          domainBuilder.buildAnswer
        );

        const challenges = _.map(
          [
            {
              challengeId: 'challenge_A_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeA_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_C_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeC_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_B_for_competence_1',
              competenceId: 'competence_1',
              associatedSkillName: '@skillChallengeB_1',
              type: 'QCM',
            },
            {
              challengeId: 'challenge_D_for_competence_2',
              competenceId: 'competence_2',
              associatedSkillName: '@skillChallengeD_2',
              type: 'QCM',
            },
          ],
          domainBuilder.buildCertificationChallengeWithType
        );

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CertificationContract.assertThatEveryAnswerHasMatchingChallenge)(
          answers,
          challenges
        );

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal('Problème de chargement du challenge challenge_E_for_competence_2');
      });
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#assertThatNoChallengeHasMoreThanOneAnswer', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are several answers for the same challenge', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw', async function () {
        // given
        const answers = _.map(
          [
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_A_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_B_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_C_for_competence_1', result: 'ok' },
            { challengeId: 'challenge_D_for_competence_2', result: 'ok' },
            { challengeId: 'challenge_E_for_competence_2', result: 'ok' },
          ],
          domainBuilder.buildAnswer
        );

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(CertificationContract.assertThatNoChallengeHasMoreThanOneAnswer)(answers);

        // then
        expect(error).to.be.instanceOf(CertificationComputeError);
        expect((error as $TSFixMe).message).to.equal('Plusieurs réponses pour une même épreuve');
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasEnoughNonNeutralizedChallengesToBeTrusted', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification has more than 66% of non neutralized challenges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', function () {
        // given
        const numberOfChallenges = 15;
        const numberOfNonNeutralizedChallenges = 10;

        // when
        const hasEnoughNonNeutralizedChallengeToBeTrusted =
          CertificationContract.hasEnoughNonNeutralizedChallengesToBeTrusted(
            numberOfChallenges,
            numberOfNonNeutralizedChallenges
          );

        // then
        expect(hasEnoughNonNeutralizedChallengeToBeTrusted).to.be.true;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification has less than 66% of non neutralized challenges', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return false', function () {
        // given
        const numberOfChallenges = 15;
        const numberOfNonNeutralizedChallenges = 9;

        // when
        const hasEnoughNonNeutralizedChallengeToBeTrusted =
          CertificationContract.hasEnoughNonNeutralizedChallengesToBeTrusted(
            numberOfChallenges,
            numberOfNonNeutralizedChallenges
          );

        // then
        expect(hasEnoughNonNeutralizedChallengeToBeTrusted).to.be.false;
      });
    });
  });
});
