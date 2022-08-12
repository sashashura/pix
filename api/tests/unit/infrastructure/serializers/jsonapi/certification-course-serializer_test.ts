// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/certification-course-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../../../../lib/domain/models/CertificationCourse');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../../../../lib/domain/models/CertificationIssueReport');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../../lib/domain/models/CertificationIssueReportCategory');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | certification-course-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert a Certification Course model object into JSON API data', function () {
      // given
      const assessment = new Assessment({
        id: 'assessment_id',
      });
      const certificationCourse = new CertificationCourse({
        id: 1,
        assessment: assessment,
        challenges: ['challenge1', 'challenge2'],
        certificationIssueReports: [],
        hasSeenEndTestScreen: true,
      });

      const issueReport = new CertificationIssueReport({
        id: 1234,
        description: "Signalement de l'examinateur",
        category: CertificationIssueReportCategories.OTHER,
        certificationCourseId: certificationCourse.getId(),
      });

      certificationCourse.reportIssue(issueReport);

      const jsonCertificationCourseWithAssessment = {
        data: {
          type: 'certification-courses',
          id: '1',
          attributes: {
            'nb-challenges': 2,
            'examiner-comment': "Signalement de l'examinateur",
            'is-end-test-screen-removal-enabled': true,
            'has-seen-end-test-screen': true,
            'first-name': certificationCourse.toDTO().firstName,
            'last-name': certificationCourse.toDTO().lastName,
          },
          relationships: {
            assessment: {
              links: {
                related: '/api/assessments/assessment_id',
              },
            },
          },
        },
      };

      // when
      const json = serializer.serialize(certificationCourse, true);

      // then
      expect(json).to.deep.equal(jsonCertificationCourseWithAssessment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not serialize examinerComment if no issue report', function () {
      // given
      const assessment = new Assessment({
        id: 'assessment_id',
      });
      const certificationCourse = new CertificationCourse({
        id: 1,
        assessment: assessment,
        challenges: ['challenge1', 'challenge2'],
        certificationIssueReports: undefined,
        hasSeenEndTestScreen: true,
      });

      const jsonCertificationCourseWithAssessment = {
        data: {
          type: 'certification-courses',
          id: '1',
          attributes: {
            'nb-challenges': 2,
            'examiner-comment': undefined,
            'has-seen-end-test-screen': true,
            'is-end-test-screen-removal-enabled': undefined,
            'first-name': certificationCourse.toDTO().firstName,
            'last-name': certificationCourse.toDTO().lastName,
          },
          relationships: {
            assessment: {
              links: {
                related: '/api/assessments/assessment_id',
              },
            },
          },
        },
      };

      // when
      const json = serializer.serialize(certificationCourse);

      // then
      expect(json).to.deep.equal(jsonCertificationCourseWithAssessment);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should count 0 challenges when no challenges', function () {
      // given
      const assessment = new Assessment({
        id: 'assessment_id',
      });
      const certificationCourse = new CertificationCourse({
        id: 1,
        assessment: assessment,
        challenges: undefined,
        certificationIssueReports: undefined,
        hasSeenEndTestScreen: true,
      });

      const jsonCertificationCourseWithAssessment = {
        data: {
          type: 'certification-courses',
          id: '1',
          attributes: {
            'nb-challenges': 0,
            'examiner-comment': undefined,
            'has-seen-end-test-screen': true,
            'is-end-test-screen-removal-enabled': undefined,
            'first-name': certificationCourse.toDTO().firstName,
            'last-name': certificationCourse.toDTO().lastName,
          },
          relationships: {
            assessment: {
              links: {
                related: '/api/assessments/assessment_id',
              },
            },
          },
        },
      };

      // when
      const json = serializer.serialize(certificationCourse);

      // then
      expect(json).to.deep.equal(jsonCertificationCourseWithAssessment);
    });
  });
});
