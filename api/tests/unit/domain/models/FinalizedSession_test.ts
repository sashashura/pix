// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FinalizedS... Remove this comment to see the full error message
const FinalizedSession = require('../../../../lib/domain/models/FinalizedSession');
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

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | FinalizedSession', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isPublishable', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is not publishable when session has an examiner global comment', function () {
      // given / when
      const finalizedSession = FinalizedSession.from({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: true,
        juryCertificationSummaries: _noneWithRequiredActionNorError(),
        hasSupervisorAccess: false,
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
      });
      // then
      expect(finalizedSession.isPublishable).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is publishable when session has no global comment, no started or error status, no issue report requiring action and supervisor was used', function () {
      // given / when
      const finalizedSession = FinalizedSession.from({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _noneWithRequiredActionNorError(),
        hasSupervisorAccess: true,
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
      });

      // then
      expect(finalizedSession.isPublishable).to.be.true;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when supervisor portal was used', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('is publishable even if a test end screen has not been seen', function () {
        // when
        const finalizedSession = FinalizedSession.from({
          sessionId: 1234,
          certificationCenterName: 'a certification center',
          sessionDate: '2021-01-29',
          sessionTime: '16:00',
          hasExaminerGlobalComment: false,
          juryCertificationSummaries: _noneWithRequiredActionNorErrorButEndScreenNotSeen(),
          hasSupervisorAccess: true,
          finalizedAt: new Date('2020-01-01T00:00:00Z'),
        });

        // then
        expect(finalizedSession.isPublishable).to.be.true;
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('is not publishable if a test is not finished yet has no abort reason', function () {
        // when
        const finalizedSession = FinalizedSession.from({
          sessionId: 1234,
          certificationCenterName: 'a certification center',
          sessionDate: '2021-01-29',
          sessionTime: '16:00',
          hasExaminerGlobalComment: false,
          juryCertificationSummaries: _someWhichAreUnfinishedButHaveNoAbortReason(),
          hasSupervisorAccess: true,
          finalizedAt: new Date('2020-01-01T00:00:00Z'),
        });

        // then
        expect(finalizedSession.isPublishable).to.be.false;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when supervisor portal was not used', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('is not publishable when at least one test end screen has not been seen', function () {
        // given / when
        const finalizedSession = FinalizedSession.from({
          sessionId: 1234,
          certificationCenterName: 'a certification center',
          sessionDate: '2021-01-29',
          sessionTime: '16:00',
          hasExaminerGlobalComment: false,
          juryCertificationSummaries: _noneWithRequiredActionNorErrorButEndScreenNotSeen(),
          hasSupervisorAccess: false,
          finalizedAt: new Date('2020-01-01T00:00:00Z'),
        });

        // then
        expect(finalizedSession.isPublishable).to.be.false;
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is not publishable when has at least one unresolved issue report that requires action', function () {
      // given / when
      const finalizedSession = FinalizedSession.from({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _someWithUnresolvedRequiredActionButNoErrorOrStartedStatus(),
        hasSupervisorAccess: false,
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
      });
      // then
      expect(finalizedSession.isPublishable).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is not publishable when at least one scoring error occurred', function () {
      // given / when
      const finalizedSession = FinalizedSession.from({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _noneWithRequiredActionButSomeErrorStatus(),
        hasSupervisorAccess: false,
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
      });

      // then
      expect(finalizedSession.isPublishable).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is not publishable when at least one assessment has not been completed', function () {
      // given / when
      const finalizedSession = FinalizedSession.from({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _noneWithRequiredActionButSomeStartedStatus(),
        hasSupervisorAccess: false,
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
      });

      // then
      expect(finalizedSession.isPublishable).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is publishable when session has no global comment, no started or error status, no issue report requiring action and all end screen seen', function () {
      // given / when
      const finalizedSession = FinalizedSession.from({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _noneWithRequiredActionNorError(),
        hasSupervisorAccess: false,
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
      });

      // then
      expect(finalizedSession.isPublishable).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('is publishable when has no unresolved issue reports that requires action', function () {
      // given / when
      const finalizedSession = FinalizedSession.from({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _someWithResolvedRequiredActionButNoErrorOrStartedStatus(),
        hasSupervisorAccess: false,
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
      });
      // then
      expect(finalizedSession.isPublishable).to.be.true;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#assignCertificationOfficer', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Assigns certification officer and make the session not publishable', function () {
      // given / when
      const certificationOfficerName = 'Ruppert Giles';
      const finalizedSession = new FinalizedSession({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _noneWithRequiredActionNorError(),
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
        isPublishable: true,
        publishedAt: null,
        assignedCertificationOfficerName: null,
      });

      finalizedSession.assignCertificationOfficer({ certificationOfficerName });

      // then
      expect(finalizedSession.isPublishable).to.be.false;
      expect(finalizedSession.assignedCertificationOfficerName).to.equal(certificationOfficerName);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#publish', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('publishes the session', function () {
      // given
      const now = new Date();
      const session = new FinalizedSession({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _noneWithRequiredActionNorError(),
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
        isPublishable: true,
        publishedAt: null,
        assignedCertificationOfficerName: null,
      });

      // when
      session.publish(now);

      // then
      expect(session.publishedAt).to.equal(now);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#unpublish', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('unpublishes the session', function () {
      const session = new FinalizedSession({
        sessionId: 1234,
        certificationCenterName: 'a certification center',
        sessionDate: '2021-01-29',
        sessionTime: '16:00',
        hasExaminerGlobalComment: false,
        juryCertificationSummaries: _noneWithRequiredActionNorError(),
        finalizedAt: new Date('2020-01-01T00:00:00Z'),
        isPublishable: true,
        publishedAt: new Date(),
        assignedCertificationOfficerName: null,
      });

      // when
      session.unpublish();

      // then
      expect(session.publishedAt).to.be.null;
    });
  });
});

