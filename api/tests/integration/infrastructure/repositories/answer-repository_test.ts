// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, domainBuilder, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../../../../lib/domain/models/KnowledgeElement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeA... Remove this comment to see the full error message
const { ChallengeAlreadyAnsweredError, NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerRepo... Remove this comment to see the full error message
const answerRepository = require('../../../../lib/infrastructure/repositories/answer-repository');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | answerRepository', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are no answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should reject an error if nothing is found', async function () {
        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(answerRepository.get)(100);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is an answer', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should retrieve an answer from its id', async function () {
        // given
        const expectedAnswer = domainBuilder.buildAnswer({
          id: 1,
          result: AnswerStatus.OK,
          resultDetails: 'some details',
          timeout: 456,
          value: 'Fruits',
          assessmentId: 2,
          challengeId: 'recChallenge123',
          timeSpent: 20,
        });
        databaseBuilder.factory.buildAssessment({ id: 2 });
        databaseBuilder.factory.buildAnswer({
          ...expectedAnswer,
          result: 'ok',
        });
        await databaseBuilder.commit();

        // when
        const foundAnswer = await answerRepository.get(1);

        // then
        expect(foundAnswer).to.deepEqualInstance(expectedAnswer);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByIds', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are no answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty list', async function () {
        // when
        const foundAnswers = await answerRepository.findByIds([100]);

        // then
        expect(foundAnswers).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there are answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should retrieve all answers from its id', async function () {
        // given
        const firstAnswer = domainBuilder.buildAnswer({
          id: 1,
          result: AnswerStatus.OK,
          resultDetails: 'some details',
          timeout: 456,
          value: 'Fruits',
          assessmentId: 2,
          challengeId: 'recChallenge123',
          timeSpent: 20,
        });

        const secondAnswer = domainBuilder.buildAnswer({
          id: 2,
          result: AnswerStatus.KO,
          resultDetails: 'some details',
          timeout: null,
          value: 'Fruits',
          assessmentId: 2,
          challengeId: 'recChallenge456',
          timeSpent: 20,
        });
        databaseBuilder.factory.buildAssessment({ id: 2 });
        databaseBuilder.factory.buildAnswer({ ...secondAnswer, result: 'ko' });
        databaseBuilder.factory.buildAnswer({ ...firstAnswer, result: 'ok' });
        databaseBuilder.factory.buildAnswer();
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByIds([1, 2]);

        // then
        expect(foundAnswers).to.deepEqualArray([firstAnswer, secondAnswer]);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByChallengeAndAssessment', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should returns null if there is no assessment matching', async function () {
      // given
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({ assessmentId: 123, challengeId: 'recChal1' });

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChal1',
        assessmentId: 456,
      });

      // then
      expect(foundAnswer).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should returns null if there is no challengeId matching', async function () {
      // given
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({ assessmentId: 123, challengeId: 'recChal1' });

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChal2',
        assessmentId: 123,
      });

      // then
      expect(foundAnswer).to.be.null;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should find the answer by challenge and assessment', async function () {
      // given
      const expectedAnswer = domainBuilder.buildAnswer({
        id: 1,
        result: AnswerStatus.OK,
        resultDetails: 'some details',
        timeout: 456,
        value: 'Fruits',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 20,
      });
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({
        ...expectedAnswer,
        result: 'ok',
      });
      await databaseBuilder.commit();

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChallenge123',
        assessmentId: 123,
      });

      // then
      expect(foundAnswer).to.deepEqualInstance(expectedAnswer);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the most recent answer when several answers match with challenge and assessment', async function () {
      // given
      const olderAnswer = domainBuilder.buildAnswer({
        id: 1,
        result: AnswerStatus.OK,
        resultDetails: 'some details',
        timeout: 456,
        value: 'Fruits',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 20,
      });
      const newerAnswer = domainBuilder.buildAnswer({
        id: 2,
        result: AnswerStatus.KO,
        resultDetails: 'some other details',
        timeout: null,
        value: 'Légumes',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 25,
      });
      databaseBuilder.factory.buildAssessment({ id: 123 });
      databaseBuilder.factory.buildAnswer({
        ...olderAnswer,
        result: 'ok',
        createdAt: new Date('2020-01-01'),
      });
      databaseBuilder.factory.buildAnswer({
        ...newerAnswer,
        result: 'ko',
        createdAt: new Date('2021-01-01'),
      });
      await databaseBuilder.commit();

      // when
      const foundAnswer = await answerRepository.findByChallengeAndAssessment({
        challengeId: 'recChallenge123',
        assessmentId: 123,
      });

      // then
      expect(foundAnswer).to.deepEqualInstance(newerAnswer);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByAssessment', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ assessmentId: 123 });
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(456);

        // then
        expect(foundAnswers).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment does not have any answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAssessment({ id: 456 });
        databaseBuilder.factory.buildAnswer({ assessmentId: 456 });
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(123);

        // then
        expect(foundAnswers).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has some answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the answers ordered by creation date', async function () {
        // given
        const firstAnswer = domainBuilder.buildAnswer({
          id: 1,
          result: AnswerStatus.OK,
          resultDetails: 'some details',
          timeout: 456,
          value: 'Fruits',
          assessmentId: 123,
          challengeId: 'recChallenge123',
          timeSpent: 20,
        });
        const secondAnswer = domainBuilder.buildAnswer({
          id: 2,
          result: AnswerStatus.KO,
          resultDetails: 'some details',
          timeout: null,
          value: 'Fruits',
          assessmentId: 123,
          challengeId: 'recChallenge456',
          timeSpent: 20,
        });
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ ...secondAnswer, result: 'ko', createdAt: new Date('2020-01-01') });
        databaseBuilder.factory.buildAnswer({ ...firstAnswer, result: 'ok', createdAt: new Date('2019-01-01') });
        databaseBuilder.factory.buildAnswer();
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(123);

        // then
        expect(foundAnswers).to.deepEqualArray([firstAnswer, secondAnswer]);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has some duplicate answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return only one answer, the older one', async function () {
        // given
        const challengeId = 'recChallenge123';
        const olderAnswer = domainBuilder.buildAnswer({
          id: 1,
          assessmentId: 123,
          result: AnswerStatus.KO,
          challengeId,
        });
        const recentAnswer = domainBuilder.buildAnswer({
          id: 2,
          assessmentId: 123,
          result: AnswerStatus.KO,
          challengeId,
        });
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ ...recentAnswer, result: 'ko', createdAt: new Date('2020-01-01') });
        databaseBuilder.factory.buildAnswer({ ...olderAnswer, result: 'ko', createdAt: new Date('2018-01-01') });
        databaseBuilder.factory.buildAnswer();
        await databaseBuilder.commit();

        // when
        const foundAnswers = await answerRepository.findByAssessment(123);

        // then
        expect(foundAnswers).to.have.lengthOf(1);
        expect(foundAnswers).to.deepEqualArray([olderAnswer]);
        expect(foundAnswers[0].id).to.equal(olderAnswer.id);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findLastByAssessment', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment does not exist', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ assessmentId: 123 });
        await databaseBuilder.commit();

        // when
        const foundAnswer = await answerRepository.findLastByAssessment(456);

        // then
        expect(foundAnswer).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment does not have any answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return null', async function () {
        // given
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAssessment({ id: 456 });
        databaseBuilder.factory.buildAnswer({ assessmentId: 456 });
        await databaseBuilder.commit();

        // when
        const foundAnswer = await answerRepository.findLastByAssessment(123);

        // then
        expect(foundAnswer).to.be.null;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when assessment has some answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the latest created answer', async function () {
        // given
        const olderAnswer = domainBuilder.buildAnswer({
          id: 1,
          result: AnswerStatus.OK,
          resultDetails: 'some details',
          timeout: 456,
          value: 'Fruits',
          assessmentId: 123,
          challengeId: 'recChallenge123',
          timeSpent: 20,
        });
        const newerAnswer = domainBuilder.buildAnswer({
          id: 2,
          result: AnswerStatus.KO,
          resultDetails: 'some details',
          timeout: null,
          value: 'Fruits',
          assessmentId: 123,
          challengeId: 'recChallenge456',
          timeSpent: 20,
        });
        databaseBuilder.factory.buildAssessment({ id: 123 });
        databaseBuilder.factory.buildAnswer({ ...newerAnswer, result: 'ko', createdAt: new Date('2020-01-01') });
        databaseBuilder.factory.buildAnswer({ ...olderAnswer, result: 'ok', createdAt: new Date('2019-01-01') });
        databaseBuilder.factory.buildAnswer();
        await databaseBuilder.commit();

        // when
        const foundAnswer = await answerRepository.findLastByAssessment(123);

        // then
        expect(foundAnswer).to.deepEqualInstance(newerAnswer);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findChallengeIdsFromAnswerIds', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when provided answerIds collection is empty', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // when
        const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([]);

        // then
        expect(challengeIds).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when provided answerIds refer to non-existent answers', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return an empty array', async function () {
        // when
        const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([1]);

        // then
        expect(challengeIds).to.be.empty;
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when provided answerIds list contains duplicate ids', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return distinct challengeIds', async function () {
        // given
        databaseBuilder.factory.buildAnswer({ id: 123, challengeId: 'recABC' });
        await databaseBuilder.commit();

        // when
        const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([123, 123]);

        // then
        expect(challengeIds).to.deepEqualArray(['recABC']);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a list of corresponding distinct challenge ids ordered by challenge id', async function () {
      // given
      databaseBuilder.factory.buildAnswer({ id: 123, challengeId: 'recABC' });
      databaseBuilder.factory.buildAnswer({ id: 456, challengeId: 'recDEF' });
      databaseBuilder.factory.buildAnswer({ id: 789, challengeId: 'recGHI' });
      databaseBuilder.factory.buildAnswer({ id: 159, challengeId: 'recABC' });
      await databaseBuilder.commit();

      // when
      const challengeIds = await answerRepository.findChallengeIdsFromAnswerIds([456, 123, 789, 159]);

      // then
      expect(challengeIds).to.deepEqualArray(['recABC', 'recDEF', 'recGHI']);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#saveWithKnowledgeElements', function () {
    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(async function () {
      await knex('knowledge-elements').delete();
      await knex('answers').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save and return the answer', async function () {
      // given
      const answerToSave = domainBuilder.buildAnswer({
        id: null,
        result: AnswerStatus.OK,
        resultDetails: 'some details',
        timeout: 456,
        value: 'Fruits',
        assessmentId: 123,
        challengeId: 'recChallenge123',
        timeSpent: 20,
        isFocusedOut: true,
      });
      databaseBuilder.factory.buildAssessment({ id: 123 });
      await databaseBuilder.commit();

      // when
      const savedAnswer = await answerRepository.saveWithKnowledgeElements(answerToSave, []);

      // then
      const answerInDB = await answerRepository.get(savedAnswer.id);
      expect(savedAnswer).to.deepEqualInstance(answerInDB);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the knowledge elements', async function () {
      // given
      const answerToSave = domainBuilder.buildAnswer({
        id: null,
        assessmentId: 123,
      });
      const knowledgeElement1 = domainBuilder.buildKnowledgeElement({
        id: null,
        createdAt: null,
        source: KnowledgeElement.SourceType.DIRECT,
        status: KnowledgeElement.StatusType.VALIDATED,
        earnedPix: 45,
        answerId: null,
        assessmentId: 123,
        skillId: 'recSkill1',
        userId: 456,
        competenceId: 'recComp1',
      });
      const knowledgeElement2 = domainBuilder.buildKnowledgeElement({
        id: null,
        createdAt: null,
        source: KnowledgeElement.SourceType.INFERRED,
        status: KnowledgeElement.StatusType.INVALIDATED,
        earnedPix: 0,
        answerId: null,
        assessmentId: 123,
        skillId: 'recSkill2',
        userId: 456,
        competenceId: 'recComp2',
      });
      databaseBuilder.factory.buildUser({ id: 456 });
      databaseBuilder.factory.buildAssessment({ id: 123 });
      await databaseBuilder.commit();

      // when
      const savedAnswer = await answerRepository.saveWithKnowledgeElements(answerToSave, [
        knowledgeElement1,
        knowledgeElement2,
      ]);

      // then
      const knowledgeElementsDTOs = await knex
        .select('source', 'status', 'earnedPix', 'answerId', 'assessmentId', 'skillId', 'userId', 'competenceId')
        .from('knowledge-elements')
        .orderBy('skillId');
      expect(knowledgeElementsDTOs[0]).to.deep.equal({
        source: KnowledgeElement.SourceType.DIRECT,
        status: KnowledgeElement.StatusType.VALIDATED,
        earnedPix: 45,
        answerId: savedAnswer.id,
        assessmentId: 123,
        skillId: 'recSkill1',
        userId: 456,
        competenceId: 'recComp1',
      });
      expect(knowledgeElementsDTOs[1]).to.deep.equal({
        source: KnowledgeElement.SourceType.INFERRED,
        status: KnowledgeElement.StatusType.INVALIDATED,
        earnedPix: 0,
        answerId: savedAnswer.id,
        assessmentId: 123,
        skillId: 'recSkill2',
        userId: 456,
        competenceId: 'recComp2',
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when something goes wrong during the saving of the knowledge elements', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not have saved anything', async function () {
        // given
        const answerToSave = domainBuilder.buildAnswer({
          id: null,
          assessmentId: 123,
        });
        const knowledgeElement = domainBuilder.buildKnowledgeElement({
          id: null,
          createdAt: null,
          assessmentId: 123,
          userId: 456, // constraint violation here
        });
        databaseBuilder.factory.buildAssessment({ id: 123 });
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await catchErr(answerRepository.saveWithKnowledgeElements)(answerToSave, [knowledgeElement]);

        // then
        const answerInDB = await knex('answers');
        const knowledgeElementsInDB = await knex('knowledge-elements');
        expect(answerInDB).to.have.length(0);
        expect(knowledgeElementsInDB).to.have.length(0);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when there is already an answer for one challenge in one assessment', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should not have saved anything', async function () {
        // given
        const assessmentId = 123;
        const answerToSave = domainBuilder.buildAnswer({
          id: null,
          assessmentId,
          challengeId: 'challengeId',
        });
        const knowledgeElement = domainBuilder.buildKnowledgeElement({
          id: null,
          createdAt: null,
          assessmentId,
          userId: 456,
        });
        databaseBuilder.factory.buildAssessment({ id: assessmentId });
        const alreadyCreatedAnswerId = databaseBuilder.factory.buildAnswer({
          challengeId: 'challengeId',
          assessmentId,
        }).id;
        await databaseBuilder.commit();

        // when
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        const error = await catchErr(answerRepository.saveWithKnowledgeElements)(answerToSave, [knowledgeElement]);

        // then
        expect(error).to.be.instanceOf(ChallengeAlreadyAnsweredError);
        const answerInDB = await knex('answers');
        const knowledgeElementsInDB = await knex('knowledge-elements');
        expect(answerInDB).to.have.length(1);
        expect(answerInDB[0].id).to.be.equal(alreadyCreatedAnswerId);
        expect(knowledgeElementsInDB).to.have.length(0);
      });
    });
  });
});
