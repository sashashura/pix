const { expect } = require('../../../test-helper');

const CertificationIssueReportFactory = require('../../../../lib/domain/models/CertificatitonIssueReportFactory');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('../../../../lib/domain/models/CertificationIssueReportCategory');
const ConnectionOrEndScreenCertificationIssueReport = require('../../../../lib/domain/models/ConnectionOrEndScreenCertificationIssueReport');
const FraudCertificationIssueReport = require('../../../../lib/domain/models/FraudCertificationIssueReport');
const OtherCertificationIssueReport = require('../../../../lib/domain/models/OtherCertificationIssueReport');
const LateOrLeavingCertificationIssueReport = require('../../../../lib/domain/models/LateOrLeavingCertificationIssueReport');
const CandidateInformationChangesCertificationIssueReport = require('../../../../lib/domain/models/CandidateInformationChangesCertificationIssueReport');

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

  it('should build an "other" issue report', () => {
    // given
    const certificationIssueReportDTO = {
      category: CertificationIssueReportCategories.OTHER,
      certificationCourseId: 42,
    };

    // when
    const certificationIssueReport = CertificationIssueReportFactory.create(certificationIssueReportDTO);
    // then
    expect(certificationIssueReport).to.be.an.instanceOf(OtherCertificationIssueReport);
  });

  it('should build an "late or leaving" issue report', () => {
    // given
    const certificationIssueReportDTO = {
      category: CertificationIssueReportCategories.LATE_OR_LEAVING,
      certificationCourseId: 42,
      description: 'une description',
      subcategory: CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
    };

    // when
    const certificationIssueReport = CertificationIssueReportFactory.create(certificationIssueReportDTO);
    // then
    expect(certificationIssueReport).to.be.an.instanceOf(LateOrLeavingCertificationIssueReport);
  });

  it('should build an "candidate information changes" issue report', () => {
    // given
    const certificationIssueReportDTO = {
      category: CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES,
      certificationCourseId: 42,
      description: 'une description',
      subcategory: CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
    };

    // when
    const certificationIssueReport = CertificationIssueReportFactory.create(certificationIssueReportDTO);
    // then
    expect(certificationIssueReport).to.be.an.instanceOf(CandidateInformationChangesCertificationIssueReport);
  });

});

