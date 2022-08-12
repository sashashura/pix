// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, databaseBuilder, knex } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'improveCom... Remove this comment to see the full error message
const improveCompetenceEvaluation = require('../../../../lib/domain/usecases/improve-competence-evaluation');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceEvaluationRepository = require('../../../../lib/infrastructure/repositories/competence-evaluation-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getCompete... Remove this comment to see the full error message
const getCompetenceLevel = require('../../../../lib/domain/services/get-competence-level');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | UseCase | Improve Competence Evaluation', function () {
  const competenceId = 'recCompetenceId';
  let competenceEvaluation: $TSFixMe, userId: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    competenceEvaluation = databaseBuilder.factory.buildCompetenceEvaluation({ userId, competenceId });
    await databaseBuilder.commit();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should create an improving assessment', async function () {
    // when
    await improveCompetenceEvaluation({
      competenceEvaluationRepository,
      assessmentRepository,
      getCompetenceLevel,
      userId,
      competenceId,
    });

    // then
    const [updatedCompetenceEvaluation] = await knex('competence-evaluations').where({ id: competenceEvaluation.id });
    const [assessment] = await knex('assessments').where({ id: updatedCompetenceEvaluation.assessmentId });
    expect(assessment.isImproving).to.equal(true);
  });
});
