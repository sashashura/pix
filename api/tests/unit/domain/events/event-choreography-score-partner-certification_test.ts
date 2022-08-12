// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildEvent... Remove this comment to see the full error message
const buildEventDispatcherAndHandlersForTest = require('../../../tooling/events/event-dispatcher-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationScoringCompleted = require('../../../../lib/domain/events/CertificationScoringCompleted');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Event Choreography | Score Partner Certification', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('chains Certification Scoring and Partner Certification Scoring on Assessment Completed', async function () {
    // given
    const { handlerStubs, eventDispatcher } = buildEventDispatcherAndHandlersForTest();

    const domainTransaction = Symbol('a transaction');

    const assessmentCompleted = new AssessmentCompleted();
    const certificationScoringCompleted = new CertificationScoringCompleted({});

    (handlerStubs as $TSFixMe).handleCertificationScoring
    .withArgs({ domainTransaction, event: assessmentCompleted })
    .resolves(certificationScoringCompleted);

    // when
    await eventDispatcher.dispatch(assessmentCompleted, domainTransaction);

    // then
expect((handlerStubs as $TSFixMe).handleCleaCertificationScoring).to.have.been.calledWith({
    domainTransaction,
    event: certificationScoringCompleted,
});
  });
});
