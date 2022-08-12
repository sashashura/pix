// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2687): All declarations of 'handlePixPlusDroitCertificati... Remove this comment to see the full error message
const { handlePixPlusDroitCertificationsScoring } = require('../../../../lib/domain/events')._forTestOnly.handlers;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_D... Remove this comment to see the full error message
const { PIX_PLUS_DROIT } = require('../../../../lib/domain/models/ComplementaryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
const { PIX_DROIT_MAITRE_CERTIF } = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-pix-plus-droit-certifications-scoring', function () {
  const certificationAssessmentRepository = {};
  const partnerCertificationScoringRepository = {};
  const assessmentResultRepository = {};
  const complementaryCertificationCourseRepository = {};

  const dependencies = {
    certificationAssessmentRepository,
    partnerCertificationScoringRepository,
    assessmentResultRepository,
    complementaryCertificationCourseRepository,
  };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    (partnerCertificationScoringRepository as $TSFixMe).save = sinon.stub();
    (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId = sinon.stub();
    (assessmentResultRepository as $TSFixMe).getByCertificationCourseId = sinon.stub();
    (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('fails when event is not of correct type', async function () {
    // given
    const event = 'not an event of the correct type';

    // when / then
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(handlePixPlusDroitCertificationsScoring)({ event, ...dependencies });

    // then
expect((error as $TSFixMe).message).to.equal('event must be one of types CertificationScoringCompleted, CertificationRescoringCompleted');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is no Pix+ Droit complementary certification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not score Pix+ Droit certifications', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });

      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId: 123,
        userId: 456,
        createdAt: new Date('2020-01-01'),
        certificationChallenges: [
          domainBuilder.buildCertificationChallengeWithType({
            certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
            challengeId: 'chal1',
          }),
        ],
        certificationAnswersByDate: [domainBuilder.buildCertificationChallengeWithType({ challengeId: 'chal1' })],
      });
      (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(certificationAssessment);

      (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId
    .withArgs({
    certificationCourseId: 123,
    complementaryCertificationKey: PIX_PLUS_DROIT,
})
    .resolves(false);

      // when
      await handlePixPlusDroitCertificationsScoring({ event, ...dependencies });

      // then
expect((partnerCertificationScoringRepository as $TSFixMe).save).to.not.have.been.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when there is a Pix+ Droit complementary certification', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should score Pix+ Droit certifications', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });

      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId: 123,
        userId: 456,
        createdAt: new Date('2020-01-01'),
        certificationChallenges: [
          domainBuilder.buildCertificationChallengeWithType({
            certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
            challengeId: 'chal1',
          }),
        ],
        certificationAnswersByDate: [domainBuilder.buildAnswer.ok({ challengeId: 'chal1' })],
      });
      (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(certificationAssessment);

      (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId
    .withArgs({
    certificationCourseId: 123,
    complementaryCertificationKey: PIX_PLUS_DROIT,
})
    .resolves(999);

      (assessmentResultRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(domainBuilder.buildAssessmentResult());

      // when
      await handlePixPlusDroitCertificationsScoring({ event, ...dependencies });

      // then
      const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        complementaryCertificationCourseId: 999,
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
        reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 100 }),
        hasAcquiredPixCertification: true,
      });
      expect((partnerCertificationScoringRepository as $TSFixMe).save).to.have.been.calledWithExactly({
    partnerCertificationScoring: expectedPartnerCertificationScoring,
});
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should only score Pix+ Droit complementary certifications', async function () {
    // given
    const event = domainBuilder.buildCertificationScoringCompletedEvent({
      certificationCourseId: 123,
      userId: 456,
    });
    const certificationAssessment = domainBuilder.buildCertificationAssessment({
      certificationCourseId: 123,
      userId: 456,
      createdAt: new Date('2020-01-01'),
      certificationChallenges: [
        domainBuilder.buildCertificationChallengeWithType({
          certifiableBadgeKey: 'TOTO',
          challengeId: 'chal1',
        }),
      ],
      certificationAnswersByDate: [domainBuilder.buildAnswer.ok({ challengeId: 'chal1' })],
    });
    (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(certificationAssessment);

    (assessmentResultRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(domainBuilder.buildAssessmentResult());

    // when
    await handlePixPlusDroitCertificationsScoring({ event, ...dependencies });

    // then
expect((partnerCertificationScoringRepository as $TSFixMe).save).to.not.have.been.called;
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('scoring', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save a "not acquired" Pix+ Droit certification when pix certification is not validated', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });
      const complementaryCertificationCourseId = 999;
      const certificationChallenge = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal1',
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
      });
      const certificationAnswer = domainBuilder.buildAnswer.ok({ challengeId: 'chal1' });
      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId: 123,
        userId: 456,
        createdAt: new Date('2020-01-01'),
        certificationChallenges: [certificationChallenge],
        certificationAnswersByDate: [certificationAnswer],
      });
      (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(certificationAssessment);
      (assessmentResultRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(domainBuilder.buildAssessmentResult.rejected());
      (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId
    .withArgs({
    certificationCourseId: 123,
    complementaryCertificationKey: PIX_PLUS_DROIT,
})
    .resolves(complementaryCertificationCourseId);

      // when
      await handlePixPlusDroitCertificationsScoring({ event, ...dependencies });

      // then
      const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        complementaryCertificationCourseId,
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
        reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 100 }),
        hasAcquiredPixCertification: false,
      });
      expect((partnerCertificationScoringRepository as $TSFixMe).save).to.have.been.calledWithExactly({
    partnerCertificationScoring: expectedPartnerCertificationScoring,
});

      expect(expectedPartnerCertificationScoring.isAcquired()).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save a "not acquired" Pix+ Droit certification when pix certification is validated and repro rate is not sufficient', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });
      const certificationChallenge1 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal1',
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
      });
      const certificationChallenge2 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal2',
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
      });
      const certificationAnswer1 = domainBuilder.buildAnswer.ko({ challengeId: 'chal1' });
      const certificationAnswer2 = domainBuilder.buildAnswer.ok({ challengeId: 'chal2' });
      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId: 123,
        userId: 456,
        createdAt: new Date('2020-01-01'),
        certificationChallenges: [certificationChallenge1, certificationChallenge2],
        certificationAnswersByDate: [certificationAnswer1, certificationAnswer2],
      });
      (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(certificationAssessment);
      (assessmentResultRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(domainBuilder.buildAssessmentResult.validated());
      (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId
    .withArgs({
    certificationCourseId: 123,
    complementaryCertificationKey: PIX_PLUS_DROIT,
})
    .resolves(999);

      // when
      await handlePixPlusDroitCertificationsScoring({ event, ...dependencies });

      // then
      const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        complementaryCertificationCourseId: 999,
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
        reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 50 }),
        hasAcquiredPixCertification: true,
      });
      expect((partnerCertificationScoringRepository as $TSFixMe).save).to.have.been.calledWithExactly({
    partnerCertificationScoring: expectedPartnerCertificationScoring,
});
      expect(expectedPartnerCertificationScoring.isAcquired()).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save an "acquired" Pix+ Droit certification when pix certification is validated and repro rate is sufficient', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });
      const certificationChallenge1 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal1',
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
      });
      const certificationChallenge2 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal2',
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
      });
      const certificationAnswer1 = domainBuilder.buildAnswer.ok({ challengeId: 'chal1' });
      const certificationAnswer2 = domainBuilder.buildAnswer.ok({ challengeId: 'chal2' });
      const certificationAssessment = domainBuilder.buildCertificationAssessment({
        certificationCourseId: 123,
        userId: 456,
        createdAt: new Date('2020-01-01'),
        certificationChallenges: [certificationChallenge1, certificationChallenge2],
        certificationAnswersByDate: [certificationAnswer1, certificationAnswer2],
      });
      (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(certificationAssessment);
      (assessmentResultRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(domainBuilder.buildAssessmentResult.validated());
      (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId
    .withArgs({
    certificationCourseId: 123,
    complementaryCertificationKey: PIX_PLUS_DROIT,
})
    .resolves(999);

      // when
      await handlePixPlusDroitCertificationsScoring({ event, ...dependencies });

      // then
      const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        complementaryCertificationCourseId: 999,
        certifiableBadgeKey: PIX_DROIT_MAITRE_CERTIF,
        reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 100 }),
        hasAcquiredPixCertification: true,
      });
      expect((partnerCertificationScoringRepository as $TSFixMe).save).to.have.been.calledWithExactly({
    partnerCertificationScoring: expectedPartnerCertificationScoring,
});
      expect(expectedPartnerCertificationScoring.isAcquired()).to.be.true;
    });
  });
});
