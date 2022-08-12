// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'flashAsses... Remove this comment to see the full error message
const flashAssessmentResultRepository = require('../../../../lib/infrastructure/repositories/flash-assessment-result-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | FlashAssessmentResultRepository', function () {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('flash-assessment-results').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getLatestByAssessmentId', function () {
    let assessmentId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      assessmentId = databaseBuilder.factory.buildAssessment({ method: 'FLASH' }).id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has no answers yet', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return undefined', async function () {
        // when
        const result = await flashAssessmentResultRepository.getLatestByAssessmentId(assessmentId);

        // then
        expect(result).to.be.undefined;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has one answer', function () {
      let expectedResult: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        expectedResult = databaseBuilder.factory.buildFlashAssessmentResult({ assessmentId });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return flash result for this answer', async function () {
        // when
        const result = await flashAssessmentResultRepository.getLatestByAssessmentId(assessmentId);

        // then
        expect(result).to.contain({
          id: expectedResult.id,
          estimatedLevel: expectedResult.estimatedLevel,
          errorRate: expectedResult.errorRate,
        });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has several answers', function () {
      let expectedResult: $TSFixMe;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        const thirdAnswer = databaseBuilder.factory.buildAnswer({ assessmentId, createdAt: new Date('2022-01-03') });
        const secondAnswer = databaseBuilder.factory.buildAnswer({ assessmentId, createdAt: new Date('2022-01-02') });
        const firstAnswer = databaseBuilder.factory.buildAnswer({ assessmentId, createdAt: new Date('2022-01-01') });
        expectedResult = databaseBuilder.factory.buildFlashAssessmentResult({
          answerId: thirdAnswer.id,
          estimatedLevel: 1,
          errorRate: 2,
        });
        databaseBuilder.factory.buildFlashAssessmentResult({
          answerId: secondAnswer.id,
          estimatedLevel: 3,
          errorRate: 4,
        });
        databaseBuilder.factory.buildFlashAssessmentResult({
          answerId: firstAnswer.id,
          estimatedLevel: 5,
          errorRate: 6,
        });
        await databaseBuilder.commit();
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return flash result for the latest answer', async function () {
        // when
        const result = await flashAssessmentResultRepository.getLatestByAssessmentId(assessmentId);

        // then
        expect(result).to.contain({
          id: expectedResult.id,
          estimatedLevel: expectedResult.estimatedLevel,
          errorRate: expectedResult.errorRate,
        });
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    let answerId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      answerId = databaseBuilder.factory.buildAnswer().id;
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should create a result with estimated level and error rate', async function () {
      // when
      await flashAssessmentResultRepository.save({
        answerId,
        estimatedLevel: 1.9,
        errorRate: 1.3,
      });

      // then
      const createdResult = await knex('flash-assessment-results').select().where({ answerId }).first();
      expect(createdResult).to.contain({
        answerId,
        estimatedLevel: 1.9,
        errorRate: 1.3,
      });
    });
  });
});
