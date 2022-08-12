// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, domainBuilder, hFake } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceEvaluationController = require('../../../../lib/application/competence-evaluations/competence-evaluation-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../lib/infrastructure/serializers/jsonapi/competence-evaluation-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Application | Controller | Competence-Evaluation', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#start', function () {
    let request: $TSFixMe;
    const competenceId = 'recABCD1234';
    const userId = 6;

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'startOrResumeCompetenceEvaluation');
      sinon.stub(serializer, 'serialize');
      request = {
        headers: { authorization: 'token' },
        auth: { credentials: { userId } },
        payload: { competenceId },
      };
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the usecases to start the competence evaluation', async function () {
      // given
      usecases.startOrResumeCompetenceEvaluation.resolves({});

      // when
      await competenceEvaluationController.startOrResume(request, hFake);

      // then
      expect(usecases.startOrResumeCompetenceEvaluation).to.have.been.calledOnce;

      const { userId, competenceId } = usecases.startOrResumeCompetenceEvaluation.firstCall.args[0];

      expect(userId).to.equal(userId);
      expect(competenceId).to.equal(competenceId);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the serialized competence evaluation when it has been successfully created', async function () {
      // given
      const competenceEvaluation = domainBuilder.buildCompetenceEvaluation({ competenceId });
      usecases.startOrResumeCompetenceEvaluation.resolves({ competenceEvaluation, created: true });

      const serializedCompetenceEvaluation = {
        id: 1,
        assessmentId: competenceEvaluation.assessmentId,
        userId: competenceEvaluation.userId,
        competenceId,
      };
      serializer.serialize.returns(serializedCompetenceEvaluation);

      // when
      const response = await competenceEvaluationController.startOrResume(request, hFake);

      // then
      expect(serializer.serialize).to.have.been.calledWith(competenceEvaluation);
      expect(response.statusCode).to.equal(201);
      expect(response.source).to.deep.equal(serializedCompetenceEvaluation);
    });
  });
});
