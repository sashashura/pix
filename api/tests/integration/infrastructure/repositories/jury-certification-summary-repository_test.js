const { databaseBuilder, domainBuilder, expect } = require('../../../test-helper');
const JuryCertificationSummary = require('../../../../lib/domain/read-models/JuryCertificationSummary');
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const {
  CertificationIssueReportCategories,
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');
const { status: assessmentResultStatuses } = require('../../../../lib/domain/models/AssessmentResult');
const juryCertificationSummaryRepository = require('../../../../lib/infrastructure/repositories/jury-certification-summary-repository');
const Assessment = require('../../../../lib/domain/models/Assessment');
const { PIX_EMPLOI_CLEA_V3, PIX_DROIT_MAITRE_CERTIF, PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE } =
  require('../../../../lib/domain/models/Badge').keys;

describe('Integration | Repository | JuryCertificationSummary', function () {
  describe('#findBySessionId', function () {
    context('when the session has no certifications', function () {
      let sessionId;

      beforeEach(function () {
        sessionId = databaseBuilder.factory.buildSession().id;

        return databaseBuilder.commit();
      });

      it('should return an empty array', async function () {
        // when
        const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

        // then
        expect(juryCertificationSummaries).to.have.length(0);
      });
    });

    context('when the session has some certifications', function () {
      let sessionId;
      let manyAsrCertification;
      let latestAssessmentResult;
      let startedCertification;
      let otherStartedCertification;
      const description = 'Super candidat !';
      let certificationIssueReport;

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
          complementaryCertificationTakenLabels: [],
        });
        expect(juryCertificationSummaries).to.have.length(3);
        expect(juryCertificationSummaries[0]).to.deepEqualInstance(expectedJuryCertificationSummary);
        expect(juryCertificationSummaries[1].id).to.equal(startedCertification.id);
      });

      context('when the certification has assessment-results', function () {
        it('should return JuryCertificationSummary based on their latest assessment result', async function () {
          // when
          const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

          // then
          expect(juryCertificationSummaries[0].pixScore).to.equal(latestAssessmentResult.pixScore);
          expect(juryCertificationSummaries[0].status).to.equal(JuryCertificationSummary.statuses.VALIDATED);
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

      context('when the certification has no assessment-result', function () {
        it('should return all juryCertificationSummaries with status started', async function () {
          // when
          const juryCertificationSummaries = await juryCertificationSummaryRepository.findBySessionId(sessionId);

          // then
          expect(juryCertificationSummaries[1].id).to.equal(startedCertification.id);
          expect(juryCertificationSummaries[1].status).to.equal(JuryCertificationSummary.statuses.STARTED);

          expect(juryCertificationSummaries[2].id).to.equal(otherStartedCertification.id);
          expect(juryCertificationSummaries[2].status).to.equal(JuryCertificationSummary.statuses.STARTED);
        });
      });
    });

    context('when the session has a cancelled certification course', function () {
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

    context('when the session has an ended by supervisor assessment', function () {
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

    context('when a summary has several issue reports', function () {
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
      context(`when a summary has a ${partnerKey} certification`, function () {
        it(`should have the associated label when ${partnerKey} certification is taken`, async function () {
          // given
          const dbf = databaseBuilder.factory;
          const sessionId = dbf.buildSession().id;
          const certificationCourseId = dbf.buildCertificationCourse({ sessionId }).id;
          const badgeId = dbf.buildBadge({ key: partnerKey }).id;
          dbf.buildComplementaryCertificationCourse({ id: 998, certificationCourseId });
          dbf.buildComplementaryCertificationCourseResult({
            complementaryCertificationCourseId: 998,
            partnerKey,
            acquired: true,
          });
          databaseBuilder.factory.buildComplementaryCertificationBadge({
            label,
            badgeId,
            complementaryCertificationId: databaseBuilder.factory.buildComplementaryCertification().id,
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

  describe('#findBySessionIdPaginated', function () {
    context('when the session has no certifications', function () {
      it('should return an empty array', async function () {
        const page = {};
        const sessionId = databaseBuilder.factory.buildSession().id;
        await databaseBuilder.commit();

        // when
        const { juryCertificationSummaries } = await juryCertificationSummaryRepository.findBySessionIdPaginated({
          page,
          sessionId,
        });

        // then
        expect(juryCertificationSummaries).to.have.length(0);
      });
    });

    context('when the session has some certifications', function () {
      it('should return JuryCertificationSummary based on their latest assessment result', async function () {
        // given
        const page = { size: 2, number: 1 };
        const partnerKey = 'partnerKey';
        const label = 'label';
        const dbf = databaseBuilder.factory;
        const sessionId = dbf.buildSession().id;
        const manyAsrCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'AAA' });
        const startedCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'CCC' });

        const manyAsrAssessmentId = dbf.buildAssessment({ certificationCourseId: manyAsrCertification.id }).id;
        dbf.buildAssessment({ certificationCourseId: startedCertification.id });

        dbf.buildAssessmentResult({ assessmentId: manyAsrAssessmentId, createdAt: new Date('2018-02-15T00:00:00Z') });
        dbf.buildAssessmentResult({ assessmentId: manyAsrAssessmentId, createdAt: new Date('2018-03-15T00:00:00Z') });
        const latestAssessmentResult = dbf.buildAssessmentResult({
          assessmentId: manyAsrAssessmentId,
          createdAt: new Date('2018-04-15T00:00:00Z'),
          status: assessmentResultStatuses.VALIDATED,
        });

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
        const badgeId = dbf.buildBadge({ key: partnerKey }).id;
        dbf.buildComplementaryCertificationCourse({ id: 998, certificationCourseId: manyAsrCertification.id });
        dbf.buildComplementaryCertificationCourseResult({
          complementaryCertificationCourseId: 998,
          partnerKey,
          acquired: true,
        });
        databaseBuilder.factory.buildComplementaryCertificationBadge({
          label,
          badgeId,
          complementaryCertificationId: databaseBuilder.factory.buildComplementaryCertification().id,
        });

        await databaseBuilder.commit();

        // when
        const { juryCertificationSummaries } = await juryCertificationSummaryRepository.findBySessionIdPaginated({
          page,
          sessionId,
        });

        const [juryCertificationSummary] = juryCertificationSummaries;

        // then
        expect(juryCertificationSummary.pixScore).to.equal(latestAssessmentResult.pixScore);
        expect(juryCertificationSummary.status).to.equal(JuryCertificationSummary.statuses.VALIDATED);
        expect(juryCertificationSummary.firstName).to.equal(manyAsrCertification.firstName);
        expect(juryCertificationSummary.lastName).to.equal(manyAsrCertification.lastName);
        expect(juryCertificationSummary.createdAt).to.deep.equal(manyAsrCertification.createdAt);
        expect(juryCertificationSummary.completedAt).to.deep.equal(manyAsrCertification.completedAt);
        expect(juryCertificationSummary.isPublished).to.equal(manyAsrCertification.isPublished);
        expect(juryCertificationSummary.hasSeendEndTestScreen).to.equal(manyAsrCertification.hasSeendEndTestScreen);
        expect(juryCertificationSummary.complementaryCertificationTakenLabels[0]).to.equal(label);
        expect(juryCertificationSummary.certificationIssueReports).to.deep.equal([
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

      it('should return paginated JuryCertificationSummary', async function () {
        // given
        const page = { size: 2, number: 2 };
        const dbf = databaseBuilder.factory;
        const sessionId = dbf.buildSession().id;
        const certification1 = dbf.buildCertificationCourse({ sessionId, lastName: 'AAA' });
        const certification2 = dbf.buildCertificationCourse({ sessionId, lastName: 'BBB' });
        const certification3 = dbf.buildCertificationCourse({ sessionId, lastName: 'CCC' });
        const certification4 = dbf.buildCertificationCourse({ sessionId, lastName: 'DDD' });
        const certification5 = dbf.buildCertificationCourse({ sessionId, lastName: 'EEE' });

        const assessment1Id = dbf.buildAssessment({ certificationCourseId: certification1.id }).id;
        const assessment2Id = dbf.buildAssessment({ certificationCourseId: certification2.id }).id;
        const assessment3Id = dbf.buildAssessment({ certificationCourseId: certification3.id }).id;
        const assessment4Id = dbf.buildAssessment({ certificationCourseId: certification4.id }).id;
        const assessment5Id = dbf.buildAssessment({ certificationCourseId: certification5.id }).id;

        dbf.buildAssessmentResult({ assessmentId: assessment1Id, createdAt: new Date('2018-02-15T00:00:00Z') });
        dbf.buildAssessmentResult({ assessmentId: assessment2Id, createdAt: new Date('2018-03-15T00:00:00Z') });
        dbf.buildAssessmentResult({ assessmentId: assessment3Id, createdAt: new Date('2018-03-15T00:00:00Z') });
        dbf.buildAssessmentResult({ assessmentId: assessment4Id, createdAt: new Date('2018-03-15T00:00:00Z') });
        dbf.buildAssessmentResult({ assessmentId: assessment5Id, createdAt: new Date('2018-03-15T00:00:00Z') });
        await databaseBuilder.commit();

        // when
        const { juryCertificationSummaries, pagination } =
          await juryCertificationSummaryRepository.findBySessionIdPaginated({
            page,
            sessionId,
          });

        // then
        expect(juryCertificationSummaries).to.have.length(2);
        expect(pagination).to.deep.equal({ rowCount: 5, pageCount: 3, page: page.number, pageSize: page.size });
      });
    });
  });
});