function _noneWithRequiredActionNorError() {
  return [
    new JuryCertificationSummary({
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
    }),
  ];
}

function _noneWithRequiredActionNorErrorButEndScreenNotSeen() {
  return [
    new JuryCertificationSummary({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      status: assessmentResultStatuses.VALIDATED,
      pixScore: 120,
      createdAt: new Date(),
      completedAt: new Date(),
      isPublished: false,
      hasSeenEndTestScreen: false,
      cleaCertificationStatus: 'not_passed',
      certificationIssueReports: [
        domainBuilder.buildCertificationIssueReport({
          category: CertificationIssueReportCategories.LATE_OR_LEAVING,
          subcategory: CertificationIssueReportSubcategories.SIGNATURE_ISSUE,
        }),
      ],
    }),
    new JuryCertificationSummary({
      id: 2,
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
    }),
  ];
}

function _noneWithRequiredActionButSomeErrorStatus() {
  return [
    new JuryCertificationSummary({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      status: assessmentResultStatuses.ERROR,
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
    }),
  ];
}

function _noneWithRequiredActionButSomeStartedStatus() {
  return [
    new JuryCertificationSummary({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      status: 'started',
      pixScore: 120,
      createdAt: new Date(),
      completedAt: null,
      isPublished: false,
      hasSeenEndTestScreen: true,
      cleaCertificationStatus: 'not_passed',
      certificationIssueReports: [
        domainBuilder.buildCertificationIssueReport({
          category: CertificationIssueReportCategories.LATE_OR_LEAVING,
          subcategory: CertificationIssueReportSubcategories.SIGNATURE_ISSUE,
        }),
      ],
    }),
  ];
}

function _someWithUnresolvedRequiredActionButNoErrorOrStartedStatus() {
  return [
    new JuryCertificationSummary({
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
          category: CertificationIssueReportCategories.FRAUD,
          resolvedAt: null,
          resolution: null,
        }),
      ],
    }),
  ];
}

function _someWithResolvedRequiredActionButNoErrorOrStartedStatus() {
  return [
    new JuryCertificationSummary({
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
          category: CertificationIssueReportCategories.FRAUD,
          resolvedAt: new Date('2020-01-01'),
          resolution: 'des points gratos offerts',
        }),
      ],
    }),
  ];
}

function _someWhichAreUnfinishedButHaveNoAbortReason() {
  return [
    new JuryCertificationSummary({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      status: 'started',
      pixScore: 120,
      createdAt: new Date(),
      completedAt: null,
      isPublished: false,
      abortReason: null,
      cleaCertificationStatus: 'not_passed',
      certificationIssueReports: [
        domainBuilder.buildCertificationIssueReport({
          category: CertificationIssueReportCategories.FRAUD,
          resolvedAt: new Date('2020-01-01'),
          resolution: 'des points gratos offerts',
        }),
      ],
    }),
  ];
}
