// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'catchErr'.
const { catchErr, expect, domainBuilder, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const handleFinalizedSession = require('../../../../lib/domain/events/handle-session-finalized');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertificationSummary = require('../../../../lib/domain/read-models/JuryCertificationSummary');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const { status: assessmentResultStatuses } = require('../../../../lib/domain/models/AssessmentResult');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AutoJuryDo... Remove this comment to see the full error message
const AutoJuryDone = require('../../../../lib/domain/events/AutoJuryDone');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FinalizedS... Remove this comment to see the full error message
const FinalizedSession = require('../../../../lib/domain/models/FinalizedSession');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'juryCertif... Remove this comment to see the full error message
const juryCertificationSummaryRepository = { findBySessionId: sinon.stub() };
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'finalizedS... Remove this comment to see the full error message
const finalizedSessionRepository = { save: sinon.stub() };
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'supervisor... Remove this comment to see the full error message
const supervisorAccessRepository = { sessionHasSupervisorAccess: sinon.stub() };
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dependenci... Remove this comment to see the full error message
const dependencies = {
  juryCertificationSummaryRepository,
  finalizedSessionRepository,
  supervisorAccessRepository,
};

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Events | handle-session-finalized', function () {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('fails when event is not of correct type', async function () {
    // given
    const event = 'not an event of the correct type';

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(handleFinalizedSession)({ event, ...dependencies });

    // then
    expect(error).not.to.be.null;
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('saves a finalized session', async function () {
    // given
    const event = new AutoJuryDone({
      sessionId: 1234,
      finalizedAt: new Date(),
      hasExaminerGlobalComment: false,
      certificationCenterName: 'A certification center name',
      sessionDate: '2021-01-29',
      sessionTime: '14:00',
    });
    const juryCertificationSummary = new JuryCertificationSummary({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      status: assessmentResultStatuses.VALIDATED,
      pixScore: 120,
      createdAt: new Date(),
      completedAt: new Date(),
      isPublished: false,
      hasSeenEndTestScreen: true,
      cleaCertificationStatus: 'not_passed',
      certificationIssueReports: [
        domainBuilder.buildCertificationIssueReport({
          category: CertificationIssueReportCategories.LATE_OR_LEAVING,
          subcategory: CertificationIssueReportSubcategories.SIGNATURE_ISSUE,
        }),
      ],
    });
    juryCertificationSummaryRepository.findBySessionId.withArgs(1234).resolves([juryCertificationSummary]);
    finalizedSessionRepository.save.resolves();
    supervisorAccessRepository.sessionHasSupervisorAccess.resolves(true);
    const finalizedSessionFromSpy = sinon.spy(FinalizedSession, 'from');

    // when
    await handleFinalizedSession({ event, ...dependencies });

    // then
    expect(supervisorAccessRepository.sessionHasSupervisorAccess).to.have.been.calledOnceWithExactly({
      sessionId: 1234,
    });
    expect(finalizedSessionFromSpy).to.have.been.calledOnceWithExactly({
      sessionId: event.sessionId,
      finalizedAt: event.finalizedAt,
      certificationCenterName: event.certificationCenterName,
      sessionDate: event.sessionDate,
      sessionTime: event.sessionTime,
      hasExaminerGlobalComment: false,
      hasSupervisorAccess: true,
      juryCertificationSummaries: [juryCertificationSummary],
    });
    expect(finalizedSessionRepository.save).to.have.been.calledWithExactly(
      new FinalizedSession({
        sessionId: event.sessionId,
        finalizedAt: event.finalizedAt,
        certificationCenterName: event.certificationCenterName,
        sessionDate: event.sessionDate,
        sessionTime: event.sessionTime,
        isPublishable: true,
        hasSupervisorAccess: true,
        publishedAt: null,
      })
    );
  });
});
