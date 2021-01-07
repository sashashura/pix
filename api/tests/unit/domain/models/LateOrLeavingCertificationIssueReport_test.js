const { expect } = require('../../../test-helper');

const LateOrLeavingCertificationIssueReport = require('../../../../lib/domain/models/LateOrLeavingCertificationIssueReport');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('./../../../../lib/domain/models/CertificationIssueReportCategory');

describe('Unit | Domain | Models | LateOrLeavingCertificationIssueReport', () => {

  it('throws when courseId is undefined', async () => {
    expect(() => new LateOrLeavingCertificationIssueReport({
      certificationCourseId: undefined,
    })).to.throw();
  });

  it('throws when subcategory is missing', async () => {
    expect(() => new LateOrLeavingCertificationIssueReport({
      certificationCourseId: 42,
      subcategory: undefined,
      description: 'toto',
    })).to.throw();
  });

  it('throws when description is missing', async () => {
    expect(() => new LateOrLeavingCertificationIssueReport({
      certificationCourseId: 42,
      subcategory: CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
      description: undefined,
    })).to.throw();
  });

  it('instanciate a "late or leaving" issue report', async () => {
    expect(() => new LateOrLeavingCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
      subcategory: CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
    })).not.to.throw();
  });

  it('has the "late or leaving" category', async () => {
    // when
    const certificationIssueReport = new LateOrLeavingCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
      subcategory: CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
    });
    // then
    expect(certificationIssueReport.category).to.equal(CertificationIssueReportCategories.LATE_OR_LEAVING);
  });

  it('has the right subcategory', async () => {
    // when
    const certificationIssueReport = new LateOrLeavingCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
      subcategory: CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
    });
    // then
    expect(certificationIssueReport.subcategory).to.equal(CertificationIssueReportSubcategories.LEFT_EXAM_ROOM);
  });

});
