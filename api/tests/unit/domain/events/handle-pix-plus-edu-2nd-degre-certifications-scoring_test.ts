// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_PLUS_E... Remove this comment to see the full error message
const { PIX_PLUS_EDU_2ND_DEGRE } = require('../../../../lib/domain/models/ComplementaryCertification');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2687): All declarations of 'handlePixPlusEdu2ndDegreCerti... Remove this comment to see the full error message
const { handlePixPlusEdu2ndDegreCertificationsScoring } = require('../../../../lib/domain/events')._forTestOnly
  .handlers;
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-pix-plus-edu-2nd-degre-certifications-scoring', function () {
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
    const error = await catchErr(handlePixPlusEdu2ndDegreCertificationsScoring)({ event, ...dependencies });

    // then
expect((error as $TSFixMe).message).to.equal('event must be one of types CertificationScoringCompleted, CertificationRescoringCompleted');
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the assessment has a Pix+ Edu 2nd degre challenge', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
      PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
      PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
    ].forEach((certifiableBadgeKey) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should score Pix+ Édu certification for badge ${certifiableBadgeKey}`, async function () {
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
              certifiableBadgeKey,
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

        (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId
    .withArgs({
    certificationCourseId: 123,
    complementaryCertificationKey: PIX_PLUS_EDU_2ND_DEGRE,
})
    .resolves(999);

        // when
        await handlePixPlusEdu2ndDegreCertificationsScoring({ event, ...dependencies });

        // then
        const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
          complementaryCertificationCourseId: 999,
          certifiableBadgeKey,
          reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 100 }),
          hasAcquiredPixCertification: true,
        });
        expect((partnerCertificationScoringRepository as $TSFixMe).save).to.have.been.calledWithExactly({
    partnerCertificationScoring: expectedPartnerCertificationScoring,
});
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when the assessment has no Pix+ Edu 2nd degre challenge', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not score Pix+ Edu 2nd degre certifications', async function () {
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
        certificationAnswersByDate: [domainBuilder.buildCertificationChallengeWithType({ challengeId: 'chal1' })],
      });
      (certificationAssessmentRepository as $TSFixMe).getByCertificationCourseId
    .withArgs({ certificationCourseId: 123 })
    .resolves(certificationAssessment);
      (complementaryCertificationCourseRepository as $TSFixMe).getComplementaryCertificationCourseId
    .withArgs({
    certificationCourseId: 123,
    complementaryCertificationKey: PIX_PLUS_EDU_2ND_DEGRE,
})
    .resolves(999);

      // when
      await handlePixPlusEdu2ndDegreCertificationsScoring({ event, ...dependencies });

      // then
expect((partnerCertificationScoringRepository as $TSFixMe).save).to.not.have.been.called;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('scoring', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save a "not acquired" Pix+ Edu 2nd degre certification when pix certification is not validated', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });
      const certificationChallenge = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal1',
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
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
    complementaryCertificationKey: PIX_PLUS_EDU_2ND_DEGRE,
})
    .resolves(999);

      // when
      await handlePixPlusEdu2ndDegreCertificationsScoring({ event, ...dependencies });

      // then
      const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
        complementaryCertificationCourseId: 999,
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 100 }),
        hasAcquiredPixCertification: false,
      });
      expect((partnerCertificationScoringRepository as $TSFixMe).save).to.have.been.calledWithExactly({
    partnerCertificationScoring: expectedPartnerCertificationScoring,
});

      expect(expectedPartnerCertificationScoring.isAcquired()).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save a "not acquired" Pix+ Edu 2nd degre certification when pix certification is validated and repro rate is not sufficient', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });
      const certificationChallenge1 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal1',
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      });
      const certificationChallenge2 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal2',
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
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
    complementaryCertificationKey: PIX_PLUS_EDU_2ND_DEGRE,
})
    .resolves(999);

      // when
      await handlePixPlusEdu2ndDegreCertificationsScoring({ event, ...dependencies });

      // then
      const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
        complementaryCertificationCourseId: 999,
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
        reproducibilityRate: domainBuilder.buildReproducibilityRate({ value: 50 }),
        hasAcquiredPixCertification: true,
      });
      expect((partnerCertificationScoringRepository as $TSFixMe).save).to.have.been.calledWithExactly({
    partnerCertificationScoring: expectedPartnerCertificationScoring,
});
      expect(expectedPartnerCertificationScoring.isAcquired()).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save an "acquired" Pix+ Edu 2nd degre certification when pix certification is validated and repro rate is sufficient', async function () {
      // given
      const event = domainBuilder.buildCertificationScoringCompletedEvent({
        certificationCourseId: 123,
        userId: 456,
      });
      const certificationChallenge1 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal1',
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
      });
      const certificationChallenge2 = domainBuilder.buildCertificationChallengeWithType({
        challengeId: 'chal2',
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
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
    complementaryCertificationKey: PIX_PLUS_EDU_2ND_DEGRE,
})
    .resolves(999);

      // when
      await handlePixPlusEdu2ndDegreCertificationsScoring({ event, ...dependencies });

      // then
      const expectedPartnerCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
        complementaryCertificationCourseId: 999,
        certifiableBadgeKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
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
