// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceEvaluation = require('../../../../lib/domain/models/CompetenceEvaluation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | start-or-resume-competence-evaluation', function () {
  const userId = 123;
  const assessmentId = 456;
  const newAssessmentId = 789;
  const competenceId = 'recABC123';
  const competenceEvaluation = { userId, competenceId, assessmentId };
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const competenceRepository = { get: _.noop };
  const competenceEvaluationRepository = {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    save: _.noop,
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    getByCompetenceIdAndUserId: _.noop,
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    updateStatusByUserIdAndCompetenceId: _.noop,
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    updateAssessmentId: _.noop,
  };
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const assessmentRepository = { save: _.noop };
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const updatedCompetenceEvaluation = Symbol('updated competence evaluation');

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(competenceRepository, 'get');
    sinon.stub(competenceEvaluationRepository, 'save');
    sinon.stub(competenceEvaluationRepository, 'getByCompetenceIdAndUserId');
    sinon.stub(competenceEvaluationRepository, 'updateStatusByUserIdAndCompetenceId');
    sinon.stub(competenceEvaluationRepository, 'updateAssessmentId');
    sinon.stub(assessmentRepository, 'save');
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the competence does not exist', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should bubble the domain NotFoundError', async function () {
      // given
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      const notFoundError = new NotFoundError('La compétence demandée n’existe pas');
      competenceRepository.get.withArgs({ id: competenceId }).rejects(notFoundError);

      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(usecases.startOrResumeCompetenceEvaluation)({
        competenceId,
        userId,
        competenceEvaluationRepository,
        assessmentRepository,
        competenceRepository,
      });

      // then
      expect(err).to.deep.equal(notFoundError);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the competence could not be retrieved', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      competenceRepository.get.withArgs({ id: competenceId }).resolves();
      competenceEvaluationRepository.getByCompetenceIdAndUserId.rejects(new Error());
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should forward the error', async function () {
      // when
      // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
      const err = await catchErr(usecases.startOrResumeCompetenceEvaluation)({
        competenceId,
        userId,
        competenceEvaluationRepository,
        assessmentRepository,
        competenceRepository,
      });
      // then
      expect(err).to.be.instanceOf(Error);
    });
  });
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('When the competence exists', function () {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      competenceRepository.get.withArgs({ id: competenceId }).resolves();
    });
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user starts a new competence evaluation', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        competenceEvaluationRepository.getByCompetenceIdAndUserId.rejects(new NotFoundError());
        const expectedAssessment = {
          userId,
          competenceId,
          state: Assessment.states.STARTED,
          courseId: Assessment.courseIdMessage.COMPETENCE_EVALUATION,
          type: Assessment.types.COMPETENCE_EVALUATION,
        };
        assessmentRepository.save
          .withArgs({ assessment: sinon.match(expectedAssessment) })
          .resolves({ id: assessmentId });
        const competenceEvaluationToSave = new CompetenceEvaluation({
          status: CompetenceEvaluation.statuses.STARTED,
          assessmentId,
          competenceId,
          userId,
        });
        competenceEvaluationRepository.save
          .withArgs({ competenceEvaluation: competenceEvaluationToSave })
          .resolves(competenceEvaluation);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the created competence evaluation', async function () {
        const res = await usecases.startOrResumeCompetenceEvaluation({
          competenceId,
          userId,
          competenceEvaluationRepository,
          assessmentRepository,
          competenceRepository,
        });
        expect(res).to.deep.equal({ competenceEvaluation, created: true });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user resumes a competence evaluation', function () {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        competenceEvaluationRepository.getByCompetenceIdAndUserId.resolves(competenceEvaluation);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the existing competence evaluation', async function () {
        // given
        const res = await usecases.startOrResumeCompetenceEvaluation({
          competenceId,
          userId,
          competenceEvaluationRepository,
          assessmentRepository,
          competenceRepository,
        });
        expect(res).to.deep.equal({ competenceEvaluation, created: false });
      });
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('When the user restarts a competence evaluation', function () {
      let resetCompetenceEvaluation, res: $TSFixMe;
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        resetCompetenceEvaluation = { ...competenceEvaluation, status: CompetenceEvaluation.statuses.RESET };
        competenceEvaluationRepository.getByCompetenceIdAndUserId
          .onFirstCall()
          .resolves(resetCompetenceEvaluation)
          .onSecondCall()
          .resolves(updatedCompetenceEvaluation);

        const expectedAssessment = {
          userId,
          competenceId,
          state: Assessment.states.STARTED,
          courseId: Assessment.courseIdMessage.COMPETENCE_EVALUATION,
          type: Assessment.types.COMPETENCE_EVALUATION,
        };
        assessmentRepository.save
          .withArgs({ assessment: sinon.match(expectedAssessment) })
          .resolves({ id: newAssessmentId });
        competenceEvaluationRepository.updateStatusByUserIdAndCompetenceId.resolves();
        competenceEvaluationRepository.updateAssessmentId.resolves();

        res = await usecases.startOrResumeCompetenceEvaluation({
          competenceId,
          userId,
          competenceEvaluationRepository,
          assessmentRepository,
          competenceRepository,
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the updated competenceEvaluation', function () {
        expect(res).to.deep.equal({ competenceEvaluation: updatedCompetenceEvaluation, created: false });
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have updated the status', function () {
        expect(competenceEvaluationRepository.updateStatusByUserIdAndCompetenceId).to.have.been.calledWithExactly({
          userId,
          competenceId: competenceEvaluation.competenceId,
          status: CompetenceEvaluation.statuses.STARTED,
        });
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should have updated the assessment id to the newly created assessment id', function () {
        expect(competenceEvaluationRepository.updateAssessmentId).to.have.been.calledWithExactly({
          currentAssessmentId: competenceEvaluation.assessmentId,
          newAssessmentId: newAssessmentId,
        });
      });
    });
  });
});
