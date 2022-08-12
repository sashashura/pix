// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const deleteCertificationIssueReport = require('../../../../lib/domain/usecases/delete-certification-issue-report');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | delete-certification-issue-report', function () {
  const certificationCourseRepository = { get: () => _.noop() };
  const certificationIssueReportRepository = {
    delete: () => _.noop(),
    get: () => _.noop(),
  };
  const sessionRepository = { isFinalized: () => _.noop() };
  const sessionAuthorizationService = { isAuthorizedToAccessSession: () => _.noop() };
  const certificationIssueReportId = 456;
  const userId = 789;
  const sessionId = 159;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    const certificationIssueReport = domainBuilder.buildCertificationIssueReport({ id: certificationIssueReportId });
    const certificationCourse = domainBuilder.buildCertificationCourse({
      id: certificationIssueReport.certificationCourseId,
      sessionId,
    });
    sinon.stub(certificationCourseRepository, 'get');
    (certificationCourseRepository.get as $TSFixMe).withArgs(certificationIssueReport.certificationCourseId)
    .resolves(certificationCourse);
    sinon.stub(certificationIssueReportRepository, 'delete');
    sinon.stub(certificationIssueReportRepository, 'get');
    (certificationIssueReportRepository.get as $TSFixMe).withArgs(certificationIssueReportId).resolves(certificationIssueReport);
    sinon.stub(sessionRepository, 'isFinalized');
    sinon.stub(sessionAuthorizationService, 'isAuthorizedToAccessSession');
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw a ForbiddenAccess error when session is already finalized', async function () {
    // given
(sessionAuthorizationService.isAuthorizedToAccessSession as $TSFixMe).withArgs({ userId, sessionId }).resolves(true);
    (sessionRepository.isFinalized as $TSFixMe).withArgs(sessionId).resolves(true);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(deleteCertificationIssueReport)({
      certificationIssueReportId,
      userId,
      certificationCourseRepository,
      certificationIssueReportRepository,
      sessionRepository,
      sessionAuthorizationService,
    });

    // then
    expect(error).to.be.instanceOf(ForbiddenAccess);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return deletion result', async function () {
    // given
    const deletionResult = Symbol('someValue');
    (sessionAuthorizationService.isAuthorizedToAccessSession as $TSFixMe).withArgs({ userId, sessionId }).resolves(true);
    (sessionRepository.isFinalized as $TSFixMe).withArgs(sessionId).resolves(false);
    (certificationIssueReportRepository.delete as $TSFixMe).withArgs(certificationIssueReportId).resolves(deletionResult);

    // when
    const actualDeletionResult = await deleteCertificationIssueReport({
      certificationIssueReportId,
      userId,
      certificationCourseRepository,
      certificationIssueReportRepository,
      sessionRepository,
      sessionAuthorizationService,
    });

    // then
    expect(actualDeletionResult).to.equal(deletionResult);
  });
});
