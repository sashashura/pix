// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationIssueReportRepository = require('../../../../lib/infrastructure/repositories/certification-issue-report-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Certification Issue Report', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('certification-issue-reports').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there is no corresponding issue report', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should persist the certif issue report in db', async function () {
        // given
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        await databaseBuilder.commit();

        const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
          id: undefined,
          certificationCourseId,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          description: 'Un gros problème',
          subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
          questionNumber: 5,
          resolvedAt: null,
          resolution: null,
        });

        // when
        const savedCertificationIssueReport = await certificationIssueReportRepository.save(certificationIssueReport);

        // then
        const expectedSavedCertificationIssueReport = domainBuilder.buildCertificationIssueReport({
          certificationCourseId,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          description: 'Un gros problème',
          isActionRequired: true,
          subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
          questionNumber: 5,
          resolvedAt: null,
          resolution: null,
        });

        expect(_.omit(savedCertificationIssueReport, 'id')).to.deep.equal(
          _.omit(expectedSavedCertificationIssueReport, 'id')
        );
        expect(savedCertificationIssueReport).to.be.an.instanceOf(CertificationIssueReport);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('when there is a corresponding issue report', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should persist the updated certif issue report in db', async function () {
        // given
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        const certificationIssueReport = databaseBuilder.factory.buildCertificationIssueReport({
          id: 1234,
          certificationCourseId,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          description: 'Un gros problème',
          subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
          questionNumber: 5,
          resolvedAt: null,
          resolution: null,
        });

        await databaseBuilder.commit();

        const updatedIssueReport = {
          ...certificationIssueReport,
          resolvedAt: new Date('2020-01-01'),
          resolution: 'coucou',
        };

        // when
        const savedCertificationIssueReport = await certificationIssueReportRepository.save(updatedIssueReport);

        // then
        const expectedSavedCertificationIssueReport = domainBuilder.buildCertificationIssueReport({
          id: 1234,
          certificationCourseId,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          description: 'Un gros problème',
          isActionRequired: true,
          subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
          questionNumber: 5,
          resolvedAt: new Date('2020-01-01'),
          resolution: 'coucou',
        });

        expect(savedCertificationIssueReport).to.deepEqualInstance(expectedSavedCertificationIssueReport);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delete the issue report', async function () {
      // given
      const certificationIssueReportToDeleteId = databaseBuilder.factory.buildCertificationIssueReport().id;
      databaseBuilder.factory.buildCertificationIssueReport();
      await databaseBuilder.commit();

      // when
      await certificationIssueReportRepository.delete(certificationIssueReportToDeleteId);

      // then
      const exists = await knex('certification-issue-reports')
        .where({ id: certificationIssueReportToDeleteId })
        .first();
      expect(Boolean(exists)).to.be.false;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a certification issue report', async function () {
      // given
      const issueReport = databaseBuilder.factory.buildCertificationIssueReport({ category: 'OTHER' });
      await databaseBuilder.commit();

      // when
      const result = await certificationIssueReportRepository.get(issueReport.id);

      // then
      const expectedIssueReport = domainBuilder.buildCertificationIssueReport({
        ...issueReport,
      });

      expect(result).to.deep.equal(expectedIssueReport);
      expect(result).to.be.instanceOf(CertificationIssueReport);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByCertificationCourseId', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return certification issue reports for a certification course id', async function () {
      // given
      const targetCertificationCourse = databaseBuilder.factory.buildCertificationCourse();
      const otherCertificationCourse = databaseBuilder.factory.buildCertificationCourse();
      const issueReportForTargetCourse1 = databaseBuilder.factory.buildCertificationIssueReport({
        certificationCourseId: targetCertificationCourse.id,
      });
      const issueReportForTargetCourse2 = databaseBuilder.factory.buildCertificationIssueReport({
        certificationCourseId: targetCertificationCourse.id,
      });
      databaseBuilder.factory.buildCertificationIssueReport({ certificationCourseId: otherCertificationCourse.id });
      await databaseBuilder.commit();

      // when
      const results = await certificationIssueReportRepository.findByCertificationCourseId(
        targetCertificationCourse.id
      );

      // then
      const expectedIssueReports = [
        new CertificationIssueReport(issueReportForTargetCourse1),
        new CertificationIssueReport(issueReportForTargetCourse2),
      ];
      expect(results).to.deep.equal(expectedIssueReports);
      expect(results[0]).to.be.instanceOf(CertificationIssueReport);
    });
  });
});
