const { expect } = require('../../../test-helper');

const OtherCertificationIssueReport = require('../../../../lib/domain/models/OtherCertificationIssueReport');
const { CertificationIssueReportCategories } = require('./../../../../lib/domain/models/CertificationIssueReportCategory');

describe('Unit | Domain | Models | OtherCertificationIssueReport', () => {

  it('throws when courseId is undefined', async () => {
    expect(() => new OtherCertificationIssueReport({
      certificationCourseId: undefined,
    })).to.throw();
  });

  it('instanciate an "other" issue report', async () => {
    expect(() => new OtherCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
    })).not.to.throw();
  });

  it('has the "other" category', async () => {
    // when
    const certificationIssueReport = new OtherCertificationIssueReport({
      certificationCourseId: 42,
    });
    // then
    expect(certificationIssueReport.category).to.equal(CertificationIssueReportCategories.OTHER);
  });

});
