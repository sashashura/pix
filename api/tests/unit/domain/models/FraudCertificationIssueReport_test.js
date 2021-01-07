const { expect } = require('../../../test-helper');

const FraudCertificationIssueReport = require('../../../../lib/domain/models/FraudCertificationIssueReport');
const { CertificationIssueReportCategories } = require('./../../../../lib/domain/models/CertificationIssueReportCategory');

describe('Unit | Domain | Models | FraudCertificationIssueReport', () => {

  it('throws when courseId is undefined', async () => {
    expect(() => new FraudCertificationIssueReport({
      certificationCourseId: undefined,
    })).to.throw();
  });

  it('instanciate a "fraud" issue report', async () => {
    expect(() => new FraudCertificationIssueReport({
      certificationCourseId: 42,
    })).not.to.throw();
  });

  it('has the "fraud" category', async () => {
    // when
    const certificationIssueReport = new FraudCertificationIssueReport({
      certificationCourseId: 42,
    });
    // then
    expect(certificationIssueReport.category).to.equal(CertificationIssueReportCategories.FRAUD);
  });

});
