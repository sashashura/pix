// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildEvent... Remove this comment to see the full error message
const buildEventDispatcherAndHandlersForTest = require('../../../tooling/events/event-dispatcher-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('../../../../lib/domain/events/CertificationScoringCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationRescoringCompleted = require('../../../../lib/domain/events/CertificationRescoringCompleted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Event Choreography | Score Pix+ Édu 1er degre Certification', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('chains Certification Scoring and Pix+ Édu 1er degre Certification Scoring on Certification Scoring Completed', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();

    const domainTransaction = Symbol('a transaction');
    const assessmentCompleted = new AssessmentCompleted();
    const certificationScoringCompleted = new CertificationScoringCompleted({});

    (handlerStubs as $TSFixMe).handleCertificationScoring
    .withArgs({ event: assessmentCompleted, domainTransaction })
    .resolves(certificationScoringCompleted);

    // when
    await eventDispatcher.dispatch(certificationScoringCompleted);

    // then
expect((handlerStubs as $TSFixMe).handlePixPlusEdu1erDegreCertificationsScoring).to.have.been.calledWith({
    event: certificationScoringCompleted,
    domainTransaction: undefined,
});
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('chains Certification Rescoring and Pix+ Édu 1er degre Certification Rescoring on Certification Rescoring Completed', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();

    const domainTransaction = Symbol('a transaction');
    const assessmentCompleted = new AssessmentCompleted();
    const certificationRescoringCompleted = new CertificationRescoringCompleted({});

    (handlerStubs as $TSFixMe).handleCertificationRescoring
    .withArgs({ event: assessmentCompleted, domainTransaction })
    .resolves(certificationRescoringCompleted);

    // when
    await eventDispatcher.dispatch(certificationRescoringCompleted);

    // then
expect((handlerStubs as $TSFixMe).handlePixPlusEdu1erDegreCertificationsScoring).to.have.been.calledWith({
    event: certificationRescoringCompleted,
    domainTransaction: undefined,
});
  });
});
