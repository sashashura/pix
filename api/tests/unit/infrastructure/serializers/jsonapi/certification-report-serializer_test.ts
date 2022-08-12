// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-report-serializer');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportSubcategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/models/CertificationIssueReportCategory');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-report-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a CertificationReport model object into JSON API data', function () {
      // given
      const certificationReport = domainBuilder.buildCertificationReport({
        certificationCourseId: 123,
        firstName: 'Joe',
        lastName: 'Lerigolo',
        isCompleted: false,
        examinerComment: 'Certification non terminée...',
        hasSeenEndTestScreen: false,
        abortReason: 'technical',
        certificationIssueReports: [],
      });
      const jsonApiData = {
        data: {
          type: 'certification-reports',
          id: certificationReport.id.toString(),
          attributes: {
            'certification-course-id': 123,
            'first-name': 'Joe',
            'last-name': 'Lerigolo',
            'is-completed': false,
            'examiner-comment': 'Certification non terminée...',
            'has-seen-end-test-screen': false,
            'abort-reason': 'technical',
          },
          relationships: {
            'certification-issue-reports': {
              data: [],
            },
          },
        },
      };

      // when
      const jsonApi = serializer.serialize(certificationReport);

      // then
      expect(jsonApi).to.deep.equal(jsonApiData);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should include CertificationIssueReports if any into JSON API data', function () {
      // given
      const certificationReport = domainBuilder.buildCertificationReport({
        id: 123,
        certificationIssueReports: [
          domainBuilder.buildCertificationIssueReport({
            category: CertificationIssueReportCategories.IN_CHALLENGE,
            description: 'Pas content',
            subcategory: CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
            questionNumber: '6',
          }),
        ],
      });

      const jsonApiDataRelationship = {
        data: [
          {
            type: 'certificationIssueReports',
            id: '123',
          },
        ],
      };
      const jsonApiDataIncluded = [
        {
          type: 'certificationIssueReports',
          id: '123',
          attributes: {
            category: CertificationIssueReportCategories.IN_CHALLENGE,
            description: 'Pas content',
            subcategory: CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
            'question-number': '6',
          },
        },
      ];

      // when
      const jsonApi = serializer.serialize(certificationReport);

      // then
      expect(jsonApi.included).to.deep.equal(jsonApiDataIncluded);
      expect(jsonApi.data.relationships['certification-issue-reports']).to.deep.equal(jsonApiDataRelationship);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize()', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a JSON API data into a CertificationReport', async function () {
      const certificationReport = domainBuilder.buildCertificationReport({
        certificationCourseId: 123,
        firstName: 'Joe',
        lastName: 'Lerigolo',
        isCompleted: true,
        examinerComment: 'Trop bien.',
        hasSeenEndTestScreen: true,
        abortReason: null,
        certificationIssueReports: [],
      });
      const jsonApiData = {
        data: {
          type: 'certification-reports',
          id: certificationReport.id.toString(),
          attributes: {
            'certification-course-id': 123,
            'first-name': 'Joe',
            'last-name': 'Lerigolo',
            'is-completed': true,
            'examiner-comment': 'Trop bien.',
            'has-seen-end-test-screen': true,
            'abort-reason': null,
          },
        },
      };

      // when
      const deserializedCertificationReport = await serializer.deserialize(jsonApiData);

      // then
      expect(deserializedCertificationReport).to.deep.equal(certificationReport);
    });
  });
});
