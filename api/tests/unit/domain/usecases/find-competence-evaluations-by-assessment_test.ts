// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, catchErr } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const findCompetenceEvaluationsByAssessment = require('../../../../lib/domain/usecases/find-competence-evaluations-by-assessment');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../../../../lib/domain/errors');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | UseCase | find-competence-evaluations-by-assessment', function () {
  const userId = 1;
  const assessmentId = 2;
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const assessmentRepository = { ownedByUser: _.noop() };
  // TODO: Fix this the next time the file is edited.
  // eslint-disable-next-line mocha/no-setup-in-describe
  const competenceEvaluationRepository = { findByAssessmentId: _.noop() };

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    assessmentRepository.ownedByUser = sinon.stub();
    competenceEvaluationRepository.findByAssessmentId = sinon.stub();
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should throw an UserNotAuthorizedToAccessEntityError error when user is not the owner of the assessment', async function () {
    // given
    assessmentRepository.ownedByUser.withArgs({ id: assessmentId, userId }).resolves(false);

    // when
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    const error = await catchErr(findCompetenceEvaluationsByAssessment)({
      userId,
      assessmentId,
      competenceEvaluationRepository,
      assessmentRepository,
    });

    // then
    expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return the assessment competence-evaluations', async function () {
    // given
    const expectedCompetenceEvaluations = Symbol('competenceEvaluations');
    assessmentRepository.ownedByUser.withArgs({ id: assessmentId, userId }).resolves(true);
    competenceEvaluationRepository.findByAssessmentId.withArgs(assessmentId).resolves(expectedCompetenceEvaluations);

    // when
    const actualCompetenceEvaluations = await findCompetenceEvaluationsByAssessment({
      userId,
      assessmentId,
      competenceEvaluationRepository,
      assessmentRepository,
    });

    // then
    expect(actualCompetenceEvaluations).to.deep.equal(expectedCompetenceEvaluations);
  });
});
