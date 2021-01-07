const { expect } = require('../../../test-helper');

const CertificationIssueReportFactory = require('../../../../lib/domain/models/CertificatitonIssueReportFactory');
const { CertificationIssueReportCategories } = require('../../../../lib/domain/models/CertificationIssueReportCategory');
const ConnectionOrEndScreenCertificationIssueReport = require('../../../../lib/domain/models/ConnectionOrEndScreenCertificationIssueReport');
const FraudCertificationIssueReport = require('../../../../lib/domain/models/FraudCertificationIssueReport');

describe('Unit | Domain | Models | CertificationIssueReportFactory', () => {
  it('should build a "connection or end screen" issue report', () => {
    // given
    const certificationIssueReportDTO = {
      category: CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN,
      certificationCourseId: 42,
    };

    // when
    const certificationIssueReport = CertificationIssueReportFactory.create(certificationIssueReportDTO);
    // then
    expect(certificationIssueReport).to.be.an.instanceOf(ConnectionOrEndScreenCertificationIssueReport);
  });

  it('should build a "fraud" issue report', () => {
    // given
    const certificationIssueReportDTO = {
      category: CertificationIssueReportCategories.FRAUD,
      certificationCourseId: 42,
    };

    // when
    const certificationIssueReport = CertificationIssueReportFactory.create(certificationIssueReportDTO);
    // then
    expect(certificationIssueReport).to.be.an.instanceOf(FraudCertificationIssueReport);
  });

});

