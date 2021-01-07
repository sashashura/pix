const _ = require('lodash');
const { expect, databaseBuilder, knex, catchErr } = require('../../../test-helper');
const certificationIssueReportRepository = require('../../../../lib/infrastructure/repositories/certification-issue-report-repository');
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const ConnectionOrEndScreenCertificationIssueReport = require('./../../../../lib/domain/models/ConnectionOrEndScreenCertificationIssueReport');
const { CertificationIssueReportCategories, CertificationIssueReportSubcategories } = require('../../../../lib/domain/models/CertificationIssueReportCategory');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Integration | Repository | Certification Issue Report', function() {

  afterEach(async () => {
    await knex('certification-issue-reports').delete();
  });

  describe('#save', () => {

    it('should persist the certif issue report in db', async () => {
      // given
      const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
      const certificationIssueReport = new CertificationIssueReport({
        certificationCourseId,
        category: CertificationIssueReportCategories.IN_CHALLENGE,
        subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
        questionNumber: 5,
      });
      await databaseBuilder.commit();

      // when
      const savedCertificationIssueReport = await certificationIssueReportRepository.save(certificationIssueReport);

      // then
      const expectedSavedCertificationIssueReport = {
        certificationCourseId,
        category: CertificationIssueReportCategories.IN_CHALLENGE,
        subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
        questionNumber: 5,
        description: null,
      };

      expect(_.omit(savedCertificationIssueReport, 'id')).to.deep.equal(expectedSavedCertificationIssueReport);
      expect(savedCertificationIssueReport).to.be.an.instanceOf(CertificationIssueReport);
    });

    it('should persist a "connection or end screen" certification issue report on db', async () => {
      // given
      const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
      const certificationIssueReport = new ConnectionOrEndScreenCertificationIssueReport({
        certificationCourseId: certificationCourseId,
      });
      await databaseBuilder.commit();

      // when
      const savedCertificationIssueReport = await certificationIssueReportRepository.save(certificationIssueReport);

      // then
      expect(savedCertificationIssueReport).to.be.an.instanceOf(ConnectionOrEndScreenCertificationIssueReport);
      expect(savedCertificationIssueReport.id).to.satisfy(Number.isInteger);
    });
  });

  describe('#delete', () => {

    it('should delete the issue report when it exists in certification course id', async () => {
      // given
      const certificationIssueReportToDeleteId = databaseBuilder.factory.buildCertificationIssueReport().id;
      databaseBuilder.factory.buildCertificationIssueReport();
      await databaseBuilder.commit();

      // when
      await certificationIssueReportRepository.delete(certificationIssueReportToDeleteId);

      // then
      const exists = await knex('certification-issue-reports').where({ id: certificationIssueReportToDeleteId }).first();
      expect(Boolean(exists)).to.be.false;
    });

    it('should return true when deletion happened', async () => {
      // given
      const certificationIssueReportToDeleteId = databaseBuilder.factory.buildCertificationIssueReport().id;
      await databaseBuilder.commit();

      // when
      const deleted = await certificationIssueReportRepository.delete(certificationIssueReportToDeleteId);

      // then
      expect(deleted).to.be.true;
    });

    it('should return false when there was nothing to delete', async () => {
      // given
      const certificationIssueReportToDeleteId = databaseBuilder.factory.buildCertificationIssueReport().id;

      // when
      const deleted = await certificationIssueReportRepository.delete(certificationIssueReportToDeleteId);

      // then
      expect(deleted).to.be.false;
    });
  });

  describe('#get', () => {
    it('should return a certification issue report', async () => {
      // given
      const expectedIssueReport = databaseBuilder.factory.buildCertificationIssueReport();
      await databaseBuilder.commit();

      // when
      const result = await certificationIssueReportRepository.get(expectedIssueReport.id);

      // then
      expect(result).to.deep.equal(expectedIssueReport);
      expect(result).to.be.instanceOf(CertificationIssueReport);
    });

    it('should throw a notFound error', async () => {
      // when
      const error = await catchErr(certificationIssueReportRepository.get)(1234);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

});
