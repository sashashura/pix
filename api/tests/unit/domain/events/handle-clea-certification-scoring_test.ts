// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('../../../../lib/domain/events/CertificationScoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('../../../../lib/domain/events/CertificationRescoringCompleted');
// @ts-expect-error TS(2687): All declarations of 'handleCleaCertificationScorin... Remove this comment to see the full error message
const { handleCleaCertificationScoring } = require('../../../../lib/domain/events')._forTestOnly.handlers;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CLEA'.
const { CLEA } = require('../../../../lib/domain/models/ComplementaryCertification');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-clea-certification-scoring', function () {
  let partnerCertificationScoringRepository: $TSFixMe;
  let certificationCourseRepository: $TSFixMe;
  let badgeRepository: $TSFixMe;
  let knowledgeElementRepository: $TSFixMe;
  let targetProfileRepository: $TSFixMe;
  let badgeCriteriaService: $TSFixMe;
  let complementaryCertificationCourseRepository: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    partnerCertificationScoringRepository = {
      getCleaCertificationScoring: sinon.stub(),
      save: sinon.stub(),
    };

    badgeRepository = {
      getByKey: sinon.stub(),
    };

    knowledgeElementRepository = {
      findUniqByUserId: sinon.stub(),
    };

    targetProfileRepository = {
      get: sinon.stub(),
    };

    badgeCriteriaService = {
      areBadgeCriteriaFulfilled: sinon.stub(),
    };

    certificationCourseRepository = {
      getCreationDate: sinon.stub(),
    };

    complementaryCertificationCourseRepository = { getComplementaryCertificationCourseId: sinon.stub() };
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('check event', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('fails when event is not an event', async function () {
      // when / then
      const event = 'not a good event';
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(handleCleaCertificationScoring)({
        event,
        partnerCertificationScoringRepository,
        badgeRepository,
        knowledgeElementRepository,
        certificationCourseRepository,
        targetProfileRepository,
        badgeCriteriaService,
        complementaryCertificationCourseRepository,
      });

      // then
expect((error as $TSFixMe).message).to.equal('event must be one of types CertificationScoringCompleted, CertificationRescoringCompleted');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not fail if event is of correct type CertificationScoringCompleted', async function () {
      // when / then
      const event = new CertificationRescoringCompleted({});
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(handleCleaCertificationScoring)({
        event,
        partnerCertificationScoringRepository,
        badgeRepository,
        knowledgeElementRepository,
        certificationCourseRepository,
        targetProfileRepository,
        badgeCriteriaService,
        complementaryCertificationCourseRepository,
      });

      // then
expect((error as $TSFixMe).message).not.to.equal('event must be one of types CertificationScoringCompleted, CertificationRescoringCompleted');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not fail if event is of correct type CertificationRescoringCompleted', async function () {
      // given
      const event = new CertificationRescoringCompleted({});
      // when / then
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(handleCleaCertificationScoring)({
        event,
        partnerCertificationScoringRepository,
        badgeRepository,
        knowledgeElementRepository,
        certificationCourseRepository,
        targetProfileRepository,
        badgeCriteriaService,
        complementaryCertificationCourseRepository,
      });

      // then
expect((error as $TSFixMe).message).not.to.equal('event must be one of types CertificationScoringCompleted');
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#handleCleaCertificationScoring', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when scoring', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when cleA certification has been started', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should save a certif partner', async function () {
          // given
          const userId = 1234;
          const certificationCourseId = 4567;
          const complementaryCertificationCourseId = 999;
          const knowledgeElements = [
            domainBuilder.buildKnowledgeElement({ userId }),
            domainBuilder.buildKnowledgeElement({ userId }),
          ];
          const cleaCertificationScoring = domainBuilder.buildCleaCertificationScoring({
            complementaryCertificationCourseId,
            reproducibilityRate: 85,
            hasAcquiredBadge: true,
          });
          const targetProfile = domainBuilder.buildTargetProfile({ id: 34435 });
          const badge = domainBuilder.buildBadge({ targetProfileId: 34435 });
          const event = new CertificationScoringCompleted({
            certificationCourseId,
            userId,
            isCertification: true,
            reproducibilityRate: 85,
          });
          const date = '2021-01-01';

          partnerCertificationScoringRepository.getCleaCertificationScoring
            .withArgs({
              complementaryCertificationCourseId,
              certificationCourseId,
              userId,
              reproducibilityRate: 85,
            })
            .resolves(cleaCertificationScoring);

          certificationCourseRepository.getCreationDate.withArgs(certificationCourseId).resolves(date);

          badgeRepository.getByKey.resolves(badge);

          targetProfileRepository.get.withArgs(34435).resolves(targetProfile);

          knowledgeElementRepository.findUniqByUserId
            .withArgs({ userId: event.userId, limitDate: date })
            .resolves(knowledgeElements);

          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ knowledgeElements, targetProfile, badge })
            .returns(true);

          complementaryCertificationCourseRepository.getComplementaryCertificationCourseId
            .withArgs({
              certificationCourseId,
              complementaryCertificationKey: CLEA,
            })
            .resolves(complementaryCertificationCourseId);

          // when
          await handleCleaCertificationScoring({
            event,
            partnerCertificationScoringRepository,
            badgeRepository,
            knowledgeElementRepository,
            certificationCourseRepository,
            targetProfileRepository,
            badgeCriteriaService,
            complementaryCertificationCourseRepository,
          });

          // then
          expect(partnerCertificationScoringRepository.save).to.have.been.calledWithMatch({
            partnerCertificationScoring: cleaCertificationScoring,
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when cleA certification has not been started', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save a certif partner', async function () {
          // given
          const userId = 1234;
          const certificationCourseId = 4567;
          complementaryCertificationCourseRepository.getComplementaryCertificationCourseId
            .withArgs({
              certificationCourseId,
              complementaryCertificationKey: CLEA,
            })
            .resolves(undefined);

          const event = new CertificationScoringCompleted({
            certificationCourseId,
            userId,
            isCertification: true,
            reproducibilityRate: 85,
          });

          // when
          await handleCleaCertificationScoring({
            event,
            partnerCertificationScoringRepository,
            badgeRepository,
            knowledgeElementRepository,
            certificationCourseRepository,
            targetProfileRepository,
            badgeCriteriaService,
            complementaryCertificationCourseRepository,
          });

          // then
          expect(partnerCertificationScoringRepository.save).not.to.have.been.called;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when rescoring', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when cleA certification has been started', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should save a certif partner', async function () {
          // given
          const userId = 1234;
          const certificationCourseId = 4567;
          const complementaryCertificationCourseId = 999;
          const knowledgeElements = [
            domainBuilder.buildKnowledgeElement({ userId }),
            domainBuilder.buildKnowledgeElement({ userId }),
          ];
          const cleaCertificationScoring = domainBuilder.buildCleaCertificationScoring({
            complementaryCertificationCourseId,
            reproducibilityRate: 85,
            hasAcquiredBadge: true,
          });
          const targetProfile = domainBuilder.buildTargetProfile({ id: 34435 });
          const badge = domainBuilder.buildBadge({ targetProfileId: 34435 });
          const event = new CertificationRescoringCompleted({
            certificationCourseId,
            userId,
            isCertification: true,
            reproducibilityRate: 85,
          });
          const date = '2021-01-01';

          partnerCertificationScoringRepository.getCleaCertificationScoring
            .withArgs({
              complementaryCertificationCourseId,
              certificationCourseId,
              userId,
              reproducibilityRate: 85,
            })
            .resolves(cleaCertificationScoring);

          certificationCourseRepository.getCreationDate.withArgs(certificationCourseId).resolves(date);

          badgeRepository.getByKey.resolves(badge);

          targetProfileRepository.get.withArgs(34435).resolves(targetProfile);

          knowledgeElementRepository.findUniqByUserId
            .withArgs({ userId: event.userId, limitDate: date })
            .resolves(knowledgeElements);

          badgeCriteriaService.areBadgeCriteriaFulfilled
            .withArgs({ knowledgeElements, targetProfile, badge })
            .returns(true);

          complementaryCertificationCourseRepository.getComplementaryCertificationCourseId
            .withArgs({
              certificationCourseId,
              complementaryCertificationKey: CLEA,
            })
            .resolves(complementaryCertificationCourseId);

          // when
          await handleCleaCertificationScoring({
            event,
            partnerCertificationScoringRepository,
            badgeRepository,
            knowledgeElementRepository,
            certificationCourseRepository,
            targetProfileRepository,
            badgeCriteriaService,
            complementaryCertificationCourseRepository,
          });

          // then
          expect(partnerCertificationScoringRepository.save).to.have.been.calledWithMatch({
            partnerCertificationScoring: cleaCertificationScoring,
          });
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when cleA certification has not been started', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should not save a certif partner', async function () {
          // given
          const userId = 1234;
          const certificationCourseId = 4567;
          complementaryCertificationCourseRepository.getComplementaryCertificationCourseId
            .withArgs({
              certificationCourseId,
              complementaryCertificationKey: CLEA,
            })
            .resolves(undefined);

          const event = new CertificationRescoringCompleted({
            certificationCourseId,
            userId,
            isCertification: true,
            reproducibilityRate: 85,
          });

          // when
          await handleCleaCertificationScoring({
            event,
            partnerCertificationScoringRepository,
            badgeRepository,
            knowledgeElementRepository,
            certificationCourseRepository,
            targetProfileRepository,
            badgeCriteriaService,
            complementaryCertificationCourseRepository,
          });

          // then
          expect(partnerCertificationScoringRepository.save).not.to.have.been.called;
        });
      });
    });
  });
});
