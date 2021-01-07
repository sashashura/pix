const { expect } = require('../../../test-helper');

const ConnectionOrEndScreenCertificationIssueReport = require('../../../../lib/domain/models/ConnectionOrEndScreenCertificationIssueReport');
const { CertificationIssueReportCategories } = require('./../../../../lib/domain/models/CertificationIssueReportCategory');

describe('Unit | Domain | Models | ConnectionOrEndScreenCertificationIssueReport', () => {

  it('throws when courseId is undefined', async () => {
    expect(() => new ConnectionOrEndScreenCertificationIssueReport({
      certificationCourseId: undefined,
    })).to.throw();
  });

  it('instanciate a "connection or end screen" issue report', async () => {
    expect(() => new ConnectionOrEndScreenCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
    })).not.to.throw();
  });

  it('has the "connection or end screen" category', async () => {
    // when
    const certificationIssueReport = new ConnectionOrEndScreenCertificationIssueReport({
      certificationCourseId: 42,
    });
    // then
    expect(certificationIssueReport.category).to.equal(CertificationIssueReportCategories.CONNECTION_OR_END_SCREEN);
  });

});
