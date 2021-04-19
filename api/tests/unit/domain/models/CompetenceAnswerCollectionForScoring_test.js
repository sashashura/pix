const { expect, domainBuilder } = require('../../../test-helper');
const CompetenceAnswerCollectionForScoring = require('../../../../lib/domain/models/CompetenceAnswerCollectionForScoring');
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');

describe('Unit | Domain | Models | CompetenceAnswerCollectionForScoring', function() {

  context('#numberOfChallenges', () => {

    it('equals 0 when no challenges asked', () => {
      // given
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [],
        challengesForCompetence: [],
      });

      // when
      const numberOfChallenges = answerCollection.numberOfChallenges();

      // then
      expect(numberOfChallenges).to.equal(0);
    });

    it('equals the number of challenges when no QROCMDep', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM' });
      const challenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QCM' });
      const challenge3 = _buildDecoratedCertificationChallenge({ challengeId: 'chal3', type: 'QCM' });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId });
      const answer3 = domainBuilder.buildAnswer({ challengeId: challenge3.challengeId });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2, answer3],
        challengesForCompetence: [challenge1, challenge2, challenge3],
      });

      // when
      const numberOfChallenges = answerCollection.numberOfChallenges();

      // then
      expect(numberOfChallenges).to.equal(3);
    });

    it('counts QROCMDeps as double if only two challenges or less', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM' });
      const qROCMDepChallenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QROCM-dep' });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId });
      const qROCMDepAnswer2 = domainBuilder.buildAnswer({ challengeId: qROCMDepChallenge2.challengeId });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, qROCMDepAnswer2 ],
        challengesForCompetence: [challenge1, qROCMDepChallenge2 ],
      });

      // when
      const numberOfChallenges = answerCollection.numberOfChallenges();

      // then
      expect(numberOfChallenges).to.equal(3);
    });

    it('counts QROCMDeps as single if more than two challenges', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ type: 'QCM' });
      const challenge2 = _buildDecoratedCertificationChallenge({ type: 'QCM' });
      const qROCMDepChallenge3 = _buildDecoratedCertificationChallenge({ type: 'QROCM-dep' });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId });
      const qROCMDepAnswer3 = domainBuilder.buildAnswer({ challengeId: qROCMDepChallenge3.challengeId });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2, qROCMDepAnswer3 ],
        challengesForCompetence: [challenge1, challenge2, qROCMDepChallenge3 ],
      });

      // when
      const numberOfChallenges = answerCollection.numberOfChallenges();

      // then
      expect(numberOfChallenges).to.equal(3);
    });

    it('counts answered as well as unanswered challenges indifferently', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM' });
      const challenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QCM' });
      const challenge3 = _buildDecoratedCertificationChallenge({ challengeId: 'chal3', type: 'QCM' });
      const noAnswers = [];
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: noAnswers,
        challengesForCompetence: [challenge1, challenge2, challenge3],
      });

      // when
      const numberOfChallenges = answerCollection.numberOfChallenges();

      // then
      expect(numberOfChallenges).to.equal(3);
    });
  });
  context('#numberOfCorrectAnswers', () => {

    it('equals 0 when no answers', () => {
      // given
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [],
        challengesForCompetence: [],
      });

      // when
      const numberOfCorrectAnswers = answerCollection.numberOfCorrectAnswers();

      // then
      expect(numberOfCorrectAnswers).to.equal(0);
    });

    it('equals 0 when no correct answers', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM' });
      const challenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QCM' });
      const challenge3 = _buildDecoratedCertificationChallenge({ challengeId: 'chal3', type: 'QCM' });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId, result: AnswerStatus.KO });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId, result: AnswerStatus.KO });
      const answer3 = domainBuilder.buildAnswer({ challengeId: challenge3.challengeId, result: AnswerStatus.KO });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2, answer3],
        challengesForCompetence: [challenge1, challenge2, challenge3],
      });

      // when
      const numberOfCorrectAnswers = answerCollection.numberOfCorrectAnswers();

      // then
      expect(numberOfCorrectAnswers).to.equal(0);
    });

    it('equals the number of answers when they are all correct', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM' });
      const challenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QCM' });
      const challenge3 = _buildDecoratedCertificationChallenge({ challengeId: 'chal3', type: 'QCM' });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId, result: AnswerStatus.OK });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId, result: AnswerStatus.OK });
      const answer3 = domainBuilder.buildAnswer({ challengeId: challenge3.challengeId, result: AnswerStatus.OK });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2, answer3],
        challengesForCompetence: [challenge1, challenge2, challenge3],
      });

      // when
      const numberOfCorrectAnswers = answerCollection.numberOfCorrectAnswers();

      // then
      expect(numberOfCorrectAnswers).to.equal(3);
    });

    it('counts QROCMDeps as 1 when partially correct', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM' });
      const qROCMDepChallenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QROCM-dep' });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId, result: AnswerStatus.OK });
      const qROCMDepAnswer2 = domainBuilder.buildAnswer({ challengeId: qROCMDepChallenge2.challengeId, result: AnswerStatus.PARTIALLY });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, qROCMDepAnswer2 ],
        challengesForCompetence: [challenge1, qROCMDepChallenge2 ],
      });

      // when
      const numberOfCorrectAnswers = answerCollection.numberOfCorrectAnswers();

      // then
      expect(numberOfCorrectAnswers).to.equal(2);
    });

    it('counts QROCMDeps as 2 when fully correct', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM' });
      const qROCMDepChallenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QROCM-dep' });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId, result: AnswerStatus.OK });
      const qROCMDepAnswer2 = domainBuilder.buildAnswer({ challengeId: qROCMDepChallenge2.challengeId, result: AnswerStatus.OK });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, qROCMDepAnswer2 ],
        challengesForCompetence: [challenge1, qROCMDepChallenge2 ],
      });

      // when
      const numberOfCorrectAnswers = answerCollection.numberOfCorrectAnswers();

      // then
      expect(numberOfCorrectAnswers).to.equal(3);
    });

    it('count only non-neutralized challenges', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'chal1', type: 'QCM', isNeutralized: true });
      const challenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'chal2', type: 'QCM', isNeutralized: true });
      const challenge3 = _buildDecoratedCertificationChallenge({ challengeId: 'chal3', type: 'QCM', isNeutralized: false });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId, result: AnswerStatus.OK });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId, result: AnswerStatus.OK });
      const answer3 = domainBuilder.buildAnswer({ challengeId: challenge3.challengeId, result: AnswerStatus.OK });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2, answer3],
        challengesForCompetence: [challenge1, challenge2, challenge3],
      });

      // when
      const numberOfChallengesAnswered = answerCollection.numberOfCorrectAnswers();

      // then
      expect(numberOfChallengesAnswered).to.equal(1);
    });
  });

  context('#numberOfNeutralizedChallenges', () => {

    it('equals 0 when there are no answers', () => {
      // given
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [],
        challengesForCompetence: [],
      });

      // when
      const numberOfNeutralizedChallenges = answerCollection.numberOfNeutralizedChallenges();

      // then
      expect(numberOfNeutralizedChallenges).to.equal(0);
    });

    it('equals the number of challenges when there are all neutralized and none of them are QROCMDep', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ type: 'QCM', isNeutralized: true });
      const challenge2 = _buildDecoratedCertificationChallenge({ type: 'QCM', isNeutralized: true });
      const challenge3 = _buildDecoratedCertificationChallenge({ type: 'QCM', isNeutralized: true });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId });
      const answer3 = domainBuilder.buildAnswer({ challengeId: challenge3.challengeId });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2, answer3],
        challengesForCompetence: [challenge1, challenge2, challenge3],
      });

      // when
      const numberOfNeutralizedChallenges = answerCollection.numberOfNeutralizedChallenges();

      // then
      expect(numberOfNeutralizedChallenges).to.equal(3);
    });

    it('counts a neutralized QROCMDep challenge as two neutralized challenges when less than 3 challenges', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'rec1234', type: 'QCM', isNeutralized: true });
      const challenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'rec456', type: 'QROCM-dep', isNeutralized: true });
      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2],
        challengesForCompetence: [challenge1, challenge2],
      });

      // when
      const numberOfNeutralizedChallenges = answerCollection.numberOfNeutralizedChallenges();

      // then
      expect(numberOfNeutralizedChallenges).to.equal(3);
    });

    it('counts a neutralized QROCMDep challenge as a single neutralized challenge when 3 challenges', () => {
      // given
      const challenge1 = _buildDecoratedCertificationChallenge({ challengeId: 'rec1234', type: 'QCM', isNeutralized: true });
      const challenge2 = _buildDecoratedCertificationChallenge({ challengeId: 'rec456', type: 'QROCM-dep', isNeutralized: true });
      const challenge3 = _buildDecoratedCertificationChallenge({ challengeId: 'rec789', type: 'QCM', isNeutralized: true });

      const answer1 = domainBuilder.buildAnswer({ challengeId: challenge1.challengeId });
      const answer2 = domainBuilder.buildAnswer({ challengeId: challenge2.challengeId });
      const answer3 = domainBuilder.buildAnswer({ challengeId: challenge3.challengeId });
      const answerCollection = CompetenceAnswerCollectionForScoring.from({
        answersForCompetence: [answer1, answer2, answer3],
        challengesForCompetence: [challenge1, challenge2, challenge3],
      });

      // when
      const numberOfNeutralizedChallenges = answerCollection.numberOfNeutralizedChallenges();

      // then
      expect(numberOfNeutralizedChallenges).to.equal(3);
    });
  });
});

function _buildDecoratedCertificationChallenge({ challengeId, type, isNeutralized }) {
  const challenge = domainBuilder.buildCertificationChallenge({ challengeId, isNeutralized });
  challenge.type = type; // TODO : CertificationChallenge are decorated with type in certification-result-service, find a better way.
  return challenge;
}
