// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, knex, databaseBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceEvaluation = require('../../../../lib/domain/models/CompetenceEvaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceEvaluationRepository = require('../../../../lib/infrastructure/repositories/competence-evaluation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Repository | Competence Evaluation', function () {
  const STARTED = 'started';
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    let assessment: $TSFixMe;
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      assessment = databaseBuilder.factory.buildAssessment({});
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
    afterEach(function () {
      return knex('competence-evaluations').delete();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the given competence evaluation', async function () {
      // given
      const competenceEvaluationToSave = new CompetenceEvaluation({
        assessmentId: assessment.id,
        competenceId: 'recABCD1234',
        status: STARTED,
        userId: assessment.userId,
      });

      // when
      const savedCompetenceEvaluation = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => competenceEvaluationRepository.save({ competenceEvaluation: competenceEvaluationToSave, domainTransaction })
      );

      // then
      expect(savedCompetenceEvaluation).to.be.instanceof(CompetenceEvaluation);
      expect(savedCompetenceEvaluation.id).to.exist;
      expect(savedCompetenceEvaluation.createdAt).to.exist;
      expect(savedCompetenceEvaluation.status).to.equal(STARTED);
      expect(savedCompetenceEvaluation.assessmentId).to.equal(competenceEvaluationToSave.assessmentId);
      expect(savedCompetenceEvaluation.competenceId).to.equal(competenceEvaluationToSave.competenceId);
      expect(savedCompetenceEvaluation.userId).to.equal(competenceEvaluationToSave.userId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should save the given competence evaluation', async function () {
      // given
      const competenceEvaluationToSave = new CompetenceEvaluation({
        assessmentId: assessment.id,
        competenceId: 'recABCD1234',
        status: STARTED,
        userId: assessment.userId,
      });

      // when
      const savedCompetenceEvaluation = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => competenceEvaluationRepository.save({ competenceEvaluation: competenceEvaluationToSave, domainTransaction })
      );

      // then
      return knex
        .select('id', 'assessmentId', 'competenceId', 'userId', 'status')
        .from('competence-evaluations')
        .where({ id: savedCompetenceEvaluation.id })
        // @ts-expect-error TS(7031): Binding element 'competenceEvaluationInDb' implici... Remove this comment to see the full error message
        .then(([competenceEvaluationInDb]) => {
          expect(competenceEvaluationInDb.id).to.equal(savedCompetenceEvaluation.id);
          expect(competenceEvaluationInDb.assessmentId).to.equal(competenceEvaluationToSave.assessmentId);
          expect(competenceEvaluationInDb.competenceId).to.equal(competenceEvaluationToSave.competenceId);
          expect(competenceEvaluationInDb.userId).to.equal(competenceEvaluationToSave.userId);
          expect(competenceEvaluationInDb.status).to.equal('started');
        });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not save the given competence evaluation if it already exists', async function () {
      // given
      const competenceEvaluationToSave = new CompetenceEvaluation({
        assessmentId: assessment.id,
        competenceId: 'recABCD1234',
        status: STARTED,
        userId: assessment.userId,
      });
      await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => competenceEvaluationRepository.save({ competenceEvaluation: competenceEvaluationToSave, domainTransaction })
      );

      // when
      const savedCompetenceEvaluation = await DomainTransaction.execute(async (domainTransaction: $TSFixMe) => competenceEvaluationRepository.save({ competenceEvaluation: competenceEvaluationToSave, domainTransaction })
      );

      // then
      return knex
        .select('id', 'assessmentId', 'competenceId', 'userId', 'status')
        .from('competence-evaluations')
        .where({ id: savedCompetenceEvaluation.id })
        .then((result: $TSFixMe) => {
          expect(result.length).to.equal(1);
          expect(result[0].id).to.equal(savedCompetenceEvaluation.id);
          expect(result[0].assessmentId).to.equal(competenceEvaluationToSave.assessmentId);
          expect(result[0].competenceId).to.equal(competenceEvaluationToSave.competenceId);
          expect(result[0].userId).to.equal(competenceEvaluationToSave.userId);
          expect(result[0].status).to.equal('started');
        });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByAssessmentId', function () {
    let assessmentForExpectedCompetenceEvaluation: $TSFixMe, assessmentNotExpected: $TSFixMe;
    let competenceEvaluationExpected: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      assessmentForExpectedCompetenceEvaluation = databaseBuilder.factory.buildAssessment({
        type: Assessment.types.COMPETENCE_EVALUATION,
      });
      assessmentNotExpected = databaseBuilder.factory.buildAssessment({
        type: Assessment.types.COMPETENCE_EVALUATION,
      });
      competenceEvaluationExpected = databaseBuilder.factory.buildCompetenceEvaluation({
        userId: assessmentForExpectedCompetenceEvaluation.userId,
        assessmentId: assessmentForExpectedCompetenceEvaluation.id,
        status: STARTED,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the competence evaluation linked to the assessment', function () {
      // when
      const promise = competenceEvaluationRepository.getByAssessmentId(assessmentForExpectedCompetenceEvaluation.id);

      // then
      return promise.then((competenceEvaluation: $TSFixMe) => {
        expect(_.omit(competenceEvaluation, ['assessment', 'scorecard'])).to.deep.equal(
          _.omit(competenceEvaluationExpected, ['assessment'])
        );
        expect(competenceEvaluation.assessment.id).to.deep.equal(assessmentForExpectedCompetenceEvaluation.id);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error when there is no competence evaluation', function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const promise = catchErr(competenceEvaluationRepository.getByAssessmentId)(assessmentNotExpected.id);

      // then
      return promise.then((error) => {
        expect(error).to.be.instanceof(NotFoundError);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getByCompetenceIdAndUserId', function () {
    let user: $TSFixMe;
    let competenceEvaluationExpected: $TSFixMe, assessmentExpected: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      user = databaseBuilder.factory.buildUser({});

      assessmentExpected = databaseBuilder.factory.buildAssessment({
        userId: user.id,
        type: Assessment.types.COMPETENCE_EVALUATION,
      });

      competenceEvaluationExpected = databaseBuilder.factory.buildCompetenceEvaluation({
        userId: user.id,
        competenceId: '1',
        assessmentId: assessmentExpected.id,
        status: STARTED,
      });
      databaseBuilder.factory.buildCompetenceEvaluation({
        userId: user.id,
        competenceId: '2',
        status: STARTED,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the competence evaluation linked to the competence id', function () {
      // when
      const promise = competenceEvaluationRepository.getByCompetenceIdAndUserId({ competenceId: 1, userId: user.id });

      // then
      return promise.then((competenceEvaluation: $TSFixMe) => {
        expect(_.omit(competenceEvaluation, ['assessment', 'scorecard'])).to.deep.equal(
          _.omit(competenceEvaluationExpected, ['assessment'])
        );
        expect(competenceEvaluation.assessment.id).to.deep.equal(assessmentExpected.id);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return an error when there is no competence evaluation', function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const promise = catchErr(competenceEvaluationRepository.getByCompetenceIdAndUserId)({
        competenceId: 'fakeId',
        userId: user.id,
      });

      // then
      return promise.then((error) => {
        expect(error).to.be.instanceof(NotFoundError);
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return only one competence evaluation linked to the competence id', async function () {
      // given
      const anotherAssessment = databaseBuilder.factory.buildAssessment({
        userId: user.id,
        type: Assessment.types.COMPETENCE_EVALUATION,
      });

      databaseBuilder.factory.buildCompetenceEvaluation({
        userId: user.id,
        competenceId: '1',
        assessmentId: anotherAssessment.id,
        status: STARTED,
      });

      // when
      const result = await competenceEvaluationRepository.getByCompetenceIdAndUserId({
        competenceId: 1,
        userId: user.id,
      });

      // then
      expect(_.omit(result, ['assessment', 'scorecard'])).to.deep.equal(
        _.omit(competenceEvaluationExpected, ['assessment'])
      );
      expect(result.assessment.id).to.deep.equal(assessmentExpected.id);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByUserId', function () {
    let user: $TSFixMe;
    let competenceEvaluationExpected: $TSFixMe, assessmentExpected: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      user = databaseBuilder.factory.buildUser({});
      const otherUser = databaseBuilder.factory.buildUser({});

      assessmentExpected = databaseBuilder.factory.buildAssessment({
        userId: user.id,
        type: Assessment.types.COMPETENCE_EVALUATION,
      });

      competenceEvaluationExpected = databaseBuilder.factory.buildCompetenceEvaluation({
        userId: user.id,
        competenceId: '1',
        assessmentId: assessmentExpected.id,
        createdAt: new Date('2018-01-01'),
        status: STARTED,
      });
      databaseBuilder.factory.buildCompetenceEvaluation({
        userId: user.id,
        competenceId: '1',
        createdAt: new Date('2018-01-02'),
        status: STARTED,
      });

      databaseBuilder.factory.buildCompetenceEvaluation({
        userId: user.id,
        competenceId: '2',
        createdAt: new Date('2017-01-01'),
        status: STARTED,
      });

      databaseBuilder.factory.buildCompetenceEvaluation({
        userId: otherUser.id,
        competenceId: '2',
        status: STARTED,
      });

      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the competence evaluation linked to the competence id', function () {
      // when
      const promise = competenceEvaluationRepository.findByUserId(user.id);

      // then
      return promise.then((competenceEvaluation: $TSFixMe) => {
        expect(competenceEvaluation).to.have.length(2);
        expect(_.omit(competenceEvaluation[0], ['assessment', 'scorecard'])).to.deep.equal(
          _.omit(competenceEvaluationExpected, ['assessment'])
        );
        expect(competenceEvaluation[0].assessment.id).to.deep.equal(assessmentExpected.id);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findByAssessmentId', function () {
    let assessmentId: $TSFixMe;
    let competenceEvaluationExpected: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      // given
      assessmentId = databaseBuilder.factory.buildAssessment({
        type: Assessment.types.COMPETENCE_EVALUATION,
      }).id;

      competenceEvaluationExpected = databaseBuilder.factory.buildCompetenceEvaluation({
        competenceId: '1',
        assessmentId,
        createdAt: new Date('2018-01-01'),
        status: STARTED,
      });
      databaseBuilder.factory.buildCompetenceEvaluation({
        competenceId: '2',
        createdAt: new Date('2017-01-01'),
        status: STARTED,
      });

      return databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the competence evaluation linked to the assessmentId', async function () {
      // when
      const competenceEvaluations = await competenceEvaluationRepository.findByAssessmentId(assessmentId);

      // then
      expect(competenceEvaluations).to.have.length(1);
      expect(_.omit(competenceEvaluations[0], ['assessment', 'scorecard'])).to.deep.equal(
        _.omit(competenceEvaluationExpected, ['assessment'])
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateStatusByAssessmentId', function () {
    let assessment: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      assessment = databaseBuilder.factory.buildAssessment({});
      databaseBuilder.factory.buildCompetenceEvaluation({ assessmentId: assessment.id, status: 'current_status' });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the competence status', async function () {
      // when
      const updatedCompetenceEvaluation = await competenceEvaluationRepository.updateStatusByAssessmentId({
        assessmentId: assessment.id,
        status: 'new_status',
      });

      // then
      expect(updatedCompetenceEvaluation).to.be.instanceOf(CompetenceEvaluation);
      expect(updatedCompetenceEvaluation.status).to.equal('new_status');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateAssessmentId', function () {
    let currentAssessmentId: $TSFixMe, newAssessmentId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      currentAssessmentId = databaseBuilder.factory.buildAssessment({}).id;
      newAssessmentId = databaseBuilder.factory.buildAssessment({}).id;
      databaseBuilder.factory.buildCompetenceEvaluation({ assessmentId: currentAssessmentId });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the assessment id', async function () {
      // when
      const updatedCompetenceEvaluation = await competenceEvaluationRepository.updateAssessmentId({
        currentAssessmentId,
        newAssessmentId,
      });

      // then
      expect(updatedCompetenceEvaluation).to.be.instanceOf(CompetenceEvaluation);
      expect(updatedCompetenceEvaluation.assessmentId).to.equal(newAssessmentId);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#updateStatusByUserIdAndCompetenceId', function () {
    const competenceId = 'recABCD1234';
    let userId: $TSFixMe, otherUserId: $TSFixMe;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(async function () {
      // given
      userId = databaseBuilder.factory.buildUser({}).id;
      otherUserId = databaseBuilder.factory.buildUser({}).id;
      databaseBuilder.factory.buildCompetenceEvaluation({ userId, competenceId, status: 'current_status' });
      databaseBuilder.factory.buildCompetenceEvaluation({
        userId: otherUserId,
        competenceId,
        status: 'current_status',
      });
      await databaseBuilder.commit();
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should update the competence status', async function () {
      // when
      const updatedCompetenceEvaluation = await competenceEvaluationRepository.updateStatusByUserIdAndCompetenceId({
        userId,
        competenceId,
        status: 'new_status',
      });
      const unchangedCompetenceEvaluation = await competenceEvaluationRepository.getByCompetenceIdAndUserId({
        competenceId,
        userId: otherUserId,
      });

      // then
      expect(updatedCompetenceEvaluation).to.be.instanceOf(CompetenceEvaluation);
      expect(updatedCompetenceEvaluation.status).to.equal('new_status');
      expect(unchangedCompetenceEvaluation.status).to.equal('current_status');
    });
  });
});
