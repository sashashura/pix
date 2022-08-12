// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationRepository = require('../../../../lib/infrastructure/repositories/tutorial-evaluation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TutorialEv... Remove this comment to see the full error message
const TutorialEvaluation = require('../../../../lib/domain/models/TutorialEvaluation');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | Repository | tutorialEvaluationRepository', function () {
  let userId: $TSFixMe, tutorialId: $TSFixMe, status: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    tutorialId = 'tutorialId';
    status = TutorialEvaluation.statuses.LIKED;
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(async function () {
    await knex('tutorial-evaluations').delete();
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#createOrUpdate', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should store the tutorialId in the users list', async function () {
      // when
      await tutorialEvaluationRepository.createOrUpdate({ userId, tutorialId, status });

      // then
      const tutorialEvaluations = await knex('tutorial-evaluations').where({ userId, tutorialId });
      expect(tutorialEvaluations).to.have.length(1);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the created tutorial evaluation', async function () {
      // when
      const tutorialEvaluation = await tutorialEvaluationRepository.createOrUpdate({
        userId,
        tutorialId,
        status: TutorialEvaluation.statuses.LIKED,
      });

      // then
      const tutorialEvaluations = await knex('tutorial-evaluations').where({
        userId,
        tutorialId,
        status: TutorialEvaluation.statuses.LIKED,
      });
      expect(tutorialEvaluation.id).to.deep.equal(tutorialEvaluations[0].id);
      expect(tutorialEvaluation.userId).to.deep.equal(tutorialEvaluations[0].userId);
      expect(tutorialEvaluation.tutorialId).to.deep.equal(tutorialEvaluations[0].tutorialId);
      expect(tutorialEvaluation.status).to.deep.equal(tutorialEvaluations[0].status);
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the tutorialId already exists in the user list', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should update the status', async function () {
        // given
        const initialDate = new Date('2022-06-06');
        databaseBuilder.factory.buildTutorialEvaluation({
          tutorialId,
          userId,
          status: TutorialEvaluation.statuses.LIKED,
          updatedAt: initialDate,
        });
        await databaseBuilder.commit();

        // when
        const tutorialEvaluation = await tutorialEvaluationRepository.createOrUpdate({
          userId,
          tutorialId,
          status: TutorialEvaluation.statuses.NEUTRAL,
        });

        // then
        const tutorialEvaluations = await knex('tutorial-evaluations').where({ userId, tutorialId });
        expect(tutorialEvaluations).to.have.length(1);
        expect(tutorialEvaluation.id).to.equal(tutorialEvaluations[0].id);
        expect(tutorialEvaluation.userId).to.equal(tutorialEvaluations[0].userId);
        expect(tutorialEvaluation.tutorialId).to.equal(tutorialEvaluations[0].tutorialId);
        expect(tutorialEvaluation.status).to.equal(TutorialEvaluation.statuses.NEUTRAL);
        expect(tutorialEvaluation.updatedAt).to.be.above(initialDate);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#find', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has evaluated some tutorials', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return tutorial-evaluations belonging to given user', async function () {
        // given
        const tutorialId = 'recTutorial';
        databaseBuilder.factory.buildTutorialEvaluation({ tutorialId, userId });
        await databaseBuilder.commit();

        // when
        const tutorialEvaluations = await tutorialEvaluationRepository.find({ userId });

        // then
        expect(tutorialEvaluations).to.have.length(1);
        expect(tutorialEvaluations[0]).to.have.property('tutorialId', tutorialId);
        expect(tutorialEvaluations[0]).to.have.property('userId', userId);
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when user has not evaluated tutorial', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should empty array', async function () {
        const tutorialEvaluations = await tutorialEvaluationRepository.find({ userId });

        // then
        expect(tutorialEvaluations).to.deep.equal([]);
      });
    });
  });
});
