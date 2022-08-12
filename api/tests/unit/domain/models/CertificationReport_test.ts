// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, EMPTY_BLANK_AND_NULL, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationReport = require('../../../../lib/domain/models/CertificationReport');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
const { InvalidCertificationReportForFinalization } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'keys'.
const keys = require('lodash/keys');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CertificationReport', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    EMPTY_BLANK_AND_NULL.forEach((examinerComment) => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should return no examiner comment if comment is "${examinerComment}"`, function () {
        // when
        const certificationReport = new CertificationReport({ examinerComment });

        // then
        expect(certificationReport.examinerComment).to.equal(CertificationReport.NO_EXAMINER_COMMENT);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validateForFinalization', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should validate valid fields without throwing an error', function () {
      // given
      const certificationReport = domainBuilder.buildCertificationReport({
        certificationCourseId: 1,
        certificationIssueReports: [],
        hasSeenEndTestScreen: true,
        isCompleted: true,
        abortReason: 'technical',
      });

      // when
      certificationReport.validateForFinalization();

      // then
      expect(true).to.be.true;
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      {
        certificationCourseId: null,
      },
      {
        certificationIssueReports: null,
      },
      {
        hasSeenEndTestScreen: null,
      },
      {
        isCompleted: null,
      },
    ].forEach((invalidData) =>
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should throw an error if ${_getFieldName(invalidData)} is missing`, async function () {
        // given
        const certificationReport = new CertificationReport({
          ...validCertificationReportData,
          ...invalidData,
        });

        // when
        const error = await catchErr(certificationReport.validateForFinalization, certificationReport)();

        // then
        expect(error).to.be.instanceOf(InvalidCertificationReportForFinalization);
        expect((error as $TSFixMe).message).contains(_getFieldName(invalidData));
      })
    );

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if not completed and abortReason is empty', async function () {
      // given
      const certificationReport = new CertificationReport({
        ...validCertificationReportData,
        isCompleted: false,
        abortReason: null,
      });

      // when
      const error = await catchErr(certificationReport.validateForFinalization, certificationReport)();

      // then
      expect(error).to.be.instanceOf(InvalidCertificationReportForFinalization);
      expect((error as $TSFixMe).message).to.equal('Abort reason is required if certificationReport is not completed');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#fromCertificationCourse', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a certificationReport from a certificationCourse', function () {
      // given
      const certificationCourse = domainBuilder.buildCertificationCourse();
      const certificationCourseDTO = certificationCourse.toDTO();
      const expectedCertificationReport = domainBuilder.buildCertificationReport({
        id: `CertificationReport:${certificationCourseDTO.id}`,
        certificationCourseId: certificationCourseDTO.id,
        examinerComment: null,
        certificationIssueReports: certificationCourseDTO.certificationIssueReports,
        firstName: certificationCourseDTO.firstName,
        isCompleted: true,
        lastName: certificationCourseDTO.lastName,
      });

      // when
      const certificationReport = CertificationReport.fromCertificationCourse(certificationCourse);

      // then
      expect(certificationReport).to.deepEqualInstance(expectedCertificationReport);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a certificationReport from a uncompleted certificationCourse', function () {
      // given
      const certificationCourse = domainBuilder.buildCertificationCourse({
        assessment: domainBuilder.buildAssessment({ state: Assessment.states.STARTED }),
      });

      // when
      const { isCompleted } = CertificationReport.fromCertificationCourse(certificationCourse);

      // then
      expect(isCompleted).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a certificationReport from a completed certificationCourse', function () {
      // given
      const certificationCourse = domainBuilder.buildCertificationCourse({
        assessment: domainBuilder.buildAssessment({ state: Assessment.states.COMPLETED }),
      });

      // when
      const { isCompleted } = CertificationReport.fromCertificationCourse(certificationCourse);

      // then
      expect(isCompleted).to.be.true;
    });
  });
});

const validCertificationReportData = {
  certificationCourseId: 1,
  certificationIssueReports: [],
  hasSeenEndTestScreen: true,
  isCompleted: true,
  abortReason: 'technical',
};

function _getFieldName(wrongData: $TSFixMe) {
  return keys(wrongData)[0];
}
