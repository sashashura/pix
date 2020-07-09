const { databaseBuilder, expect } = require('../../../test-helper');
const JuryCertificationSummary = require('../../../../lib/domain/read-models/JuryCertificationSummary');
const { status: assessmentResultStatuses } = require('../../../../lib/domain/models/AssessmentResult');
const juryCertificationSummaryRepository = require('../../../../lib/infrastructure/repositories/jury-certification-summary-repository');

describe('Integration | Repository | JuryCertificationSummary', function() {

  describe('#findPaginatedFilteredBySessionId', () => {

    context('when the session has no certifications', () => {
      let sessionId;

      beforeEach(() => {
        sessionId = databaseBuilder.factory.buildSession().id;

        return databaseBuilder.commit();
      });

      it('should return an empty array', async () => {
        // given
        const filter = {};
        const page = {};

        // when
        const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

        // then
        expect(result.juryCertificationSummaries).to.have.length(0);
        expect(result.pagination.rowCount).to.equal(0);
        expect(result.pagination.pageCount).to.equal(0);
      });
    });

    context('when the session has some certifications', () => {
      let sessionId;
      let manyAsrCertification;
      let latestAssessmentResult;
      let startedCertification;
      let otherStartedCertification;

      beforeEach(() => {
        const dbf = databaseBuilder.factory;
        sessionId = dbf.buildSession().id;
        manyAsrCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'AAA', firstName: 'Dominique' });
        startedCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'CCC', firstName: 'Dorian' });
        otherStartedCertification = dbf.buildCertificationCourse({ sessionId, lastName: 'DDD', firstName: 'Gabriel' });

        const manyAsrAssessmentId = dbf.buildAssessment({ certificationCourseId: manyAsrCertification.id }).id;
        dbf.buildAssessment({ certificationCourseId: startedCertification.id });

        dbf.buildAssessmentResult({ assessmentId: manyAsrAssessmentId, createdAt: new Date('2018-02-15T00:00:00Z') });
        dbf.buildAssessmentResult({ assessmentId: manyAsrAssessmentId, createdAt: new Date('2018-03-15T00:00:00Z') });
        latestAssessmentResult = dbf.buildAssessmentResult({ assessmentId: manyAsrAssessmentId, createdAt: new Date('2018-04-15T00:00:00Z'), status: assessmentResultStatuses.VALIDATED, pixScore: 42 });

        return databaseBuilder.commit();
      });

      it('should return an array of JuryCertificationSummary sorted by name', async () => {
        // given
        const filter = {};
        const page = {};

        // when
        const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

        // then
        expect(result.juryCertificationSummaries).to.have.length(3);
        expect(result.juryCertificationSummaries[0]).to.be.instanceOf(JuryCertificationSummary);
        expect(result.juryCertificationSummaries[0].id).to.equal(manyAsrCertification.id);
        expect(result.juryCertificationSummaries[1].id).to.equal(startedCertification.id);
      });

      context('when the certification has assessment-results', () => {

        it('should return JuryCertificationSummary based on their latest assessment result', async () => {
          // given
          const filter = {};
          const page = {};

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.juryCertificationSummaries[0].pixScore).to.equal(latestAssessmentResult.pixScore);
          expect(result.juryCertificationSummaries[0].status).to.equal(JuryCertificationSummary.statuses.VALIDATED);
          expect(result.juryCertificationSummaries[0].firstName).to.equal(manyAsrCertification.firstName);
          expect(result.juryCertificationSummaries[0].lastName).to.equal(manyAsrCertification.lastName);
          expect(result.juryCertificationSummaries[0].createdAt).to.deep.equal(manyAsrCertification.createdAt);
          expect(result.juryCertificationSummaries[0].completedAt).to.deep.equal(manyAsrCertification.completedAt);
          expect(result.juryCertificationSummaries[0].isPublished).to.equal(manyAsrCertification.isPublished);
          expect(result.juryCertificationSummaries[0].examinerComment).to.equal(manyAsrCertification.examinerComment);
          expect(result.juryCertificationSummaries[0].hasSeendEndTestScreen).to.equal(manyAsrCertification.hasSeendEndTestScreen);
        });
      });

      context('when the certification has no assessment-result', () => {

        it('should return all juryCertificationSummaries with status started', async () => {
          // given
          const filter = {};
          const page = {};

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.juryCertificationSummaries[1].id).to.equal(startedCertification.id);
          expect(result.juryCertificationSummaries[1].status).to.equal(JuryCertificationSummary.statuses.STARTED);

          expect(result.juryCertificationSummaries[2].id).to.equal(otherStartedCertification.id);
          expect(result.juryCertificationSummaries[2].status).to.equal(JuryCertificationSummary.statuses.STARTED);
        });
      });

      context('when pagination is asked', () => {

        it('should return JuryCertificationSummaries paginated', async () => {
          // given
          const filter = {};
          const page = { size: 1, number: 2 };

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.pagination.page).to.equal(2);
          expect(result.pagination.pageSize).to.equal(1);
          expect(result.pagination.rowCount).to.equal(3);
          expect(result.pagination.pageCount).to.equal(3);
        });
      });

      context('when id filter asked', () => {

        it('should return JuryCertificationSummaries filter by id', async () => {
          // given
          const filter = { id: startedCertification.id };
          const page = {};

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.juryCertificationSummaries.length).to.equal(1);
          expect(result.pagination.rowCount).to.equal(1);
        });
      });

      context('when firstName filter asked', () => {

        it('should return JuryCertificationSummaries filter by firstName', async () => {
          // given
          const filter = { firstName: 'do' };
          const page = {};

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.juryCertificationSummaries.length).to.equal(2);
          expect(result.pagination.rowCount).to.equal(2);
        });
      });

      context('when lastName filter asked', () => {

        it('should return JuryCertificationSummaries filter by lastName', async () => {
          // given
          const filter = { lastName: 'C' };
          const page = {};

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.juryCertificationSummaries.length).to.equal(1);
          expect(result.pagination.rowCount).to.equal(1);
        });
      });

      context('when pixScore filter asked', () => {

        it('should return JuryCertificationSummaries filter by pixScore', async () => {
          // given
          const filter = { pixScore: '42' };
          const page = {};

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.juryCertificationSummaries.length).to.equal(1);
          expect(result.juryCertificationSummaries[0].pixScore).to.equal(42);
          expect(result.pagination.rowCount).to.equal(1);
        });
      });

      context('when status filter asked', () => {

        it('should return JuryCertificationSummaries filter by status', async () => {
          // given
          const filter = { status: 'VALIDATED' };
          const page = {};

          // when
          const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

          // then
          expect(result.juryCertificationSummaries.length).to.equal(1);
          expect(result.juryCertificationSummaries[0].status).to.equal('validated');
          expect(result.pagination.rowCount).to.equal(1);
        });
      });
    });

    context('when no pagination has been asked', () => {
      let sessionId;

      beforeEach(() => {
        sessionId = databaseBuilder.factory.buildSession().id;

        return databaseBuilder.commit();
      });

      it('should return by default page 1 with a pagination of 10', async () => {
        // given
        const filter = {};
        const page = {};

        // when
        const result = await juryCertificationSummaryRepository.findPaginatedFilteredBySessionId({ sessionId, filter, page });

        // then
        expect(result.pagination.page).to.equal(1);
        expect(result.pagination.pageSize).to.equal(10);
      });
    });
  });
});
