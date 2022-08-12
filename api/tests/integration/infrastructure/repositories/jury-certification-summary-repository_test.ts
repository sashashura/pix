// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const { databaseBuilder, domainBuilder, expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'JuryCertif... Remove this comment to see the full error message
const JuryCertificationSummary = require('../../../../lib/domain/read-models/JuryCertificationSummary');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const {
  // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationIssueReportCategories,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const { status: assessmentResultStatuses } = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'juryCertif... Remove this comment to see the full error message
const juryCertificationSummaryRepository = require('../../../../lib/infrastructure/repositories/jury-certification-summary-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
const { PIX_EMPLOI_CLEA_V3, PIX_DROIT_MAITRE_CERTIF, PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE } =
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../../../../lib/domain/models/Badge').keys;

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | JuryCertificationSummary', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findBySessionId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session has no certifications', function () {
      let sessionId: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        sessionId = databaseBuilder.factory.buildSession().id;

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // when
        const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

        // then
        expect(juryCertificationSummaries).to.have.length(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session has some certifications', function () {
      let sessionId: $TSFixMe;
      let manyAsrCertification: $TSFixMe;
      let latestAssessmentResult: $TSFixMe;
      let startedCertification: $TSFixMe;
      let otherStartedCertification: $TSFixMe;
      const description = 'Super candidat !';
      let certificationIssueReport: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        const dbf = databaseBuilder.factory;
        sessionId = dbf.buildSession().id;
        manyAsrCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'AAA' });
        startedCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'CCC' });
        otherStartedCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'DDD' });

        const manyAsrAssessmentId = dbf.buildAssessment({ certificationCourseId: manyAsrCertification.id }).id;
        dbf.buildAssessment({ certificationCourseId: startedCertification.id });

        certificationIssueReport = dbf.buildCertificationIssueReport({
          certificationCourseId: manyAsrCertification.id,
          category: CertificationIssueReportCategories.OTHER,
          description,
        });

        dbf.buildAssessmentResult({ assessmentId: manyAsrAssessmentId, createdAt: new Date('2018-02-15T00:00:00Z') });
        dbf.buildAssessmentResult({ assessmentId: manyAsrAssessmentId, createdAt: new Date('2018-03-15T00:00:00Z') });
        latestAssessmentResult = dbf.buildAssessmentResult({
          assessmentId: manyAsrAssessmentId,
          createdAt: new Date('2018-04-15T00:00:00Z'),
          status: assessmentResultStatuses.VALIDATED,
        });

        return databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an array of JuryCertificationSummary sorted by name', async function () {
        // when
        const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

        // then
        const expectedJuryCertificationSummary = domainBuilder.buildJuryCertificationSummary({
          completedAt: manyAsrCertification.completedAt,
          createdAt: manyAsrCertification.createdAt,
          firstName: manyAsrCertification.firstName,
          hasSeenEndTestScreen: manyAsrCertification.hasSeenEndTestScreen,
          id: manyAsrCertification.id,
          isPublished: manyAsrCertification.isPublished,
          lastName: 'AAA',
          pixScore: latestAssessmentResult.pixScore,
          status: latestAssessmentResult.status,
          certificationIssueReports: [
            new CertificationIssueReport({
              id: certificationIssueReport.id,
              certificationCourseId: manyAsrCertification.id,
              description,
              subcategory: null,
              questionNumber: null,
              category: CertificationIssueReportCategories.OTHER,
              hasBeenAutomaticallyResolved: null,
              resolvedAt: null,
              resolution: null,
            }),
          ],
          complementaryCertificationCourseResults: [],
        });
        expect(juryCertificationSummaries).to.have.length(3);
        expect(juryCertificationSummaries[0]).to.deepEqualInstance(expectedJuryCertificationSummary);
        expect(juryCertificationSummaries[1].id).to.equal(startedCertification.id);
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the certification has assessment-results', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return JuryCertificationSummary based on their latest assessment result', async function () {
          // when
          const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

          // then
          expect(juryCertificationSummaries[0].pixScore).to.equal(latestAssessmentResult.pixScore);
          expect(juryCertificationSummaries[0].status).to.equal((JuryCertificationSummary as $TSFixMe).statuses.VALIDATED);
          expect(juryCertificationSummaries[0].firstName).to.equal(manyAsrCertification.firstName);
          expect(juryCertificationSummaries[0].lastName).to.equal(manyAsrCertification.lastName);
          expect(juryCertificationSummaries[0].createdAt).to.deep.equal(manyAsrCertification.createdAt);
          expect(juryCertificationSummaries[0].completedAt).to.deep.equal(manyAsrCertification.completedAt);
          expect(juryCertificationSummaries[0].isPublished).to.equal(manyAsrCertification.isPublished);
          expect(juryCertificationSummaries[0].hasSeendEndTestScreen).to.equal(
            manyAsrCertification.hasSeendEndTestScreen
          );
        });
      });

      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context('when the certification has no assessment-result', function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return all juryCertificationSummaries with status started', async function () {
          // when
          const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

          // then
          expect(juryCertificationSummaries[1].id).to.equal(startedCertification.id);
          expect(juryCertificationSummaries[1].status).to.equal((JuryCertificationSummary as $TSFixMe).statuses.STARTED);

          expect(juryCertificationSummaries[2].id).to.equal(otherStartedCertification.id);
          expect(juryCertificationSummaries[2].status).to.equal((JuryCertificationSummary as $TSFixMe).statuses.STARTED);
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session has a cancelled certification course', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a JuryCertificationSummary with a cancelled status', async function () {
        // given
        const dbf = databaseBuilder.factory;
        const sessionId = dbf.buildSession().id;
        const cancelledCertification = dbf.buildCertificationCourse({
          sessionId,
          lastName: 'DDD',
          isCancelled: true,
        });

        const assessmentId = dbf.buildAssessment({ certificationCourseId: cancelledCertification.id }).id;

        dbf.buildAssessmentResult({ assessmentId, createdAt: new Date('2018-02-15T00:00:00Z') });

        await databaseBuilder.commit();

        // when
        const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

        // then
        expect(juryCertificationSummaries[0].status).to.equal('cancelled');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the session has an ended by supervisor assessment', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a JuryCertificationSummary with a endedBySupervisor status', async function () {
        // given
        const dbf = databaseBuilder.factory;
        const sessionId = dbf.buildSession().id;
        const cancelledCertification = dbf.buildCertificationCourse({
          sessionId,
          lastName: 'DDD',
          isCancelled: false,
        });

        const assessmentId = dbf.buildAssessment({
          certificationCourseId: cancelledCertification.id,
          state: Assessment.states.ENDED_BY_SUPERVISOR,
        }).id;

        dbf.buildAssessmentResult({ assessmentId, createdAt: new Date('2018-02-15T00:00:00Z') });

        await databaseBuilder.commit();

        // when
        const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

        // then
        expect(juryCertificationSummaries[0].status).to.equal('endedBySupervisor');
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a summary has several issue reports', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return all issue reports', async function () {
        // given
        const dbf = databaseBuilder.factory;
        const sessionId = dbf.buildSession().id;
        const manyAsrCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'AAA' });

        const manyAsrAssessmentId = dbf.buildAssessment({ certificationCourseId: manyAsrCertification.id }).id;

        const issueReport1 = dbf.buildCertificationIssueReport({
          certificationCourseId: manyAsrCertification.id,
          category: CertificationIssueReportCategories.OTHER,
          description: 'first certification issue report',
          hasBeenAutomaticallyResolved: false,
        });
        const issueReport2 = dbf.buildCertificationIssueReport({
          certificationCourseId: manyAsrCertification.id,
          category: CertificationIssueReportCategories.OTHER,
          description: 'second certification issue report',
          hasBeenAutomaticallyResolved: false,
        });

        dbf.buildAssessmentResult({
          assessmentId: manyAsrAssessmentId,
          createdAt: new Date('2018-04-15T00:00:00Z'),
          status: assessmentResultStatuses.VALIDATED,
        });

        await databaseBuilder.commit();

        // when
        const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);
        const certificationIssueReports = juryCertificationSummaries[0].certificationIssueReports;

        // then
        expect(juryCertificationSummaries).to.have.lengthOf(1);
        expect(certificationIssueReports).to.have.lengthOf(2);
        expect(certificationIssueReports).to.deep.equal([
          new CertificationIssueReport({
            id: issueReport1.id,
            category: issueReport1.category,
            certificationCourseId: manyAsrCertification.id,
            description: 'first certification issue report',
            hasBeenAutomaticallyResolved: false,
            subcategory: null,
            questionNumber: null,
            resolvedAt: null,
            resolution: null,
          }),
          new CertificationIssueReport({
            id: issueReport2.id,
            category: issueReport2.category,
            certificationCourseId: manyAsrCertification.id,
            description: 'second certification issue report',
            hasBeenAutomaticallyResolved: false,
            subcategory: null,
            questionNumber: null,
            resolvedAt: null,
            resolution: null,
          }),
        ]);
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    [
      { partnerKey: PIX_EMPLOI_CLEA_V3, label: 'CléA Numérique' },
      { partnerKey: PIX_DROIT_MAITRE_CERTIF, label: 'Pix+ Droit Maître' },
      {
        partnerKey: PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
        label: 'Pix+ Édu 2nd degré Initié (entrée dans le métier)',
      },
    ].forEach(({ partnerKey, label }) => {
      // @ts-expect-error TS(2304): Cannot find name 'context'.
      context(`when a summary has a ${partnerKey} certification`, function () {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it(`should have the associated label when ${partnerKey} certification is taken`, async function () {
          // given
          const dbf = databaseBuilder.factory;
          const sessionId = dbf.buildSession().id;
          const certificationCourseId = dbf.buildCertificationCourse({ sessionId }).id;
          dbf.buildBadge({ key: partnerKey });
          dbf.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          dbf.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

          // then
          expect(juryCertificationSummaries).to.have.lengthOf(1);
          expect(juryCertificationSummaries[0].complementaryCertificationTakenLabels[0]).to.equal(label);
        });
      });
    });
  });
});
