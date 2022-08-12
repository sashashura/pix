// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertificationSummary = require('../../../../lib/domain/read-models/JuryCertificationSummary');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const forIn = require('lodash/forIn');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('../../../../lib/domain/models/ComplementaryCertificationCourseResult');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | JuryCertificationSummary', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a JuryCertificationSummary', function () {
      // given
      const notImpactfulIssueReport = domainBuilder.buildCertificationIssueReport.notImpactful({ resolvedAt: null });
      const data = {
        certificationIssueReports: [notImpactfulIssueReport],
        complementaryCertificationCourseResults: [
          ComplementaryCertificationCourseResult.from({
            partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
            acquired: true,
            source: 'PIX',
          }),
          ComplementaryCertificationCourseResult.from({
            partnerKey: PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE,
            acquired: true,
            source: 'EXTERNAL',
          }),
          ComplementaryCertificationCourseResult.from({
            partnerKey: PIX_DROIT_EXPERT_CERTIF,
            acquired: false,
            source: 'PIX',
          }),
        ],
        completedAt: new Date('2020-01-01'),
        createdAt: new Date('2020-01-02'),
        firstName: 'Mad',
        lastName: 'Martigan',
        hasSeenEndTestScreen: 'true',
        id: 100001,
        isFlaggedAborted: false,
        isPublished: false,
        pixScore: 751,
        status: 'started',
      };

      // when
      const juryCertificationSummary = new JuryCertificationSummary(data);

      // then
      expect(juryCertificationSummary).to.deep.equal({
        certificationIssueReports: [notImpactfulIssueReport],
        complementaryCertificationTakenLabels: [
          'Pix+ Édu 2nd degré Initié (entrée dans le métier)',
          'Pix+ Droit Expert',
        ],
        completedAt: new Date('2020-01-01'),
        createdAt: new Date('2020-01-02'),
        firstName: 'Mad',
        lastName: 'Martigan',
        hasSeenEndTestScreen: 'true',
        id: 100001,
        isFlaggedAborted: false,
        isPublished: false,
        pixScore: 751,
        status: 'started',
      });
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#validate', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a status is given', function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      forIn(AssessmentResult.status, (status: $TSFixMe, key: $TSFixMe) => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should returns "${status}" status`, function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({ status });

          // then
expect(juryCertificationSummary.status).equal((JuryCertificationSummary as $TSFixMe).statuses[key]);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when course is cancelled', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should returns "cancelled" status`, function () {
        // when
        const juryCertificationSummary = new JuryCertificationSummary({ isCourseCancelled: true });

        // then
expect(juryCertificationSummary.status).equal((JuryCertificationSummary as $TSFixMe).statuses['CANCELLED']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is ended by supervisor', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it(`should returns "endedBySupervisor" status`, function () {
        // when
        const juryCertificationSummary = new JuryCertificationSummary({ isEndedBySupervisor: true });

        // then
expect(juryCertificationSummary.status).equal((JuryCertificationSummary as $TSFixMe).statuses['ENDED_BY_SUPERVISOR']);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when no status is given', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return "started"', function () {
        // when
        const juryCertificationSummary = new JuryCertificationSummary({ status: null });

        // then
expect(juryCertificationSummary.status).equal((JuryCertificationSummary as $TSFixMe).statuses.STARTED);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isFlaggedAborted', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification has been scored while started', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('with abort reason', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return isFlaggedAborted true', function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({
            abortReason: 'candidate',
            completedAt: null,
            pixScore: 456,
          });

          // then
          expect(juryCertificationSummary.isFlaggedAborted).equal(true);
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('without abort reason', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return isFlaggedAborted false', function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({
            abortReason: null,
            completedAt: null,
            pixScore: 456,
          });

          // then
          expect(juryCertificationSummary.isFlaggedAborted).equal(false);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the certification has been scored while completed', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('with abort reason', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return isFlaggedAborted false', function () {
          // when
          const juryCertificationSummary = new JuryCertificationSummary({
            abortReason: 'candidate',
            completedAt: new Date(),
            pixScore: 456,
          });

          // then
          expect(juryCertificationSummary.isFlaggedAborted).equal(false);
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#isActionRequired', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the issue report is unresolved', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the issue report is impactful', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return true', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [domainBuilder.buildCertificationIssueReport.impactful({ resolvedAt: null })],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.true;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the issue report is not impactful', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [domainBuilder.buildCertificationIssueReport.notImpactful({ resolvedAt: null })],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.false;
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the issue report is resolved', function () {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the issue report is impactful', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [
              domainBuilder.buildCertificationIssueReport.impactful({
                resolvedAt: new Date('2020-01-01'),
                resolution: 'coucou',
              }),
            ],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.false;
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the issue report is not impactful', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({
            certificationIssueReports: [
              domainBuilder.buildCertificationIssueReport.notImpactful({ resolvedAt: new Date('2020-01-01') }),
            ],
          });

          // when
          const isRequired = juryCertificationSummary.isActionRequired();

          // then
          expect(isRequired).to.be.false;
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasScoringError', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment result has a scoring error', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', function () {
        // given
        const juryCertificationSummary = new JuryCertificationSummary({ status: AssessmentResult.status.ERROR });

        // when
        const hasScoringError = juryCertificationSummary.hasScoringError();

        // then
        expect(hasScoringError).to.be.true;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context("when assessment result doesn't have a scoring error", function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({ status: AssessmentResult.status.VALIDATED });

          // when
          const hasScoringError = juryCertificationSummary.hasScoringError();

          // then
          expect(hasScoringError).to.be.false;
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#hasCompletedAssessment', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment is completed', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return true', function () {
        // given
        const juryCertificationSummary = new JuryCertificationSummary({ status: AssessmentResult.status.REJECTED });

        // when
        const hasCompletedAssessment = juryCertificationSummary.hasCompletedAssessment();

        // then
        expect(hasCompletedAssessment).to.be.true;
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when assessment is not completed', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return false', function () {
          // given
          const juryCertificationSummary = new JuryCertificationSummary({ status: null });

          // when
          const hasCompletedAssessment = juryCertificationSummary.hasCompletedAssessment();

          // then
          expect(hasCompletedAssessment).to.be.false;
        });
      });
    });
  });
});
