// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationIssueReportController = require('../../../../lib/application/certification-issue-reports/certification-issue-report-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | certification-issue-report-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deleteCertificationIssueReport', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should proceed to deletion', async function () {
      // given
      const certificationIssueReportId = 456;
      const userId = 789;
      sinon.stub(usecases, 'deleteCertificationIssueReport');

      // when
      const response = await certificationIssueReportController.deleteCertificationIssueReport(
        {
          params: {
            id: certificationIssueReportId,
          },
          auth: {
            credentials: { userId },
          },
        },
        hFake
      );

      // then
      expect(response).to.be.null;
      expect(usecases.deleteCertificationIssueReport).to.have.been.calledWith({ certificationIssueReportId });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#manuallyResolve', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve certification issue report', async function () {
      // given
      const request = {
        params: {
          id: 100,
        },
        payload: {
          data: {
            resolution: 'resolved',
          },
        },
      };
      const manuallyResolveCertificationIssueReportStub = sinon.stub(
        usecases,
        'manuallyResolveCertificationIssueReport'
      );
      manuallyResolveCertificationIssueReportStub.resolves();

      // when
      const response = await certificationIssueReportController.manuallyResolve(request, hFake);

      // then
      expect(response.statusCode).to.deep.equal(204);
      expect(manuallyResolveCertificationIssueReportStub).has.been.calledOnceWith({
        certificationIssueReportId: 100,
        resolution: 'resolved',
      });
    });
  });
});
