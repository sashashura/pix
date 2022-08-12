// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sinon'.
const { sinon, expect, hFake } = require('../../../test-helper');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const controller = require('../../../../lib/application/assessments/assessment-controller');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('../../../../lib/domain/models/Assessment');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Controller | assessment-controller-save', function () {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2304): Cannot find name 'context'.
    context('when the assessment saved is a preview test', function () {
      const request = {
        headers: {
          authorization: 'Bearer my-token',
        },
        payload: {
          data: {
            id: 42,
            attributes: {
              'estimated-level': 4,
              'pix-score': 4,
              type: 'PREVIEW',
            },
            relationships: {
              course: {
                data: {
                  id: 'null-preview-id',
                },
              },
            },
          },
        },
      };

      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(function () {
        sinon.stub(assessmentRepository, 'save').resolves({});
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should save an assessment with type PREVIEW', async function () {
        // given
        const expected = new Assessment({
          id: 42,
          courseId: null,
          type: 'PREVIEW',
          userId: null,
          state: 'started',
          method: 'CHOSEN',
        });

        // when
        await controller.save(request, hFake);

        // then
        expect(assessmentRepository.save).to.have.been.calledWith({ assessment: expected });
      });
    });
  });
});
