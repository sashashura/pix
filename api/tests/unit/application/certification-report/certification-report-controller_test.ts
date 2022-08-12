// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationReportController = require('../../../../lib/application/certification-reports/certification-report-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | certification-report-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveCertificationIssueReport', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return serialized certification issue report with code 201', async function () {
      // given
      const certificationReportId = 123;
      const userId = 456;
      const certificationIssueReportDeserialized = {
        certificationCourseId: certificationReportId,
        category: 'someCategory',
        description: 'someDescription',
        subcategory: 'someSubcategory',
        questionNumber: 'someQuestionNumber',
      };
      const savedCertificationIssueReport = domainBuilder.buildCertificationIssueReport();
      sinon
        .stub(usecases, 'saveCertificationIssueReport')
        .withArgs({ certificationIssueReportDTO: certificationIssueReportDeserialized })
        .resolves(savedCertificationIssueReport);

      // when
      const response = await certificationReportController.saveCertificationIssueReport(
        {
          params: {
            id: certificationReportId,
          },
          auth: {
            credentials: { userId },
          },
          payload: {
            data: {
              attributes: {
                category: 'someCategory',
                description: 'someDescription',
                subcategory: 'someSubcategory',
                'question-number': 'someQuestionNumber',
              },
            },
          },
        },
        hFake
      );

      // then
      expect(response.source.data).to.deep.equal({
        type: 'certification-issue-reports',
        id: savedCertificationIssueReport.id.toString(),
        attributes: {
          category: savedCertificationIssueReport.category,
          description: savedCertificationIssueReport.description,
          subcategory: savedCertificationIssueReport.subcategory,
          'question-number': savedCertificationIssueReport.questionNumber,
        },
      });
      expect(response.statusCode).to.equal(201);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#abort', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 200 status code', async function () {
      // given
      const certificationCourseId = 123;
      const request = {
        params: {
          id: certificationCourseId,
        },
        payload: {
          data: {
            attributes: {
              reason: 'technical',
            },
          },
        },
      };

      sinon
        .stub(usecases, 'abortCertificationCourse')
        .withArgs({ certificationCourseId, abortReason: 'technical' })
        .resolves();

      // when
      const response = await certificationReportController.abort(request, hFake);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });
});
