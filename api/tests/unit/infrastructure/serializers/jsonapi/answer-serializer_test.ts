// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Answer'.
const Answer = require('../../../../../lib/domain/models/Answer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AnswerStat... Remove this comment to see the full error message
const AnswerStatus = require('../../../../../lib/domain/models/AnswerStatus');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'answerStat... Remove this comment to see the full error message
const answerStatusJSONAPIAdapter = require('../../../../../lib/infrastructure/adapters/answer-status-json-api-adapter');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'serializer... Remove this comment to see the full error message
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/answer-serializer');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Serializer | JSONAPI | answer-serializer', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#serialize', function () {
    const answerId = 1232345;
    const assessmentId = 12345;
    const challengeId = 2134356;
    const timeout = 8;
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const result = AnswerStatus.SKIPPED;
    const resultDetails = null;
    const answerValue = '1';

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert an Answer model object into JSON API data', function () {
      // given
      const answer = domainBuilder.buildAnswer({
        id: answerId,
        result,
        resultDetails,
        timeout,
        value: answerValue,
        assessmentId,
        challengeId,
      });
      const expectedJSON = {
        data: {
          type: 'answers',
          id: answerId.toString(),
          attributes: {
            value: answerValue,
            'result-details': resultDetails,
            timeout: timeout,
            result: answerStatusJSONAPIAdapter.adapt(result),
          },
          relationships: {
            assessment: {
              data: {
                type: 'assessments',
                id: `${assessmentId}`,
              },
            },
            challenge: {
              data: {
                type: 'challenges',
                id: `${challengeId}`,
              },
            },
            correction: {
              links: {
                related: `/api/answers/${answerId}/correction`,
              },
            },
            levelup: {
              data: null,
            },
          },
        },
      };

      // when
      const json = serializer.serialize(answer);

      // then
      expect(json).to.deep.equal(expectedJSON);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#deserialize()', function () {
    let jsonAnswer: $TSFixMe;
    const assessmentId = 'assessmentId',
      challengeId = 'recChallengeId';

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      jsonAnswer = {
        data: {
          type: 'answers',
          attributes: {
            value: 'test\u0000',
            result: null,
            'result-details': null,
            timeout: null,
            'focused-out': true,
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
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should convert JSON API data into an Answer model object', function () {
      // when
      const answer = serializer.deserialize(jsonAnswer);

      // then
      expect(answer).to.be.an.instanceOf(Answer);
      expect(answer.value).to.equal('test');
      expect(answer.result).to.deep.equal(AnswerStatus.from(null));
      expect(answer.resultDetails).to.equal(null);
      expect(answer.timeout).to.equal(null);
      expect(answer.isFocusedOut).to.equal(true);
      expect(answer.assessmentId).to.equal(assessmentId);
      expect(answer.challengeId).to.equal(challengeId);
    });
  });
});
