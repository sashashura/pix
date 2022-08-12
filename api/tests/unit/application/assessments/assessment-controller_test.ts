// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentController = require('../../../../lib/application/assessments/assessment-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'events'.
const events = require('../../../../lib/domain/events');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/assessment-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../../../../lib/domain/events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | assessment-controller', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    const authenticatedUserId = '12';
    const locale = 'fr';
    const assessmentId = 104974;

    const assessment = { id: assessmentId, title: 'Ordinary Wizarding Level assessment' };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getAssessment').withArgs({ assessmentId, locale }).resolves(assessment);
      sinon.stub(assessmentSerializer, 'serialize').resolvesArg(0);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the expected usecase', async function () {
      // given
      const request = {
        auth: {
          credentials: {
            userId: authenticatedUserId,
          },
        },
        params: {
          id: assessmentId,
        },
        headers: { 'accept-language': locale },
      };

      // when
      const result = await assessmentController.get(request, hFake);

      // then
      expect(result).to.be.equal(assessment);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#completeAssessment', function () {
    let domainTransaction: $TSFixMe;
    const assessmentId = 2;
    const assessmentCompletedEvent = new AssessmentCompleted();

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      domainTransaction = Symbol('domainTransaction');

      DomainTransaction.execute = (lambda: $TSFixMe) => {
        return lambda(domainTransaction);
      };

      sinon.stub(usecases, 'completeAssessment');
      usecases.completeAssessment.resolves(assessmentCompletedEvent);
      sinon.stub(events.eventDispatcher, 'dispatch');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call the completeAssessment use case', async function () {
      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(usecases.completeAssessment).to.have.been.calledWithExactly({ assessmentId, domainTransaction });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should dispatch the assessment completed event', async function () {
      // when
      await assessmentController.completeAssessment({ params: { id: assessmentId } });

      // then
      expect(events.eventDispatcher.dispatch).to.have.been.calledWith(assessmentCompletedEvent);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#findCompetenceEvaluations', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return the competence evaluations', async function () {
      // given
      const userId = 123;
      const assessmentId = 456;
      const competenceEvaluation1 = domainBuilder.buildCompetenceEvaluation({ assessmentId, userId });
      const competenceEvaluation2 = domainBuilder.buildCompetenceEvaluation({ assessmentId, userId });
      sinon
        .stub(usecases, 'findCompetenceEvaluationsByAssessment')
        .withArgs({ assessmentId, userId })
        .resolves([competenceEvaluation1, competenceEvaluation2]);
      const request = {
        auth: { credentials: { userId } },
        params: {
          id: assessmentId,
        },
      };

      // when
      const result = await assessmentController.findCompetenceEvaluations(request, hFake);

      // then
      expect(result.data).to.be.deep.equal([
        {
          type: 'competence-evaluations',
          id: competenceEvaluation1.id.toString(),
          attributes: {
            'competence-id': competenceEvaluation1.competenceId,
            'user-id': competenceEvaluation1.userId,
            'created-at': competenceEvaluation1.createdAt,
            'updated-at': competenceEvaluation1.updatedAt,
            status: competenceEvaluation1.status,
          },
          relationships: {
            assessment: {
              data: {
                id: assessmentId.toString(),
                type: 'assessments',
              },
            },
            scorecard: {
              links: {
                related: `/api/scorecards/${userId}_${competenceEvaluation1.competenceId}`,
              },
            },
          },
        },
        {
          type: 'competence-evaluations',
          id: competenceEvaluation2.id.toString(),
          attributes: {
            'competence-id': competenceEvaluation2.competenceId,
            'user-id': competenceEvaluation2.userId,
            'created-at': competenceEvaluation2.createdAt,
            'updated-at': competenceEvaluation2.updatedAt,
            status: competenceEvaluation2.status,
          },
          relationships: {
            assessment: {
              data: {
                id: assessmentId.toString(),
                type: 'assessments',
              },
            },
            scorecard: {
              links: {
                related: `/api/scorecards/${userId}_${competenceEvaluation2.competenceId}`,
              },
            },
          },
        },
      ]);
    });
  });
});
