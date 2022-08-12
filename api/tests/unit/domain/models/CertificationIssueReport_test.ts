// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
  InvalidCertificationIssueReportForSaving,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Deprecated... Remove this comment to see the full error message
  DeprecatedCertificationIssueReportSubcategoryError,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Deprecated... Remove this comment to see the full error message
  DeprecatedCertificationIssueReportCategoryError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MISSING_VA... Remove this comment to see the full error message
const MISSING_VALUE = null;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EMPTY_VALU... Remove this comment to see the full error message
const EMPTY_VALUE = '';
const WHITESPACES_VALUE = '  ';
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UNDEFINED_... Remove this comment to see the full error message
const UNDEFINED_VALUE = undefined;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationIssueReport', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#create', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('CATEGORY: NON_BLOCKING_TECHNICAL_ISSUE', function () {
      let certificationIssueReportDTO: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.NON_BLOCKING_TECHNICAL_ISSUE,
          description: 'Une description obligatoire',
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a NON_BLOCKING_TECHNICAL_ISSUE CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should create a NON_BLOCKING_TECHNICAL_ISSUE CertificationIssueReport when subcategory is empty with value ${emptyValue}`, function () {
          // when
          expect(
            CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory: emptyValue })
          ).to.be.an.instanceOf(CertificationIssueReport);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('CATEGORY: NON_BLOCKING_CANDIDATE_ISSUE', function () {
      let certificationIssueReportDTO: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.NON_BLOCKING_CANDIDATE_ISSUE,
          description: 'Une description obligatoire',
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a NON_BLOCKING_CANDIDATE_ISSUE CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value "${emptyValue}"`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should create a NON_BLOCKING_CANDIDATE_ISSUE CertificationIssueReport when subcategory is empty with value "${emptyValue}"`, function () {
          // when
          expect(
            CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory: emptyValue })
          ).to.be.an.instanceOf(CertificationIssueReport);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('CATEGORY: LATE_OR_LEAVING', function () {
      let certificationIssueReportDTO: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.LATE_OR_LEAVING,
          description: 'Une description obligatoire',
          subcategory: CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a LATE_OR_LEAVING CertificationIssueReport of category', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // Test dynamically all subcategories
      // eslint-disable-next-line mocha/no-setup-in-describe
      [...Object.values(CertificationIssueReportSubcategories)].forEach((subcategory) => {
        if (
          [
            CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
            CertificationIssueReportSubcategories.SIGNATURE_ISSUE,
          ].includes(subcategory)
        ) {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should create a LATE_OR_LEAVING CertificationIssueReport when subcategory is of value ${subcategory}`, function () {
            // when
            expect(
              CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })
            ).to.be.an.instanceOf(CertificationIssueReport);
          });
        } else {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should throw an InvalidCertificationIssueReportForSaving when subcategory is ${subcategory}`, function () {
            // when
            expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })).to.throw(
              InvalidCertificationIssueReportForSaving
            );
          });
        }
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('CATEGORY: CANDIDATE_INFORMATIONS_CHANGES', function () {
      let certificationIssueReportDTO: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES,
          description: 'Une description obligatoire',
          subcategory: CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create a CANDIDATE_INFORMATIONS_CHANGES CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // Test dynamically all subcategories
      // eslint-disable-next-line mocha/no-setup-in-describe
      [...Object.values(CertificationIssueReportSubcategories)].forEach((subcategory) => {
        if (
          [
            CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
            CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
          ].includes(subcategory)
        ) {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should create a CANDIDATE_INFORMATIONS_CHANGES CertificationIssueReport when subcategory is of value ${subcategory}`, function () {
            // when
            expect(
              CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })
            ).to.be.an.instanceOf(CertificationIssueReport);
          });
        } else {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should throw an InvalidCertificationIssueReportForSaving when subcategory is ${subcategory}`, function () {
            // when
            expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })).to.throw(
              InvalidCertificationIssueReportForSaving
            );
          });
        }
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('CATEGORY: IN_CHALLENGE', function () {
      let certificationIssueReportDTO: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
          questionNumber: 5,
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should create an IN_CHALLENGE CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // Test dynamically all subcategories
      // eslint-disable-next-line mocha/no-setup-in-describe
      [...Object.values(CertificationIssueReportSubcategories)].forEach((subcategory) => {
        if (
          [
            CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
            CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
            CertificationIssueReportSubcategories.FILE_NOT_OPENING,
            CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
            CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
            CertificationIssueReportSubcategories.EXTRA_TIME_EXCEEDED,
            CertificationIssueReportSubcategories.SOFTWARE_NOT_WORKING,
            CertificationIssueReportSubcategories.UNINTENTIONAL_FOCUS_OUT,
            CertificationIssueReportSubcategories.SKIP_ON_OOPS,
            CertificationIssueReportSubcategories.ACCESSIBILITY_ISSUE,
          ].includes(subcategory)
        ) {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should create an IN_CHALLENGE CertificationIssueReport when subcategory is of value ${subcategory}`, function () {
            // when
            expect(
              CertificationIssueReport.create({
                ...certificationIssueReportDTO,
                subcategory,
                description: subcategory === CertificationIssueReportSubcategories.OTHER ? 'salut' : null,
              })
            ).to.be.an.instanceOf(CertificationIssueReport);
          });
        } else if (
          [
            CertificationIssueReportSubcategories.LINK_NOT_WORKING,
            CertificationIssueReportSubcategories.OTHER,
          ].includes(subcategory)
        ) {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should throw a deprecated error when using subcategory ${subcategory}`, function () {
            // when
            const createIssueReport = () =>
              CertificationIssueReport.create({
                ...certificationIssueReportDTO,
                category: CertificationIssueReportCategories.IN_CHALLENGE,
                subcategory: CertificationIssueReportSubcategories.LINK_NOT_WORKING,
              });

            // then
            expect(createIssueReport).to.throw(DeprecatedCertificationIssueReportSubcategoryError);
          });
        } else {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`should throw an InvalidCertificationIssueReportForSaving when subcategory is ${subcategory}`, function () {
            // when
            expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })).to.throw(
              InvalidCertificationIssueReportForSaving
            );
          });
        }
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should throw an InvalidCertificationIssueReportForSaving when questionNumber is empty with value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, questionNumber: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an InvalidCertificationIssueReportForSaving when questionNumber is over 500', function () {
        // when
        expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, questionNumber: 501 })).to.throw(
          InvalidCertificationIssueReportForSaving
        );
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw an InvalidCertificationIssueReportForSaving when questionNumber is under 1', function () {
        // when
        expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, questionNumber: 0 })).to.throw(
          InvalidCertificationIssueReportForSaving
        );
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('CATEGORY: FRAUD', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should be valid', function () {
        const certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.FRAUD,
        };

        expect(() => CertificationIssueReport.create(certificationIssueReportDTO)).not.to.throw();
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('CATEGORY: TECHNICAL_PROBLEM', function () {
      let certificationIssueReportDTO: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.TECHNICAL_PROBLEM,
          description: 'Une description obligatoire',
        };
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw DeprecatedCertificationIssueReportCategoryError error', function () {
        expect(() => CertificationIssueReport.create(certificationIssueReportDTO)).to.throw(
          DeprecatedCertificationIssueReportCategoryError
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context(
      'Adds isImpactful boolean to certif issue report when the category or subcategory is impactful',
      function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        [
          { certificationCourseId: 42, category: 'OTHER', subcategory: undefined, description: 'toto' },
          {
            certificationCourseId: 42,
            category: 'CANDIDATE_INFORMATIONS_CHANGES',
            subcategory: 'NAME_OR_BIRTHDATE',
            description: 'toto',
          },
          {
            certificationCourseId: 42,
            category: 'LATE_OR_LEAVING',
            subcategory: 'LEFT_EXAM_ROOM',
            description: 'toto',
          },
          { certificationCourseId: 42, category: 'FRAUD' },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'WEBSITE_BLOCKED', questionNumber: 42 },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'WEBSITE_UNAVAILABLE',
            questionNumber: 42,
          },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'FILE_NOT_OPENING', questionNumber: 42 },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'LINK_NOT_WORKING', questionNumber: 42 },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'IMAGE_NOT_DISPLAYING',
            questionNumber: 42,
          },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'EMBED_NOT_WORKING', questionNumber: 42 },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'EXTRA_TIME_EXCEEDED',
            questionNumber: 42,
          },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'SOFTWARE_NOT_WORKING',
            questionNumber: 42,
          },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'UNINTENTIONAL_FOCUS_OUT',
            questionNumber: 42,
          },
          { certificationCourseId: 42, category: 'TECHNICAL_PROBLEM', description: 'toto' },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'SKIP_ON_OOPS',
            questionNumber: 42,
          },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'ACCESSIBILITY_ISSUE',
            questionNumber: 42,
          },
        ].forEach((certificationIssueReportDTO) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`for ${certificationIssueReportDTO.category} ${
            certificationIssueReportDTO.subcategory ? certificationIssueReportDTO.subcategory : ''
          } should tag certificationIssueReport with isImpactful to true`, function () {
            expect(new CertificationIssueReport({ ...certificationIssueReportDTO }).isImpactful).to.be.true;
          });
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        [
          {
            certificationCourseId: 42,
            category: 'CANDIDATE_INFORMATIONS_CHANGES',
            subcategory: 'EXTRA_TIME_PERCENTAGE',
            description: 'toto',
          },
          { certificationCourseId: 42, category: 'LATE_OR_LEAVING', subcategory: 'SIGNATURE_ISSUE' },
          { certificationCourseId: 42, category: 'CONNECTION_OR_END_SCREEN' },
        ].forEach((certificationIssueReportDTO) => {
          // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
          it(`for ${certificationIssueReportDTO.category} ${
            certificationIssueReportDTO.subcategory ? certificationIssueReportDTO.subcategory : ''
          } should tag certificationIssueReport with isImpactful to false`, function () {
            expect(new CertificationIssueReport({ ...certificationIssueReportDTO }).isImpactful).to.be.false;
          });
        });
      }
    );
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isResolved', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when the certification issue report is not resolved', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
        resolvedAt: null,
      });

      // when
      const isResolved = certificationIssueReport.isResolved();

      // then
      expect(isResolved).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when the certification issue report is resolved', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
        resolvedAt: new Date(),
      });

      // when
      const isResolved = certificationIssueReport.isResolved();

      // then
      expect(isResolved).to.be.true;
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#resolveManually', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Sets the issue report as resolved', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
        resolvedAt: null,
      });

      // when
      certificationIssueReport.resolveManually('RESOLVED');

      // then
      expect(certificationIssueReport.resolvedAt).not.to.be.null;
      expect(certificationIssueReport.hasBeenAutomaticallyResolved).to.be.false;
      expect(certificationIssueReport.resolution).to.equal('RESOLVED');
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#resolveAutomatically', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('sets the issue report as resolved automatically', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
        resolvedAt: null,
      });

      // when
      certificationIssueReport.resolveAutomatically('RESOLVED');

      // then
      expect(certificationIssueReport.resolvedAt).not.to.be.null;
      expect(certificationIssueReport.hasBeenAutomaticallyResolved).to.be.true;
      expect(certificationIssueReport.resolution).to.equal('RESOLVED');
    });
  });
});
