// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultRepository = require('../../../../lib/infrastructure/repositories/assessment-result-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MissingAss... Remove this comment to see the full error message
const { MissingAssessmentId, AssessmentResultNotCreatedError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | AssessmentResult', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('assessment-results').delete();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when save is successful', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the saved assessment result', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        databaseBuilder.factory.buildAssessment({ id: 2, certificationCourseId: 1 });
        await databaseBuilder.commit();
        const assessmentResultToSave = domainBuilder.buildAssessmentResult({
          pixScore: 33,
          reproducibilityRate: 29.1,
          status: AssessmentResult.status.VALIDATED,
          emitter: 'some-emitter',
          commentForCandidate: 'candidate',
          commentForJury: 'jury',
          commentForOrganization: 'orga',
          createdAt: new Date('2021-10-29T03:06:00Z'),
          juryId: 100,
          assessmentId: 2,
          competenceMarks: [],
        });
        assessmentResultToSave.id = undefined;

        // when
        const savedAssessmentResult = await assessmentResultRepository.save(assessmentResultToSave);

        // then
        expect(savedAssessmentResult).to.deepEqualInstanceOmitting(assessmentResultToSave, ['id', 'createdAt']);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should persist the assessment result in DB', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        databaseBuilder.factory.buildAssessment({ id: 2, certificationCourseId: 1 });
        await databaseBuilder.commit();
        const assessmentResultToSave = domainBuilder.buildAssessmentResult({
          pixScore: 33,
          reproducibilityRate: 29.1,
          status: AssessmentResult.status.VALIDATED,
          emitter: 'some-emitter',
          commentForCandidate: 'candidate',
          commentForJury: 'jury',
          commentForOrganization: 'orga',
          createdAt: new Date('2021-10-29T03:06:00Z'),
          juryId: 100,
          assessmentId: 2,
          competenceMarks: [],
        });
        assessmentResultToSave.id = undefined;

        // when
        await assessmentResultRepository.save(assessmentResultToSave);

        // then
        const actualAssessmentResult = await assessmentResultRepository.getByCertificationCourseId({
          certificationCourseId: 1,
        });
        expect(actualAssessmentResult).to.deepEqualInstanceOmitting(assessmentResultToSave, ['id', 'createdAt']);
        expect(actualAssessmentResult.id).to.exist;
        expect(actualAssessmentResult.createdAt).to.exist;
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessmentId attribute is not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a MissingAssessmentId error', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        databaseBuilder.factory.buildAssessment({ id: 2, certificationCourseId: 1 });
        await databaseBuilder.commit();
        const assessmentResultToSave = domainBuilder.buildAssessmentResult({
          pixScore: 33,
          reproducibilityRate: 29.1,
          status: AssessmentResult.status.VALIDATED,
          emitter: 'some-emitter',
          commentForCandidate: 'candidate',
          commentForJury: 'jury',
          commentForOrganization: 'orga',
          createdAt: new Date('2021-10-29T03:06:00Z'),
          juryId: 100,
          assessmentId: null,
          competenceMarks: [],
        });
        assessmentResultToSave.id = undefined;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(assessmentResultRepository.save)(assessmentResultToSave);

        // then
        expect(result).to.be.instanceOf(MissingAssessmentId);
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment result status attribute is not valid', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should throw a AssessmentResultNotCreatedError error', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        databaseBuilder.factory.buildAssessment({ id: 2, certificationCourseId: 1 });
        await databaseBuilder.commit();
        const assessmentResultToSave = domainBuilder.buildAssessmentResult({
          pixScore: 33,
          reproducibilityRate: 29.1,
          status: 'kikou',
          emitter: 'some-emitter',
          commentForCandidate: 'candidate',
          commentForJury: 'jury',
          commentForOrganization: 'orga',
          createdAt: new Date('2021-10-29T03:06:00Z'),
          juryId: 100,
          assessmentId: 2,
          competenceMarks: [],
        });
        assessmentResultToSave.id = undefined;

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const result = await catchErr(assessmentResultRepository.save)(assessmentResultToSave);

        // then
        expect(result).to.be.instanceOf(AssessmentResultNotCreatedError);
      });
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findLatestLevelAndPixScoreByAssessmentId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has one assessment result', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the level and pixScore', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 1 });
        databaseBuilder.factory.buildAssessmentResult({
          assessmentId: 1,
          level: 5,
          pixScore: 9000,
        });
        databaseBuilder.factory.buildAssessmentResult({ level: 4, pixScore: 55, commentForJury: 'comment for jury' });
        await databaseBuilder.commit();

        // when
        const result = await assessmentResultRepository.findLatestLevelAndPixScoreByAssessmentId({
          assessmentId: 1,
        });

        // then
        expect(result).to.deep.equal({ level: 5, pixScore: 9000 });
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification course has several assessment results', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the level and pixScore of the latest assessment result', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 1 });
        databaseBuilder.factory.buildAssessmentResult({
          assessmentId: 1,
          level: 5,
          pixScore: 9000,
          createdAt: new Date('2021-10-29T03:06:00Z'),
        });
        databaseBuilder.factory.buildAssessmentResult({
          assessmentId: 1,
          level: 3,
          pixScore: 8999,
          createdAt: new Date('2022-05-05T03:06:00Z'),
        });
        await databaseBuilder.commit();

        // when
        const { level, pixScore } = await assessmentResultRepository.findLatestLevelAndPixScoreByAssessmentId({
          assessmentId: 1,
        });

        // then
        expect(level).to.equal(3);
        expect(pixScore).to.equal(8999);
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when a limit date is specified', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the level and pixScore of the latest assessment result before that date', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 1 });
        databaseBuilder.factory.buildAssessmentResult({
          assessmentId: 1,
          level: 5,
          pixScore: 9000,
          createdAt: new Date('2021-10-29T03:06:00Z'),
        });
        databaseBuilder.factory.buildAssessmentResult({
          assessmentId: 1,
          level: 3,
          pixScore: 8999,
          createdAt: new Date('2022-05-05T03:06:00Z'),
        });
        databaseBuilder.factory.buildAssessmentResult({
          assessmentId: 1,
          level: 1,
          pixScore: 8,
          createdAt: new Date('2021-12-31T03:06:00Z'),
        });
        await databaseBuilder.commit();

        // when
        const { level, pixScore } = await assessmentResultRepository.findLatestLevelAndPixScoreByAssessmentId({
          assessmentId: 1,
          limitDate: new Date('2022-01-01T03:06:00Z'),
        });

        // then
        expect(level).to.equal(1);
        expect(pixScore).to.equal(8);
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has no assessment-result', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return 0 as level and pixScore', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 1 });
        databaseBuilder.factory.buildAssessment({ id: 2 });
        databaseBuilder.factory.buildAssessmentResult({
          assessmentId: 2,
          level: 5,
          pixScore: 9000,
        });
        await databaseBuilder.commit();

        // when
        const { level, pixScore } = await assessmentResultRepository.findLatestLevelAndPixScoreByAssessmentId({
          assessmentId: 1,
        });

        // then
        expect(level).to.equal(0);
        expect(pixScore).to.equal(0);
      });
    });
  });
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCertificationCourseId', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification course has one assessment result', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the assessment result', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        databaseBuilder.factory.buildAssessment({ id: 2, certificationCourseId: 1 });
        const competenceMark1 = domainBuilder.buildCompetenceMark({
          id: 200,
          level: 3,
          score: 33,
          area_code: 'area1',
          competence_code: 'compCode1',
          competenceId: 'recComp1',
          assessmentResultId: 4,
        });
        const competenceMark2 = domainBuilder.buildCompetenceMark({
          id: 201,
          level: 1,
          score: 2,
          area_code: 'area2',
          competence_code: 'compCode2',
          competenceId: 'recComp2',
          assessmentResultId: 4,
        });
        const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
          id: 4,
          pixScore: 33,
          reproducibilityRate: 29.1,
          status: AssessmentResult.status.VALIDATED,
          emitter: 'some-emitter',
          commentForCandidate: 'candidate',
          commentForJury: 'jury',
          commentForOrganization: 'orga',
          createdAt: new Date('2021-10-29T03:06:00Z'),
          juryId: 100,
          assessmentId: 2,
          competenceMarks: [competenceMark1, competenceMark2],
        });
        databaseBuilder.factory.buildAssessmentResult(expectedAssessmentResult);
        databaseBuilder.factory.buildCompetenceMark(competenceMark1);
        databaseBuilder.factory.buildCompetenceMark(competenceMark2);
        await databaseBuilder.commit();

        // when
        const actualAssessmentResult = await assessmentResultRepository.getByCertificationCourseId({
          certificationCourseId: 1,
        });

        // then
        expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification course has several assessment results', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the latest assessment result', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        databaseBuilder.factory.buildAssessment({ id: 2, certificationCourseId: 1 });
        const competenceMark1 = domainBuilder.buildCompetenceMark({
          id: 200,
          level: 3,
          score: 33,
          area_code: 'area1',
          competence_code: 'compCode1',
          competenceId: 'recComp1',
          assessmentResultId: 4,
        });
        const competenceMark2 = domainBuilder.buildCompetenceMark({
          id: 201,
          level: 1,
          score: 2,
          area_code: 'area2',
          competence_code: 'compCode2',
          competenceId: 'recComp2',
          assessmentResultId: 5,
        });
        const competenceMark3 = domainBuilder.buildCompetenceMark({
          id: 202,
          level: 5,
          score: 200,
          area_code: 'area3',
          competence_code: 'compCode3',
          competenceId: 'recComp3',
          assessmentResultId: 4,
        });
        const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
          id: 4,
          pixScore: 33,
          reproducibilityRate: 29.1,
          status: AssessmentResult.status.VALIDATED,
          emitter: 'some-emitter',
          commentForCandidate: 'candidate',
          commentForJury: 'jury',
          commentForOrganization: 'orga',
          createdAt: new Date('2021-10-29T03:06:00Z'),
          juryId: 100,
          assessmentId: 2,
          competenceMarks: [competenceMark1, competenceMark3],
        });
        databaseBuilder.factory.buildAssessmentResult(expectedAssessmentResult);
        databaseBuilder.factory.buildAssessmentResult({
          id: 5,
          pixScore: 66,
          reproducibilityRate: 28.1,
          status: AssessmentResult.status.REJECTED,
          emitter: 'some-other-emitter',
          commentForCandidate: 'candidates',
          commentForJury: 'jurys',
          commentForOrganization: 'orgas',
          createdAt: new Date('1990-01-01T22:06:00Z'),
          juryId: 100,
          assessmentId: 2,
          competenceMarks: [competenceMark2],
        });
        databaseBuilder.factory.buildCompetenceMark(competenceMark1);
        databaseBuilder.factory.buildCompetenceMark(competenceMark2);
        databaseBuilder.factory.buildCompetenceMark(competenceMark3);
        await databaseBuilder.commit();

        // when
        const actualAssessmentResult = await assessmentResultRepository.getByCertificationCourseId({
          certificationCourseId: 1,
        });

        // then
        expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification course has an assessment but no assessment result', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a started assessment result with assessmentId set', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        databaseBuilder.factory.buildAssessment({ id: 2, certificationCourseId: 1 });
        await databaseBuilder.commit();

        // when
        const actualAssessmentResult = await assessmentResultRepository.getByCertificationCourseId({
          certificationCourseId: 1,
        });

        // then
        const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
          assessmentId: 2,
          status: Assessment.states.STARTED,
          competenceMarks: [],
        });
        expectedAssessmentResult.id = undefined;
        expectedAssessmentResult.commentForCandidate = undefined;
        expectedAssessmentResult.commentForJury = undefined;
        expectedAssessmentResult.commentForOrganization = undefined;
        expectedAssessmentResult.createdAt = undefined;
        expectedAssessmentResult.emitter = undefined;
        expectedAssessmentResult.reproducibilityRate = undefined;
        expectedAssessmentResult.pixScore = undefined;
        expectedAssessmentResult.juryId = undefined;
        expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
      });
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when certification course has no assessment at all', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return a started assessment result with no assessmentId set', async function () {
        // given
        databaseBuilder.factory.buildCertificationCourse({ id: 1 });
        databaseBuilder.factory.buildUser({ id: 100 });
        await databaseBuilder.commit();

        // when
        const actualAssessmentResult = await assessmentResultRepository.getByCertificationCourseId({
          certificationCourseId: 1,
        });

        // then
        const expectedAssessmentResult = domainBuilder.buildAssessmentResult({
          assessmentId: null,
          status: Assessment.states.STARTED,
          competenceMarks: [],
        });
        expectedAssessmentResult.id = undefined;
        expectedAssessmentResult.commentForCandidate = undefined;
        expectedAssessmentResult.commentForJury = undefined;
        expectedAssessmentResult.commentForOrganization = undefined;
        expectedAssessmentResult.createdAt = undefined;
        expectedAssessmentResult.emitter = undefined;
        expectedAssessmentResult.reproducibilityRate = undefined;
        expectedAssessmentResult.pixScore = undefined;
        expectedAssessmentResult.juryId = undefined;
        expect(actualAssessmentResult).to.deepEqualInstance(expectedAssessmentResult);
      });
    });
  });
});
