const { expect } = require('../../../test-helper');

const CandidateInformationChangesCertificationIssueReport = require('../../../../lib/domain/models/CandidateInformationChangesCertificationIssueReport');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('./../../../../lib/domain/models/CertificationIssueReportCategory');

describe('Unit | Domain | Models | CandidateInformationChangesCertificationIssueReport', () => {

  it('throws when courseId is undefined', async () => {
    expect(() => new CandidateInformationChangesCertificationIssueReport({
      certificationCourseId: undefined,
    })).to.throw();
  });

  it('throws when subcategory is missing', async () => {
    expect(() => new CandidateInformationChangesCertificationIssueReport({
      certificationCourseId: 42,
      subcategory: undefined,
      description: 'toto',
    })).to.throw();
  });

  it('throws when description is missing', async () => {
    expect(() => new CandidateInformationChangesCertificationIssueReport({
      certificationCourseId: 42,
      subcategory: CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
      description: undefined,
    })).to.throw();
  });

  it('instanciate a "candidate information changes" issue report', async () => {
    expect(() => new CandidateInformationChangesCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
      subcategory: CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
    })).not.to.throw();
  });

  it('has the "candidate information changes" category', async () => {
    // when
    const certificationIssueReport = new CandidateInformationChangesCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
      subcategory: CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
    });
    // then
    expect(certificationIssueReport.category).to.equal(CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES);
  });

  it('has the right subcategory', async () => {
    // when
    const certificationIssueReport = new CandidateInformationChangesCertificationIssueReport({
      certificationCourseId: 42,
      description: 'toto',
      subcategory: CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
    });
    // then
    expect(certificationIssueReport.subcategory).to.equal(CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE);
  });

});
