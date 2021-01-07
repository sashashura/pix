const { expect } = require('../../../../test-helper');
const CertificationIssueReport = require('../../../../../lib/domain/models/certification-issue-report/CertificationIssueReport');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('../../../../../lib/domain/models/certification-issue-report/CertificationIssueReportCategory');
const { InvalidCertificationIssueReportForSaving } = require('../../../../../lib/domain/errors');

const MISSING_VALUE = null;
const EMPTY_VALUE = '';
const WHITESPACES_VALUE = '  ';
const UNDEFINED_VALUE = undefined;

describe('Unit | Domain | Models | CertificationIssueReport', () => {

  describe('#new', () => {

    context('CATEGORY: IN_CHALLENGE', () => {
      const certificationIssueReportDTO = {
        certificationCourseId: 123,
        category: CertificationIssueReportCategories.IN_CHALLENGE,
        subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
        questionNumber: 5,
      };

      it('should create an IN_CHALLENGE CertificationIssueReport', () => {
        expect(CertificationIssueReport.new(certificationIssueReportDTO))
          .to.be.an.instanceOf(CertificationIssueReport);
      });

      // Test dynamically all subcategories
      [...Object.values(CertificationIssueReportSubcategories)].forEach((subcategory) => {
        if ([
          CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
          CertificationIssueReportSubcategories.LINK_NOT_WORKING,
          CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
          CertificationIssueReportSubcategories.FILE_NOT_OPENING,
          CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
          CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
          CertificationIssueReportSubcategories.OTHER,
        ].includes(subcategory)) {
          it(`should create an IN_CHALLENGE CertificationIssueReport when subcategory is of value ${subcategory}`, () => {
            // when
            expect(CertificationIssueReport.new({ ...certificationIssueReportDTO, subcategory, description: subcategory === CertificationIssueReportSubcategories.OTHER ? 'salut' : null }))
              .to.be.an.instanceOf(CertificationIssueReport);
          });
        } else {
          it(`should throw an InvalidCertificationIssueReportForSaving when subcategory is ${subcategory}`, () => {
            // when
            expect(() => CertificationIssueReport.new({ ...certificationIssueReportDTO, subcategory }))
              .to.throw(InvalidCertificationIssueReportForSaving);
          });
        }
      });

      [
        CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
        CertificationIssueReportSubcategories.LINK_NOT_WORKING,
        CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
        CertificationIssueReportSubcategories.FILE_NOT_OPENING,
        CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
        CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
      ].forEach((subcategory) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when description is not empty for subcategory ${subcategory}`, () => {
          // when
          expect(() => CertificationIssueReport.new({
            ...certificationIssueReportDTO,
            subcategory,
            description: 'Salut',
          }))
            .to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      it('should throw an InvalidCertificationIssueReportForSaving when description is empty for subcategory OTHER', () => {
        // when
        expect(() => CertificationIssueReport.new({ ...certificationIssueReportDTO, subcategory: CertificationIssueReportSubcategories.OTHER }))
          .to.throw(InvalidCertificationIssueReportForSaving);
      });

      [
        MISSING_VALUE,
        EMPTY_VALUE,
        UNDEFINED_VALUE,
      ].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when questionNumber is empty with value ${emptyValue}`, () => {
          // when
          expect(() => CertificationIssueReport.new({ ...certificationIssueReportDTO, questionNumber: emptyValue }))
            .to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      it('should throw an InvalidCertificationIssueReportForSaving when questionNumber is over 500', () => {
        // when
        expect(() => CertificationIssueReport.new({ ...certificationIssueReportDTO, questionNumber: 501 }))
          .to.throw(InvalidCertificationIssueReportForSaving);
      });

      it('should throw an InvalidCertificationIssueReportForSaving when questionNumber is under 1', () => {
        // when
        expect(() => CertificationIssueReport.new({ ...certificationIssueReportDTO, questionNumber: 0 }))
          .to.throw(InvalidCertificationIssueReportForSaving);
      });
    });
  });
});
