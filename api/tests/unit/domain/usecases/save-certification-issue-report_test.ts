// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const saveCertificationIssueReport = require('../../../../lib/domain/usecases/save-certification-issue-report');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | save-certification-issue-report', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveCertificationIssueReport', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the certification issue report', async function () {
      // given
      const certificationIssueReportRepository = { save: sinon.stub() };
      const sessionId = 1;
      const aCertificationCourse = domainBuilder.buildCertificationCourse({ sessionId });
      const certificationIssueReportDTO = {
        certificationCourseId: aCertificationCourse.getId(),
        category: CertificationIssueReportCategories.FRAUD,
        description: 'une description',
      };
      const expectedCertificationIssueReport = new CertificationIssueReport(certificationIssueReportDTO);
      certificationIssueReportRepository.save.resolves(expectedCertificationIssueReport);

      // when
      const certifIssueReportResult = await saveCertificationIssueReport({
        certificationIssueReportDTO,
        certificationIssueReportRepository,
      });

      // then
      expect(certifIssueReportResult).to.deep.equal(expectedCertificationIssueReport);
    });
  });
});
