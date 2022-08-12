// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, HttpTestServer, sinon } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { cloneDeep } = require('lodash');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Feedback'.
const Feedback = require('../../../../lib/infrastructure/orm-models/Feedback');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'moduleUnde... Remove this comment to see the full error message
const moduleUnderTest = require('../../../../lib/application/feedbacks');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | feedback-controller', function () {
  let httpTestServer: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(async function () {
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    const method = 'POST';
    const url = '/api/feedbacks';

    const jsonFeedback = {
      data: {
        type: 'feedbacks',
        attributes: {
          content: 'Lorem ipsum dolor sit amet consectetur adipiscet.',
        },
        relationships: {
          assessment: {
            data: {
              type: 'assessments',
              id: 'assessment_id',
            },
          },
          challenge: {
            data: {
              type: 'challenges',
              id: 'challenge_id',
            },
          },
        },
      },
    };

    const persistedFeedback = new Feedback({
      id: 'feedback_id',
      content: 'Lorem ipsum dolor sit amet consectetur adipiscet.',
    });

    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(function () {
      sinon.stub(Feedback.prototype, 'save').resolves(persistedFeedback);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a successful response with HTTP code 201 when feedback was saved', async function () {
      // given
      const payload = jsonFeedback;

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should persist feedback data into the Feedback Repository', async function () {
      // given
      const payload = cloneDeep(jsonFeedback);

      // when
      await httpTestServer.request(method, url, payload);

      // then
      expect(Feedback.prototype.save).to.have.been.calledOnce;
    });
  });
});
