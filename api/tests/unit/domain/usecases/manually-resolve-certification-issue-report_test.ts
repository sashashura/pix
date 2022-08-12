// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const manuallyResolveCertificationIssueReport = require('../../../../lib/domain/usecases/manually-resolve-certification-issue-report');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportAutomaticallyResolvedShouldNotBeUpdatedManually,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | manually-resolve-certification-issue-report', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when certification issue report is not resolved', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve and save certification issue report', async function () {
      // given
      const certificationIssueReportRepository = {
        get: sinon.stub(),
        save: sinon.stub(),
      };
      const resolution = 'issue solved';
      const certificationIssueReportId = 1;
      const expectedCertificationIssueReport = domainBuilder.buildCertificationIssueReport({
        hasBeenAutomaticallyResolved: null,
      });
      sinon.spy(expectedCertificationIssueReport, 'resolveManually');
      certificationIssueReportRepository.get.resolves(expectedCertificationIssueReport);
      certificationIssueReportRepository.save.resolves();

      // when
      await manuallyResolveCertificationIssueReport({
        resolution,
        certificationIssueReportRepository,
        certificationIssueReportId,
      });

      // then
      expect(certificationIssueReportRepository.get).to.have.been.called;
      expect(certificationIssueReportRepository.save).to.have.been.calledWith(expectedCertificationIssueReport);
      expect(expectedCertificationIssueReport.resolveManually).to.have.been.calledWith(resolution);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('when certification issue report is resolved', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when certification issue report is resolved manually', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update certification issue report', async function () {
        // given
        const certificationIssueReportRepository = {
          get: sinon.stub(),
          save: sinon.stub(),
        };
        const resolution = 'issue solved';
        const certificationIssueReportId = 1;
        const expectedCertificationIssueReport = domainBuilder.buildCertificationIssueReport({
          hasBeenAutomaticallyResolved: false,
        });
        certificationIssueReportRepository.get.resolves(expectedCertificationIssueReport);
        certificationIssueReportRepository.save.resolves();

        // when
        await manuallyResolveCertificationIssueReport({
          resolution,
          certificationIssueReportRepository,
          certificationIssueReportId,
        });

        // then
        expect(certificationIssueReportRepository.save).to.have.been.calledWith(expectedCertificationIssueReport);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when certification issue report is resolved automatically', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a CertificationIssueReportAutomaticallyResolvedShouldNotBeUpdatedManually error', async function () {
        // given
        const certificationIssueReportRepository = {
          get: sinon.stub(),
          save: sinon.stub(),
        };
        const resolution = 'issue solved';
        const certificationIssueReportId = 1;
        const expectedCertificationIssueReport = domainBuilder.buildCertificationIssueReport({
          hasBeenAutomaticallyResolved: true,
        });
        certificationIssueReportRepository.get.resolves(expectedCertificationIssueReport);
        certificationIssueReportRepository.save.resolves();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(manuallyResolveCertificationIssueReport)({
          resolution,
          certificationIssueReportRepository,
          certificationIssueReportId,
        });

        // then
        expect(error).to.be.instanceOf(CertificationIssueReportAutomaticallyResolvedShouldNotBeUpdatedManually);
      });
    });
  });
});
