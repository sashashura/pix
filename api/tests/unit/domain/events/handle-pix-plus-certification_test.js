const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
const { handlePixPlusCertifications } = require('../../../../lib/domain/events')._forTestOnly.handlers;

describe('Unit | Domain | Events | handle-pix-plus-certification', () => {

  const domainTransaction = Symbol('domainTransaction');
  const certificationAssessmentRepository = {
    getByCertificationCourseId: sinon.stub(),
  };
  const partnerCertificationRepository = {
    save: sinon.stub(),
  };
  const dependencies = {
    certificationAssessmentRepository,
    partnerCertificationRepository,
  };

  it('fails when event is not of correct type', async () => {
    // given
    const event = 'not an event of the correct type';

    // when / then
    const error = await catchErr(handlePixPlusCertifications)(
      { event, domainTransaction, ...dependencies },
    );

    // then
    expect(error.message).to.equal('event must be of type CertificationScoringCompleted');
  });

  context('when user was not asked any pix plus challenges', () => {

    it('should save no pix plus certifications', async () => {
      // given
      partnerCertificationRepository.save.reset();
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });
      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId: 123,
        userId: 456,
        createdAt: new Date('2020-01-01'),
        certificationChallenges: [domainBuilder.buildCertificationChallenge({ certifiableBadgeKey: null, challengeId: 'chal1' })],
        certificationAnswersByDate: [domainBuilder.buildCertificationChallenge({ challengeId: 'chal1' })],
      });
      certificationAssessmentRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId: 123, domainTransaction })
        .resolves(certificationAssessment);

      // when
      await handlePixPlusCertifications({ event, domainTransaction, ...dependencies });

      // then
      expect(partnerCertificationRepository.save).to.not.have.been.called;
    });
  });

  context('when user has answered some pix plus challenges', () => {

    it('should save as many pix plus certifications as there are certifiable badges evaluted during the certification test', async () => {
      // given
      partnerCertificationRepository.save.reset();
      const event = domainBuilder.buildCertificationScoringCompletedEvent.validated({
        certificationCourseId: 123,
        userId: 456,
      });
      const certificationChallengeMangue = domainBuilder.buildCertificationChallenge({ challengeId: 'chal1', certifiableBadgeKey: 'BADGE_MANGUE' });
      const certificationChallengePasteque = domainBuilder.buildCertificationChallenge({ challengeId: 'chal2', certifiableBadgeKey: 'BADGE_PASTEQUE' });
      const certificationAnswerMangue = domainBuilder.buildAnswer({ challengeId: 'chal1' });
      const certificationAnswerPasteque = domainBuilder.buildAnswer({ challengeId: 'chal2' });
      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId: 123,
        userId: 456,
        createdAt: new Date('2020-01-01'),
        certificationChallenges: [certificationChallengeMangue, certificationChallengePasteque],
        certificationAnswersByDate: [certificationAnswerMangue, certificationAnswerPasteque],
      });
      certificationAssessmentRepository.getByCertificationCourseId
        .withArgs({ certificationCourseId: 123, domainTransaction })
        .resolves(certificationAssessment);

      // when
      await handlePixPlusCertifications({ event, domainTransaction, ...dependencies });

      // then
      expect(partnerCertificationRepository.save.callCount).to.equal(2);
    });

    context('scoring', () => {

      it('should save a not acquired pix plus certification when pix certification is not validated', async () => {
        // given
        partnerCertificationRepository.save.reset();
        const event = domainBuilder.buildCertificationScoringCompletedEvent.rejected({
          certificationCourseId: 123,
          userId: 456,
        });
        const certificationChallenge = domainBuilder.buildCertificationChallenge({ challengeId: 'chal1', certifiableBadgeKey: 'BADGE_MANGUE' });
        const certificationAnswer = domainBuilder.buildAnswer.ok({ challengeId: 'chal1' });
        const certificationAssessment = domainBuilder.buildCertificationAssessment({
          certificationCourseId: 123,
          userId: 456,
          createdAt: new Date('2020-01-01'),
          certificationChallenges: [certificationChallenge],
          certificationAnswersByDate: [certificationAnswer],
        });
        certificationAssessmentRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId: 123, domainTransaction })
          .resolves(certificationAssessment);

        // when
        await handlePixPlusCertifications({ event, domainTransaction, ...dependencies });

        // then
        const expectedPartnerCertification = domainBuilder.buildPixPlusCertification({
          certificationCourseId: 123,
          certifiableBadgeKey: 'BADGE_MANGUE',
          reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 100 }),
          hasAcquiredPixCertification: false,
        });
        expect(partnerCertificationRepository.save).to.have.been.calledWithExactly({ partnerCertification: expectedPartnerCertification, domainTransaction });
      });

      it('should save a not acquired pix plus certification when pix certification is validated and repro rate is not sufficient', async () => {
        // given
        partnerCertificationRepository.save.reset();
        const event = domainBuilder.buildCertificationScoringCompletedEvent.validated({
          certificationCourseId: 123,
          userId: 456,
        });
        const certificationChallenge1 = domainBuilder.buildCertificationChallenge({ challengeId: 'chal1', certifiableBadgeKey: 'BADGE_MANGUE' });
        const certificationChallenge2 = domainBuilder.buildCertificationChallenge({ challengeId: 'chal2', certifiableBadgeKey: 'BADGE_MANGUE' });
        const certificationAnswer1 = domainBuilder.buildAnswer.ko({ challengeId: 'chal1' });
        const certificationAnswer2 = domainBuilder.buildAnswer.ok({ challengeId: 'chal2' });
        const certificationAssessment = domainBuilder.buildCertificationAssessment({
          certificationCourseId: 123,
          userId: 456,
          createdAt: new Date('2020-01-01'),
          certificationChallenges: [certificationChallenge1, certificationChallenge2],
          certificationAnswersByDate: [certificationAnswer1, certificationAnswer2],
        });
        certificationAssessmentRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId: 123, domainTransaction })
          .resolves(certificationAssessment);

        // when
        await handlePixPlusCertifications({ event, domainTransaction, ...dependencies });

        // then
        const expectedPartnerCertification = domainBuilder.buildPixPlusCertification({
          certificationCourseId: 123,
          certifiableBadgeKey: 'BADGE_MANGUE',
          reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 50 }),
          hasAcquiredPixCertification: true,
        });
        expect(partnerCertificationRepository.save).to.have.been.calledWithExactly({ partnerCertification: expectedPartnerCertification, domainTransaction });
      });

      it('should save an acquired pix plus certification when pix certification is validated and repro rate is sufficient', async () => {
        // given
        partnerCertificationRepository.save.reset();
        const event = domainBuilder.buildCertificationScoringCompletedEvent.validated({
          certificationCourseId: 123,
          userId: 456,
        });
        const certificationChallenge1 = domainBuilder.buildCertificationChallenge({ challengeId: 'chal1', certifiableBadgeKey: 'BADGE_MANGUE' });
        const certificationChallenge2 = domainBuilder.buildCertificationChallenge({ challengeId: 'chal2', certifiableBadgeKey: 'BADGE_MANGUE' });
        const certificationAnswer1 = domainBuilder.buildAnswer.ok({ challengeId: 'chal1' });
        const certificationAnswer2 = domainBuilder.buildAnswer.ok({ challengeId: 'chal2' });
        const certificationAssessment = domainBuilder.buildCertificationAssessment({
          certificationCourseId: 123,
          userId: 456,
          createdAt: new Date('2020-01-01'),
          certificationChallenges: [certificationChallenge1, certificationChallenge2],
          certificationAnswersByDate: [certificationAnswer1, certificationAnswer2],
        });
        certificationAssessmentRepository.getByCertificationCourseId
          .withArgs({ certificationCourseId: 123, domainTransaction })
          .resolves(certificationAssessment);

        // when
        await handlePixPlusCertifications({ event, domainTransaction, ...dependencies });

        // then
        const expectedPartnerCertification = domainBuilder.buildPixPlusCertification({
          certificationCourseId: 123,
          certifiableBadgeKey: 'BADGE_MANGUE',
          reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 100 }),
          hasAcquiredPixCertification: true,
        });
        expect(partnerCertificationRepository.save).to.have.been.calledWithExactly({ partnerCertification: expectedPartnerCertification, domainTransaction });
      });
    });
  });
});
