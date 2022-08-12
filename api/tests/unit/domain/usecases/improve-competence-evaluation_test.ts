// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'improveCom... Remove this comment to see the full error message
const improveCompetenceEvaluation = require('../../../../lib/domain/usecases/improve-competence-evaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
const { MAX_REACHABLE_LEVEL } = require('../../../../lib/domain/constants');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ImproveCom... Remove this comment to see the full error message
const { ImproveCompetenceEvaluationForbiddenError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'domainTran... Remove this comment to see the full error message
const domainTransaction = Symbol('DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | Improve Competence Evaluation', function () {
  let competenceEvaluation: $TSFixMe, userId: $TSFixMe, competenceEvaluationRepository: $TSFixMe, assessmentRepository: $TSFixMe;
  let getCompetenceLevel: $TSFixMe;
  let competenceId: $TSFixMe;
  let expectedAssessment: $TSFixMe;
  let createdAssessment: $TSFixMe;
  const assessmentId = 'created-assessment-id';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    const currentAssessment = new Assessment({
      state: 'completed',
      userId,
      competenceId,
      isImproving: false,
      courseId: '[NOT USED] CompetenceId is in Competence Evaluation.',
      type: 'COMPETENCE_EVALUATION',
    });

    competenceEvaluation = domainBuilder.buildCompetenceEvaluation({ assessment: currentAssessment });
    userId = 'validUserId';
    competenceId = 'recCompetence';
    expectedAssessment = new Assessment({
      state: 'started',
      userId,
      competenceId,
      isImproving: true,
      courseId: '[NOT USED] CompetenceId is in Competence Evaluation.',
      type: 'COMPETENCE_EVALUATION',
      method: 'SMART_RANDOM',
    });
    createdAssessment = { ...expectedAssessment, id: assessmentId };

    competenceEvaluationRepository = {
      getByCompetenceIdAndUserId: sinon.stub().resolves(competenceEvaluation),
      updateAssessmentId: sinon.stub().resolves({ ...competenceEvaluation, assessmentId }),
    };
    assessmentRepository = { save: sinon.stub().resolves(createdAssessment) };
    getCompetenceLevel = sinon.stub().resolves(3);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should retrieve competence evaluation from id', async function () {
    // when
    await improveCompetenceEvaluation({
      assessmentRepository,
      competenceEvaluationRepository,
      getCompetenceLevel,
      userId,
      competenceId,
      domainTransaction,
    });

    // then
    expect(competenceEvaluationRepository.getByCompetenceIdAndUserId).to.be.calledWith({
      competenceId,
      userId,
      domainTransaction,
      forUpdate: true,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an improving assessment', async function () {
    // when
    await improveCompetenceEvaluation({
      assessmentRepository,
      competenceEvaluationRepository,
      getCompetenceLevel,
      userId,
      competenceId,
      domainTransaction,
    });

    // then
    expect(assessmentRepository.save).to.be.calledWith({ assessment: expectedAssessment, domainTransaction });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should update competence evaluation with newly created assessment', async function () {
    // when
    await improveCompetenceEvaluation({
      assessmentRepository,
      competenceEvaluationRepository,
      getCompetenceLevel,
      userId,
      competenceId,
      domainTransaction,
    });

    // then
    expect(competenceEvaluationRepository.updateAssessmentId).to.be.calledWith({
      currentAssessmentId: competenceEvaluation.assessmentId,
      newAssessmentId: assessmentId,
      domainTransaction,
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return competence evaluation with newly created assessment', async function () {
    // given
    const expectedCompetenceEvaluation = competenceEvaluation;
    expectedCompetenceEvaluation.assessmentId = createdAssessment.id;

    // when
    const result = await improveCompetenceEvaluation({
      assessmentRepository,
      competenceEvaluationRepository,
      getCompetenceLevel,
      userId,
      competenceId,
      domainTransaction,
    });

    // then
    expect(result).to.deep.equal(expectedCompetenceEvaluation);
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user has reached maximum level for given competence', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      getCompetenceLevel.resolves(MAX_REACHABLE_LEVEL);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw a Forbidden error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const error = await catchErr(improveCompetenceEvaluation)({
        assessmentRepository,
        competenceEvaluationRepository,
        getCompetenceLevel,
        userId,
        competenceId,
        domainTransaction,
      });

      // then
      expect(error).to.be.instanceOf(ImproveCompetenceEvaluationForbiddenError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('when user has already started the improvement of the competence', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      const currentAssessment = new Assessment({
        state: 'started',
        userId,
        competenceId,
        isImproving: true,
        courseId: '[NOT USED] CompetenceId is in Competence Evaluation.',
        type: 'COMPETENCE_EVALUATION',
      });

      competenceEvaluation = domainBuilder.buildCompetenceEvaluation({ assessment: currentAssessment });
      competenceEvaluationRepository.getByCompetenceIdAndUserId.resolves(competenceEvaluation);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not modify data and return the current competence evaluation', async function () {
      // given
      const expectedCompetenceEvaluation = { ...competenceEvaluation };

      // when
      const result = await improveCompetenceEvaluation({
        assessmentRepository,
        competenceEvaluationRepository,
        getCompetenceLevel,
        userId,
        competenceId,
        domainTransaction,
      });

      // then
      expect(assessmentRepository.save).to.be.not.called;
      expect(competenceEvaluationRepository.updateAssessmentId).to.be.not.called;

      expect(result).to.deep.equal(expectedCompetenceEvaluation);
    });
  });
});
