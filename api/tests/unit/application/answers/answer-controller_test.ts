// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon, domainBuilder, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerCont... Remove this comment to see the full error message
const answerController = require('../../../../lib/application/answers/answer-controller');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerRepo... Remove this comment to see the full error message
const answerRepository = require('../../../../lib/infrastructure/repositories/answer-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerSeri... Remove this comment to see the full error message
const answerSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/answer-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'correction... Remove this comment to see the full error message
const correctionSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/correction-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../../../lib/domain/usecases');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'requestRes... Remove this comment to see the full error message
const requestResponseUtils = require('../../../../lib/infrastructure/utils/request-response-utils');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | answer-controller', function () {
  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    sinon.stub(answerSerializer, 'serialize');
    sinon.stub(answerRepository, 'findByChallengeAndAssessment');
    sinon.stub(usecases, 'correctAnswerThenUpdateAssessment');
    sinon.stub(requestResponseUtils, 'extractUserIdFromRequest');
    sinon.stub(requestResponseUtils, 'extractLocaleFromRequest');
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    const answerId = 1212;
    const assessmentId = 12;
    const challengeId = 'recdTpx4c0kPPDTtf';
    const result = null;
    const timeout = null;
    const focusedOut = false;
    const resultDetails = null;
    const value = 'NumA = "4", NumB = "1", NumC = "3", NumD = "2"';
    const locale = 'fr-fr';

    let request: $TSFixMe;
    let deserializedAnswer: $TSFixMe;
    const serializedAnswer = {
      data: {
        type: 'answers',
        id: answerId,
        attributes: {
          value: 'NumA = "4", NumB = "1", NumC = "3", NumD = "2"',
          'result-details': 'resultDetails_value',
          timeout: null,
          result: 'result_value',
          'focused-out': focusedOut,
        },
        relationships: {
          assessment: {
            data: {
              type: 'assessments',
              id: assessmentId,
            },
          },
          challenge: {
            data: {
              type: 'challenges',
              id: challengeId,
            },
          },
        },
      },
    };

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      request = {
        headers: {
          'accept-language': locale,
        },
        payload: {
          data: {
            attributes: {
              value: value,
              result: result,
              timeout: timeout,
              'focused-out': focusedOut,
              'result-details': resultDetails,
            },
            relationships: {
              assessment: {
                data: {
                  type: 'assessments',
                  id: assessmentId,
                },
              },
              challenge: {
                data: {
                  type: 'challenges',
                  id: challengeId,
                },
              },
            },
            type: 'answers',
          },
        },
      };
      deserializedAnswer = domainBuilder.buildAnswer({
        result,
        resultDetails,
        timeout,
        value,
        assessmentId,
        challengeId,
        focusedOut,
      });
      deserializedAnswer.id = undefined;
    });

    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when answer does not exist', function () {
      let createdAnswer: $TSFixMe;
      let response: $TSFixMe;
      const userId = 3;

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(async function () {
        // given
        deserializedAnswer.id = undefined;
        deserializedAnswer.timeSpent = undefined;
        createdAnswer = domainBuilder.buildAnswer({ assessmentId });
        answerSerializer.serialize.returns(serializedAnswer);
        usecases.correctAnswerThenUpdateAssessment.resolves(createdAnswer);
        requestResponseUtils.extractUserIdFromRequest.withArgs(request).returns(userId);
        requestResponseUtils.extractLocaleFromRequest.withArgs(request).returns(locale);

        // when
        response = await answerController.save(request, hFake);
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should call the usecase to save the answer', function () {
        // then
        expect(usecases.correctAnswerThenUpdateAssessment).to.have.been.calledWith({
          answer: deserializedAnswer,
          userId,
          locale,
        });
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should serialize the answer', function () {
        // then
        expect(answerSerializer.serialize).to.have.been.calledWith(createdAnswer);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should return the serialized answer', function () {
        // then
        expect(response.source).to.deep.equal(serializedAnswer);
        expect(response.statusCode).to.equal(201);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#getCorrection', function () {
    const answerId = 1;
    const userId = 'userId';
    const locale = 'lang-country';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(usecases, 'getCorrectionForAnswer');
      sinon.stub(correctionSerializer, 'serialize');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return ok', async function () {
      // given
      requestResponseUtils.extractUserIdFromRequest.returns(userId);
      requestResponseUtils.extractLocaleFromRequest.returns(locale);
      usecases.getCorrectionForAnswer.withArgs({ answerId, userId, locale }).resolves({});
      correctionSerializer.serialize.withArgs({}).returns('ok');

      // when
      const response = await answerController.getCorrection({ params: { id: answerId } });

      // then
      expect(response).to.be.equal('ok');
    });
  });
});
