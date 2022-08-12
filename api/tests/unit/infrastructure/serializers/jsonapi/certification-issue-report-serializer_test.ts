// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-issue-report-serializer');

const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/models/CertificationIssueReportCategory');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-issue-report-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a CertificationIssueReport model object into JSON API data', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport();
      const jsonApiData = {
        data: {
          type: 'certification-issue-reports',
          id: certificationIssueReport.id.toString(),
          attributes: {
            category: certificationIssueReport.category,
            description: certificationIssueReport.description,
            subcategory: certificationIssueReport.subcategory,
            'question-number': certificationIssueReport.questionNumber,
          },
        },
      };

      // when
      const jsonApi = serializer.serialize(certificationIssueReport);

      // then
      expect(jsonApi).to.deep.equal(jsonApiData);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data to a CertificationIssueReport', function () {
      // given
      const certificationCourseId = 1;
      const description = '65%';
      const questionNumber = 6;
      const json = {
        data: {
          attributes: {
            category: 'IN_CHALLENGE',
            description,
            subcategory: 'IMAGE_NOT_DISPLAYING',
            'question-number': questionNumber,
          },
          relationships: {
            'certification-report': {
              data: {
                type: 'certification-reports',
                id: 'CertificationReport:103836',
              },
            },
          },
          type: 'certification-issue-reports',
        },
      };
      const request = {
        params: { id: certificationCourseId },
        payload: json,
      };

      // when
      const certificationIssueReport = serializer.deserialize(request);

      // then
      const expectedCertificationIssueReport = {
        certificationCourseId,
        category: CertificationIssueReportCategories.IN_CHALLENGE,
        description,
        subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
        questionNumber,
      };
      expect(certificationIssueReport).to.deep.equal(expectedCertificationIssueReport);
    });
  });
});
